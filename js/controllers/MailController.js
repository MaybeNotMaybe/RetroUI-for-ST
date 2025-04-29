// js/controllers/MailController.js - 管理邮件程序
const MailController = {
    init: function() {
        // 初始化邮件视图
        MailView.init();
        
        // 订阅相关事件
        this.setupEventListeners();

        // 立即检查未读邮件数量并更新徽章
        this.checkNewMail();
        
        console.log("邮件系统初始化完成"); 
    },
    
    setupEventListeners: function() {
        // 监听邮件程序启动事件
        EventBus.subscribe('app:launch', (appId) => {
            if (appId === 'mail') {
                this.openMailApp();
            }
        });
        
        // 监听未读邮件状态变化
        EventBus.subscribe('mail:unreadChanged', (count) => {
            this.updateUnreadBadge(count);
        });
    },
    
    openMailApp: function() {
        // 确保用户已登录
        if (!UserModel.isAuthenticated()) {
            TerminalView.appendOutput("ERROR: AUTHENTICATION REQUIRED");
            ApplicationController.showTerminal();
            return;
        }
        
        // 重置邮件视图状态
        MailView.selectedIndex = 0;
        
        // 强制设置为列表视图
        MailView.currentView = 'list';
        MailView.isActive = true;
        
        // 显示邮件列表视图，隐藏详情视图
        document.getElementById('mail-list-view').style.display = 'block';
        document.getElementById('mail-detail-view').style.display = 'none';
        
        // 显示邮件列表
        MailView.renderMailList();
        
        // 显示邮件应用
        ApplicationView.showApp('mail');
        SystemModel.changeScreen('mail');
        
        // 设置为应用焦点模式
        NavigationController.setFocusMode('app');
        
        // 确保焦点正确激活
        setTimeout(() => {
            // 再次确认视图状态
            MailView.isActive = true;
            
            // 更新选中状态
            MailView.updateSelection();
            
            // 更新底部信息栏
            UserInterfaceView.updateInfoBar("MAIL: USE ARROWS to NAVIGATE, ENTER to VIEW, ESC to RETURN");
        }, 100);
    },
    
    updateUnreadBadge: function(count) {
        // 获取邮件菜单项
        const mailMenuItem = document.querySelector('.menu-item[data-app="mail"]');
        if (mailMenuItem) {
            if (count > 0) {
                mailMenuItem.textContent = `MAIL [${count}]`;
            } else {
                mailMenuItem.textContent = "MAIL";
            }
        }

        if (SystemModel.currentScreen === Constants.APPS.TERMINAL) {
            TerminalView.clearScreen();
        }
    },
    
    // 检查新邮件并更新徽章
    checkNewMail: function() {
        const unreadCount = SaveManager.EmailDataModule.getUnreadCount();
        this.updateUnreadBadge(unreadCount);
    }
};