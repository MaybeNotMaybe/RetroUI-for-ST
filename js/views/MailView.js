// js/views/MailView.js - 管理邮件界面显示
const MailView = {
    // 当前选中的邮件索引
    selectedIndex: 0,
    // 当前显示视图 (list/detail)
    currentView: 'list',
    // 当前显示的邮件列表
    displayedEmails: [],
    isActive: false,

    ensureViewState: function() {
        if (this.currentView === 'list') {
            document.getElementById('mail-list-view').style.display = 'block';
            document.getElementById('mail-detail-view').style.display = 'none';
        } else {
            document.getElementById('mail-list-view').style.display = 'none';
            document.getElementById('mail-detail-view').style.display = 'block';
        }
    },
    
    init: function() {
        this.initEventListeners();
        
        // 增加视图状态订阅
        EventBus.subscribe('app:launch', (appId) => {
            if (appId === 'mail') {
                // 确保每次启动时都是列表视图
                setTimeout(() => {
                    this.currentView = 'list';
                    this.ensureViewState();
                }, 50);
            }
        });
    },
    
    initEventListeners: function() {
        // 返回按钮点击事件
        document.querySelector('.mail-back-btn').addEventListener('click', () => {
            this.showListView();
        });
        
        // 上一封邮件按钮
        document.querySelector('.mail-prev-btn').addEventListener('click', () => {
            this.navigatePrevMail();
        });
        
        // 下一封邮件按钮
        document.querySelector('.mail-next-btn').addEventListener('click', () => {
            this.navigateNextMail();
        });
        
        // 订阅应用退出请求
        EventBus.subscribe('app:requestExit', () => {
            if (SystemModel.currentScreen === 'mail') {
                if (this.currentView === 'detail') {
                    // 如果在详情视图，先返回列表视图
                    this.showListView();
                } else {
                    // 如果已经在列表视图，则退出应用
                    EventBus.publish('app:close');
                }
            }
        });
        
        // 订阅导航模式变化
        EventBus.subscribe('navigation:modeChanged', (mode) => {
            this.isActive = (mode === 'app' && SystemModel.currentScreen === 'mail');
            console.log("邮件应用活动状态:", this.isActive); // 调试日志
        });

        // 订阅应用激活事件
        EventBus.subscribe('app:activated', (appId) => {
            if (appId === 'mail') {
                // 强制设置为列表视图
                this.currentView = 'list';
                this.isActive = true;
                this.ensureViewState();
                this.updateSelection();
            }
        });

        // 订阅应用退出请求
        EventBus.subscribe('app:requestExit', () => {
            if (SystemModel.currentScreen === 'mail') {
                if (this.currentView === 'detail') {
                    // 如果在详情视图，先返回列表视图
                    this.showListView();
                } else {
                    // 如果已经在列表视图，则退出应用
                    EventBus.publish('app:close');
                }
            }
        });
        
        // 全局键盘事件监听
        document.addEventListener('keydown', (e) => {
            // 仅当邮件应用活动时处理键盘事件
            if (!this.isActive || SystemModel.currentScreen !== 'mail') return;
            
            // 确保视图状态与实际显示一致
            this.ensureViewState();
            
            // 如果在应用焦点模式下但没有响应键盘，尝试激活
            if (NavigationController.focusMode === 'app' && !this.isActive) {
                this.isActive = true;
            }
            
            // 左箭头键返回列表
            if (e.key === 'ArrowLeft' && this.currentView === 'detail') {
                this.showListView();
                e.preventDefault();
                return;
            }
            
            // 右箭头键查看详情
            if (e.key === 'ArrowRight' && this.currentView === 'list') {
                this.viewSelectedEmail();
                e.preventDefault();
                return;
            }
            
            // 上箭头键选择上一封邮件
            if (e.key === 'ArrowUp') {
                if (this.currentView === 'list') {
                    this.selectPrevEmail();
                } else {
                    this.navigatePrevMail();
                }
                e.preventDefault();
                return;
            }
            
            // 下箭头键选择下一封邮件
            if (e.key === 'ArrowDown') {
                if (this.currentView === 'list') {
                    this.selectNextEmail();
                } else {
                    this.navigateNextMail();
                }
                e.preventDefault();
                return;
            }
            
            // Enter键查看选中邮件
            if (e.key === 'Enter' && this.currentView === 'list') {
                this.viewSelectedEmail();
                e.preventDefault();
                return;
            }
        });
    },
    
    // 渲染邮件列表
    renderMailList: function() {
        // 获取所有邮件
        this.displayedEmails = SaveManager.EmailDataModule.getAllEmails();
        
        // 按日期降序排序（最新的在最前面）
        this.displayedEmails.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        const container = document.getElementById('mail-list-container');
        container.innerHTML = '';
        
        if (this.displayedEmails.length === 0) {
            container.innerHTML = '<div class="no-mail-message">NO MESSAGES FOUND</div>';
            return;
        }
        
        // 创建邮件列表项
        this.displayedEmails.forEach((email, index) => {
            const row = document.createElement('div');
            row.className = `mail-row ${index === this.selectedIndex ? 'selected' : ''} ${!email.read ? 'mail-unread' : ''}`;
            row.setAttribute('data-index', index);
            
            // 格式化日期
            const date = new Date(email.date);
            const formattedDate = `${this.getMonthAbbr(date.getMonth())} ${date.getDate()}`;
            
            // 组装行内容
            row.innerHTML = `
                <span class="mail-col-id">${index + 1}</span>
                <span class="mail-col-status">[${email.read ? 'Readed' : 'Unread'}]</span>
                <span class="mail-col-date">${formattedDate}</span>
                <span class="mail-col-sender">${email.sender}</span>
                <span class="mail-col-subject">${email.subject}</span>
            `;
            
            // 添加点击事件
            row.addEventListener('click', () => {
                this.selectedIndex = index;
                this.updateSelection();
                this.viewSelectedEmail();
            });
            
            container.appendChild(row);

            // 在渲染结束后，确保视图状态正确
            this.ensureViewState();
            
            // 确保选中项高亮
            this.updateSelection();
            
            // 如果是列表视图，更新相应信息栏
            if (this.currentView === 'list') {
                UserInterfaceView.updateInfoBar("MAIL LIST: USE ARROWS to NAVIGATE, ENTER to VIEW, ESC to EXIT");
            }
        });
    },
    
    // 渲染邮件详情
    renderMailDetail: function(email) {
        // 标记为已读
        SaveManager.EmailDataModule.markAsRead(email.id);
        
        // 更新UI元素
        document.getElementById('mail-date').textContent = this.formatDetailDate(email.date);
        document.getElementById('mail-sender').textContent = `${email.sender}@CIA.GOV`;
        document.getElementById('mail-subject').textContent = email.subject;
        document.getElementById('mail-content').textContent = email.content;
        
        // 切换到详情视图
        this.currentView = 'detail';
        document.getElementById('mail-list-view').style.display = 'none';
        document.getElementById('mail-detail-view').style.display = 'block';
    },
    
    // 显示列表视图
    showListView: function() {
        this.currentView = 'list';
        document.getElementById('file-detail-view').style.display = 'none';
        document.getElementById('file-list-view').style.display = 'block';
        
        // 明确设置活动状态为true，防止焦点丢失
        this.isActive = true;
        
        // 确保导航控制器保持在应用模式
        NavigationController.setFocusMode('app');
        
        // 更新信息栏
        UserInterfaceView.updateInfoBar("FILE BROWSER: USE ARROWS to NAVIGATE, ENTER to OPEN, BACKSPACE for PARENT DIR");
        
        // 稍微延迟，确保DOM更新后再更新选择
        setTimeout(() => {
            this.updateSelection();
        }, 10);
    },
    
    // 查看选中的邮件
    viewSelectedEmail: function() {
        if (this.displayedEmails.length === 0) return;
        
        const email = this.displayedEmails[this.selectedIndex];
        if (email) {
            // 标记为已读
            SaveManager.EmailDataModule.markAsRead(email.id);
            
            // 更新UI元素
            document.getElementById('mail-date').textContent = this.formatDetailDate(email.date);
            document.getElementById('mail-sender').textContent = `${email.sender}@CIA.GOV`;
            document.getElementById('mail-subject').textContent = email.subject;
            document.getElementById('mail-content').textContent = email.content;
            
            // 切换到详情视图
            this.currentView = 'detail';
            this.ensureViewState();
            
            // 更新信息栏
            UserInterfaceView.updateInfoBar("MAIL DETAIL: LEFT to RETURN, UP/DOWN for PREV/NEXT");
        }
    },
    
    // 更新选中项的高亮
    updateSelection: function() {
        const rows = document.querySelectorAll('.mail-row');
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
    
    // 选择上一封邮件
    selectPrevEmail: function() {
        if (this.displayedEmails.length === 0) return;
        
        this.selectedIndex = Math.max(0, this.selectedIndex - 1);
        this.updateSelection();
    },
    
    // 选择下一封邮件
    selectNextEmail: function() {
        if (this.displayedEmails.length === 0) return;
        
        this.selectedIndex = Math.min(this.displayedEmails.length - 1, this.selectedIndex + 1);
        this.updateSelection();
    },
    
    // 查看上一封邮件
    navigatePrevMail: function() {
        if (this.selectedIndex > 0) {
            this.selectedIndex--;
            this.viewSelectedEmail();
        }
    },
    
    // 查看下一封邮件
    navigateNextMail: function() {
        if (this.selectedIndex < this.displayedEmails.length - 1) {
            this.selectedIndex++;
            this.viewSelectedEmail();
        }
    },
    
    // 将月份数字转换为三字母缩写
    getMonthAbbr: function(monthIndex) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[monthIndex];
    },
    
    // 格式化详情视图的日期
    formatDetailDate: function(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = this.getMonthAbbr(date.getMonth()).toUpperCase();
        const year = date.getFullYear().toString().substr(2);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}-EST`;
    }
};