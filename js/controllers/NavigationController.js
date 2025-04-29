// js/controllers/NavigationController.js - 管理焦点和导航
const NavigationController = {
    currentFocus: 'terminal',
    menuItems: [],
    menuIndex: 0,
    focusMode: 'system', // 'system'(系统菜单/终端) 或 'app'(应用内部)
    
    init: function() {
        this.menuItems = Array.from(document.querySelectorAll('.menu-item'));
        this.updateHighlight();
        this.initEventListeners();
    },
    
    initEventListeners: function() {
        document.addEventListener('keydown', this.handleKeyNavigation.bind(this));
        
        // 终端点击事件
        document.getElementById('terminal').addEventListener('click', (e) => {
            e.stopPropagation(); 
            this.switchFocus('terminal');
            this.setFocusMode('system');
        });
        
        // 菜单面板点击事件
        document.querySelector('.menu-panel').addEventListener('click', (e) => {
            e.stopPropagation();
            // 只在点击到菜单面板空白处时切换焦点
            if (e.target.classList.contains('menu-panel') || 
                e.target.classList.contains('menu-title')) {
                this.switchFocus('menu');
                this.setFocusMode('system');
            }
        });
        
        // 为每个菜单项添加点击事件
        this.menuItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                // 更新选中的菜单索引
                this.menuIndex = index;
                this.updateHighlight();
                
                // 如果点击的是应用程序项，设置为应用模式
                const appId = item.getAttribute('data-app');
                if (appId && appId !== 'terminal') {
                    // 延迟设置应用模式，确保在应用启动后执行
                    setTimeout(() => {
                        this.setFocusMode('app');
                    }, 50);
                }
            });
        });
    },
    
    // 设置焦点模式
    setFocusMode: function(mode) {
        if (this.focusMode === mode) return; // 避免重复设置
        
        this.focusMode = mode;
        
        // 处理UI反馈
        if (mode === 'app') {
            // 隐藏系统菜单的选中效果
            this.menuItems.forEach(item => item.classList.remove('selected'));
            UserInterfaceView.updateInfoBar("APP MODE: USE ESC TO RETURN");
            
            // 发布应用激活事件
            EventBus.publish('app:activated', SystemModel.currentScreen);
        } else {
            // 恢复系统菜单的选中效果
            this.updateHighlight();
            if (this.currentFocus === 'menu') {
                const selectedText = this.getSelectedItemText();
                UserInterfaceView.updateInfoBar(`SELECT: ${selectedText}`);
            } else {
                UserInterfaceView.updateInfoBar("MODE: COMMAND INPUT");
            }
        }
        
        EventBus.publish('navigation:modeChanged', mode);
    },

    // 切换焦点区域
    switchFocus: function(target) {
        this.currentFocus = target;
        
        if (target === 'terminal') {
            document.querySelector('.cursor').style.display = 'inline-block';
            document.getElementById('user-input').focus();
            UserInterfaceView.updateInfoBar("MODE: COMMAND INPUT");
        } else {
            document.querySelector('.cursor').style.display = 'none';
            document.getElementById('user-input').blur();
            this.ensureSelection();
            const selectedText = this.getSelectedItemText();
            UserInterfaceView.updateInfoBar(`SELECT: ${selectedText}`);
        }
        
        EventBus.publish('navigation:focusChanged', target);
    },
    
    // 处理键盘导航
    handleKeyNavigation: function(e) {
            // 如果在应用模式下，不要处理菜单导航键
            if (this.focusMode === 'app') {
                // 只处理ESC键
                if (e.key === 'Escape') {
                    // 检查是否是文件浏览器的详情视图
                    if (SystemModel.currentScreen === 'fileExplorer' && 
                        FileView && FileView.currentView === 'detail') {
                        // 让FileView处理这个事件
                        return; // 不执行后续代码
                    }
                    
                    // 检查是否是文件浏览器的非根目录
                    if (SystemModel.currentScreen === 'fileExplorer' && 
                        FileView && FileView.currentPath !== "") {
                        // 让FileView处理这个事件
                        return; // 不执行后续代码
                    }
                    
                    // 从应用模式退出到系统菜单 (其他情况)
                    this.setFocusMode('system');
                    this.switchFocus('menu');
                    
                    // 触发应用退出事件
                    EventBus.publish('app:requestExit');
                    e.preventDefault();
                }
                return; // 在应用模式下不处理其他键
        }
        
        // 系统模式下的ESC键处理
        if (e.key === 'Escape' && this.currentFocus === 'menu') {
            // 从系统菜单退出到终端
            this.switchFocus('terminal');
            e.preventDefault();
            return;
        }
        
        // 方向键导航 - 只在系统模式下处理
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            if (e.key === 'ArrowUp') {
                this.navigateUp();
            } else {
                this.navigateDown();
            }
            
            // 如果在终端模式，自动切换到菜单模式
            if (this.currentFocus === 'terminal') {
                this.switchFocus('menu');
            }
            
            e.preventDefault();
            return;
        }
        
        // Enter键行为区分
        if (e.key === 'Enter') {
            if (this.currentFocus === 'terminal') {
                // 让TerminalController处理
                EventBus.publish('terminal:commandEntered');
            } else {
                // 菜单模式：选择菜单项
                this.activateSelection();
            }
            e.preventDefault();
            return;
        }
        
        // Tab键切换焦点区域
        if (e.key === 'Tab') {
            if (this.currentFocus === 'terminal') {
                this.switchFocus('menu');
            } else {
                this.switchFocus('terminal');
            }
            e.preventDefault();
            return;
        }
        
        // 如果按下其他键且当前不在终端模式，自动切换到终端模式
        if (this.currentFocus !== 'terminal' && 
            e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
            this.switchFocus('terminal');
        }
    },
    
    navigateUp: function() {
        this.menuIndex = (this.menuIndex - 1 + this.menuItems.length) % this.menuItems.length;
        this.updateHighlight();
    },
    
    navigateDown: function() {
        this.menuIndex = (this.menuIndex + 1) % this.menuItems.length;
        this.updateHighlight();
    },
    
    activateSelection: function() {
        if (this.menuItems.length > 0) {
            const selectedItem = this.menuItems[this.menuIndex];
            const appId = selectedItem.getAttribute('data-app');
            
            // 如果选中的是应用程序，预设为应用模式
            if (appId && appId !== 'terminal') {
                // 记录要激活的应用ID，便于后续处理
                this.pendingAppActivation = appId;
                // 实际模式转换将在应用启动后进行
            }
            
            // 触发点击
            selectedItem.click();
        }
    },
    
    ensureSelection: function() {
        if (this.menuItems.length > 0 && this.menuIndex < 0) {
            this.menuIndex = 0;
        }
        this.updateHighlight();
    },
    
    getSelectedItemText: function() {
        if (this.menuItems.length > 0 && this.menuIndex >= 0 && this.menuIndex < this.menuItems.length) {
            return this.menuItems[this.menuIndex].textContent;
        }
        return "NONE";
    },
    
    updateHighlight: function() {
        // 移除所有高亮
        this.menuItems.forEach(item => item.classList.remove('selected'));
        
        // 设置新的高亮
        if (this.menuItems.length > 0) {
            this.menuItems[this.menuIndex].classList.add('selected');
            
            // 更新底部信息栏
            const selectedText = this.getSelectedItemText();
            UserInterfaceView.updateInfoBar(`SELECT: ${selectedText}`);
        }
    }
};