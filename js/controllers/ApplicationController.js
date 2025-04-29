// js/controllers/ApplicationController.js - 管理应用程序
const ApplicationController = {
    init: function() {
        this.initEventListeners();
    },
    
    initEventListeners: function() {
        // 注册菜单点击事件
        document.querySelectorAll('.menu-item').forEach(item => {
            const appId = item.getAttribute('data-app');
            if (appId) {
                item.addEventListener('click', () => this.launchApp(appId));
            }
        });
        
        // 监听应用启动事件
        EventBus.subscribe('app:launch', (appId) => {
            this.launchApp(appId);
        });
        
        // 监听应用关闭事件
        EventBus.subscribe('app:close', () => {
            this.closeApp();
        });
        
        // 登出按钮单独处理
        document.getElementById('logoutBtn').addEventListener('click', this.handleLogout.bind(this));
    },
    
    launchApp: function(appId) {
        // 对login菜单项做特殊处理，登出状态下也允许访问
        if (appId === 'login') {
            if (UserModel.isAuthenticated()) {
                TerminalView.appendOutput("NOTICE: ALREADY LOGGED IN AS AGENT.");
            } else {
                UserModel.login();
            }
            this.showTerminal();
            return;
        }

        // 对其他菜单项进行权限检查
        if (!UserModel.isAuthenticated() && appId !== Constants.APPS.TERMINAL) {
            TerminalView.appendOutput("ERROR: AUTHENTICATION REQUIRED");
            this.showTerminal();
            return;
        }
        
        // 处理特殊应用
        if (appId === 'settings') {
            TerminalView.appendOutput("LAUNCHING SETTINGS MODULE...\nSYSTEM SETTINGS NOT AVAILABLE IN CURRENT TERMINAL VERSION.");
            this.showTerminal();
            return;
        }

        if (appId === 'fileExplorer') {
            // 直接调用FileController的方法
            FileController.openFileExplorer();
            return;
        }

        if (appId === 'mail') {
            // 在打开邮件应用前先重置状态
            if (MailView) {
                // 强制重置为列表视图
                MailView.currentView = 'list';
                
                // 确保DOM状态正确
                document.getElementById('mail-list-view').style.display = 'block';
                document.getElementById('mail-detail-view').style.display = 'none';
            }
            
            // 确保状态重置后再打开应用
            setTimeout(() => {
                MailController.openMailApp();
                NavigationController.setFocusMode('app');
            }, 0);
            
            return;
        }

        if (appId === 'musicPlayer') {
            TerminalView.appendOutput("LAUNCHING MUSIC PLAYER...\nPLAYING: L'envol - Oil Astral\nVOLUME: 80%\nPRESS SPACE TO PAUSE/PLAY");
            this.showTerminal();
            return;
        }
        
        if (appId === 'help') {
            TerminalView.appendOutput("HELP SYSTEM\n-----------\n" +
                                    "USE KEYBOARD ARROWS TO NAVIGATE MENU\n" +
                                    "PRESS ENTER TO SELECT\n" +
                                    "PRESS TAB TO SWITCH BETWEEN TERMINAL AND MENU\n" +
                                    "TYPE 'HELP' IN TERMINAL FOR COMMAND LIST");
            this.showTerminal();
            return;
        }
        
        // 显示请求的应用程序
        ApplicationView.showApp(appId);
        SystemModel.changeScreen(appId);

        // 如果不是终端，设置为应用模式
        if (appId !== Constants.APPS.TERMINAL) {
            setTimeout(() => {
                NavigationController.setFocusMode('app');
            }, 50);
        }
        
        // 确保焦点正确
        NavigationController.switchFocus('terminal');
    },
    
    closeApp: function() {
        NavigationController.setFocusMode('system');
        this.showTerminal();
    },
    
    showTerminal: function() {
        ApplicationView.showApp(Constants.APPS.TERMINAL);
        SystemModel.changeScreen(Constants.APPS.TERMINAL);
    },
    
    handleLogout: function() {
        UserModel.logout();
        this.showTerminal();
        TerminalView.appendOutput("LOGOUT SUCCESSFUL\nSYSTEM LOCKED");
    }
};