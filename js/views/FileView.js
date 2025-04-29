// js/views/FileView.js - 管理文件浏览器显示
const FileView = {
    // 当前选中的文件索引
    selectedIndex: 0,
    // 当前显示视图 (list/detail)
    currentView: 'list',
    // 当前显示的文件列表
    displayedFiles: [],
    // 当前路径
    currentPath: "",
    // 是否处于活动状态
    isActive: false,

    // 确保视图状态与当前模式匹配
    ensureViewState: function() {
        if (this.currentView === 'list') {
            document.getElementById('file-list-view').style.display = 'block';
            document.getElementById('file-detail-view').style.display = 'none';
        } else {
            document.getElementById('file-list-view').style.display = 'none';
            document.getElementById('file-detail-view').style.display = 'block';
        }
    },
    
    // 初始化
    init: function() {
        this.initEventListeners();
        
        // 增加视图状态订阅
        EventBus.subscribe('app:launch', (appId) => {
            if (appId === 'fileExplorer') {
                // 确保每次启动时都是列表视图并在根目录
                setTimeout(() => {
                    this.currentView = 'list';
                    this.currentPath = "";
                    this.ensureViewState();
                    this.loadDirectory(this.currentPath);
                }, 50);
            }
        });

        // 确保点击文件浏览器区域时设置焦点
        document.getElementById('fileExplorer').addEventListener('click', (e) => {
            // 避免与具体项的点击事件冲突
            if (e.target.id === 'fileExplorer' || 
                e.target.className.includes('window-content') ||
                e.target.className.includes('file-list-view') ||
                e.target.className.includes('file-detail-view')) {
                
                this.isActive = true;
                NavigationController.setFocusMode('app');
            }
        });
    },
    
    // 初始化事件监听器
    initEventListeners: function() {
        // 返回按钮点击事件
        document.querySelector('.file-back-btn').addEventListener('click', () => {
            // 确保设置活动状态，防止焦点跳转到菜单
            this.isActive = true;
            NavigationController.setFocusMode('app');
            
            this.showListView();
        });
        
        // 订阅应用程序退出请求
        EventBus.subscribe('app:requestExit', () => {
            if (SystemModel.currentScreen === 'fileExplorer') {
                if (this.currentView === 'detail') {
                    // 如果在详情视图，先返回列表视图
                    this.showListView();
                } else if (this.currentPath !== "") {
                    // 如果不在根目录，返回上一级目录
                    this.navigateToParentDirectory();
                } else {
                    // 如果已经在根目录列表视图，则退出应用
                    EventBus.publish('app:close');
                }
            }
        });
        
        // 订阅导航模式变化
        EventBus.subscribe('navigation:modeChanged', (mode) => {
            this.isActive = (mode === 'app' && SystemModel.currentScreen === 'fileExplorer');
        });

        // 订阅应用激活事件
        EventBus.subscribe('app:activated', (appId) => {
            if (appId === 'fileExplorer') {
                // 确保为列表视图
                this.currentView = 'list';
                this.isActive = true;
                this.ensureViewState();
                this.updateSelection();
            }
        });
        
        // 全局键盘事件监听
        document.addEventListener('keydown', (e) => {
            // 仅当文件应用活动时处理键盘事件
            if (!this.isActive || SystemModel.currentScreen !== 'fileExplorer') return;
            
            // ESC键处理
            if (e.key === 'Escape') {
                if (this.currentView === 'detail') {
                    // 在详情视图时，ESC返回列表视图
                    e.stopPropagation(); // 阻止事件冒泡，防止被NavigationController捕获
                    this.showListView();
                } else if (this.currentPath !== "") {
                    // 非根目录返回上级
                    e.stopPropagation();
                    this.navigateToParentDirectory();
                } else {
                    // 根目录时，让事件冒泡到NavigationController，关闭应用
                    // 不需要特殊处理
                }
                e.preventDefault();
                return;
            }
            
            // 确保视图状态与实际显示一致
            this.ensureViewState();
            
            // 如果在应用焦点模式下但没有响应键盘，尝试激活
            if (NavigationController.focusMode === 'app' && !this.isActive) {
                this.isActive = true;
            }
            
            // 处理不同视图模式下的键盘事件
            if (this.currentView === 'list') {
                // 列表视图下的键盘导航
                switch (e.key) {
                    case 'ArrowUp':
                        this.selectPrevFile();
                        e.preventDefault();
                        break;
                    case 'ArrowDown':
                        this.selectNextFile();
                        e.preventDefault();
                        break;
                    case 'Enter':
                        this.openSelectedItem();
                        e.preventDefault();
                        break;
                    case 'Backspace':
                        // 返回上级目录
                        if (this.currentPath !== "") {
                            this.navigateToParentDirectory();
                            e.preventDefault();
                        }
                        break;
                }
            } else if (this.currentView === 'detail') {
                // 详情视图下的键盘导航
                switch (e.key) {
                    case 'ArrowLeft':
                    case 'Backspace':
                        this.showListView();
                        e.preventDefault();
                        break;
                }
            }
        });
    },
    
    // 加载并显示指定目录
    loadDirectory: function(path) {
        this.currentPath = path;
        
        // 更新路径显示
        document.getElementById('current-path').textContent = `PATH: /${path}`;
        
        // 获取目录内容
        let files = SaveManager.FileDataModule.getFilesByPath(path);
        
        // 为非根目录添加返回上级目录的选项
        if (path !== "") {
            // 使用特殊标记，不是真实文件
            files.unshift({
                id: "parent-dir",
                type: "UP-DIR",
                title: "..",
                isParentDir: true
            });
        }
        
        // 设置显示文件列表
        this.displayedFiles = files;
        this.selectedIndex = 0;
        
        // 渲染文件列表
        this.renderFileList();
    },
    
    // 导航到父级目录
    navigateToParentDirectory: function() {
        if (this.currentPath === "") return;
        
        const pathParts = this.currentPath.split('/');
        pathParts.pop(); // 移除最后一个部分
        const parentPath = pathParts.join('/');
        
        this.loadDirectory(parentPath);
    },
    
    // 渲染文件列表
    renderFileList: function() {
        const container = document.getElementById('file-list-container');
        container.innerHTML = '';
        
        if (this.displayedFiles.length === 0) {
            container.innerHTML = '<div class="no-file-message">DIRECTORY EMPTY</div>';
            return;
        }
        
        // 排序文件列表：父目录优先，然后是目录，最后是文件
        this.displayedFiles.sort((a, b) => {
            // 父目录(..)始终在最前
            if (a.isParentDir) return -1;
            if (b.isParentDir) return 1;
            
            // 目录在文件前面
            if (a.type === 'DIR' && b.type !== 'DIR') return -1;
            if (a.type !== 'DIR' && b.type === 'DIR') return 1;
            
            // 同类型按名称排序
            return a.title.localeCompare(b.title);
        });
        
        // 创建文件列表项
        this.displayedFiles.forEach((file, index) => {
            const row = document.createElement('div');
            row.className = `file-item ${index === this.selectedIndex ? 'selected' : ''}`;
            row.setAttribute('data-index', index);
            
            // 设置图标
            let icon = '[TXT]';
            if (file.type === 'DIR') {
                icon = '[DIR]';
            } else if (file.type === 'EXE') {
                icon = '[EXE]';
            } else if (file.type === 'IMG') {
                icon = '[IMG]';
            } else if (file.type === 'UP-DIR') {
                icon = '[..]';
            }
            
            // 显示文件名（不包含路径）
            let displayName = file.title;
            if (!file.isParentDir) {
                // 提取文件名（不含路径）
                const nameParts = file.title.split('/');
                displayName = nameParts[nameParts.length - 1];
            }
            
            // 组装行内容
            row.innerHTML = `
                <span class="file-icon">${icon}</span>
                <span class="file-name">${displayName}</span>
            `;
            
            // 添加点击事件
            row.addEventListener('click', () => {
                // 设置活动状态和焦点模式
                this.isActive = true;
                NavigationController.setFocusMode('app');
                
                // 更新选中项
                this.selectedIndex = index;
                this.updateSelection();
                
                // 打开选中项
                this.openSelectedItem();
            });
            
            container.appendChild(row);
        });
        
        // 确保选中项高亮
        this.updateSelection();
        
        // 更新信息栏
        UserInterfaceView.updateInfoBar("FILE BROWSER: USE ARROWS to NAVIGATE, ENTER to OPEN, BACKSPACE for PARENT DIR");
    },
    
    // 打开选中的项目（文件或目录）
    openSelectedItem: function() {
        if (this.displayedFiles.length === 0) return;
        
        const selectedFile = this.displayedFiles[this.selectedIndex];
        if (!selectedFile) return;
        
        // 处理上级目录
        if (selectedFile.isParentDir) {
            this.navigateToParentDirectory();
            return;
        }
        
        // 根据类型处理
        if (selectedFile.type === 'DIR') {
            // 如果是目录，进入该目录
            let newPath = selectedFile.title;
            this.loadDirectory(newPath);
        } else {
            // 如果是文件，显示文件内容
            this.viewFileContent(selectedFile);
        }
    },
    
    // 显示文件内容
    viewFileContent: function(file) {
        // 更新UI元素
        document.getElementById('file-name').textContent = file.title;
        document.getElementById('file-type').textContent = file.type;
        document.getElementById('file-content').textContent = file.content || "NO CONTENT AVAILABLE";
        
        // 切换到详情视图
        this.currentView = 'detail';
        this.ensureViewState();
        
        // 确保保持活动状态和应用焦点模式
        this.isActive = true;
        NavigationController.setFocusMode('app');
        
        // 更新信息栏
        UserInterfaceView.updateInfoBar("FILE CONTENT: BACKSPACE or LEFT ARROW to RETURN");
    },
    
    // 返回列表视图
    showListView: function() {
        this.currentView = 'list';
        document.getElementById('file-detail-view').style.display = 'none';
        document.getElementById('file-list-view').style.display = 'block';
        
        // 更新信息栏
        UserInterfaceView.updateInfoBar("FILE BROWSER: USE ARROWS to NAVIGATE, ENTER to OPEN, BACKSPACE for PARENT DIR");
    },
    
    // 更新选中项的高亮
    updateSelection: function() {
        const rows = document.querySelectorAll('.file-item');
        rows.forEach((row, index) => {
            if (index === this.selectedIndex) {
                row.classList.add('selected');
                // 确保选中的行可见
                row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                row.classList.remove('selected');
            }
        });
    },
    
    // 选择上一个文件
    selectPrevFile: function() {
        if (this.displayedFiles.length === 0) return;
        
        this.selectedIndex = Math.max(0, this.selectedIndex - 1);
        this.updateSelection();
    },
    
    // 选择下一个文件
    selectNextFile: function() {
        if (this.displayedFiles.length === 0) return;
        
        this.selectedIndex = Math.min(this.displayedFiles.length - 1, this.selectedIndex + 1);
        this.updateSelection();
    }
};