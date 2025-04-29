// js/App.js - 应用入口
const App = {
    init: function() {
        // 初始化各个模块
        SaveManager.init();
        UserModel.init();
        SystemModel.init();
        MissionModel.init();
        TerminalModel.init();    
        
        TerminalView.init();
        ApplicationView.init();
        UserInterfaceView.init();
        
        NavigationController.init();
        TerminalController.init();
        ApplicationController.init();
        MailController.init();
        FileController.init();
        EffectsManager.init();
        
        // 设置事件订阅
        this.setupEventSubscriptions();

        // 开机后检查新邮件
        setTimeout(() => {
            MailController.checkNewMail();
        }, 2000);
        
        // 初始化完成，启动应用
        this.start();
    },
    
    setupEventSubscriptions: function() {
        // 系统时间更新
        EventBus.subscribe('system:timeUpdated', (date) => {
            UserInterfaceView.updateClock(date);
        });
        
        // 用户登录/登出
        EventBus.subscribe('user:login', (profile) => {
            UserInterfaceView.updateUserProfile(profile, true);
        });
        
        EventBus.subscribe('user:logout', () => {
            UserInterfaceView.updateUserProfile(UserModel.profile, false);
        });
        
        EventBus.subscribe('user:avatarChanged', () => {
            UserInterfaceView.updateUserProfile(UserModel.profile, UserModel.isAuthenticated());
        });
        
        // 系统重启
        EventBus.subscribe('system:reboot', () => {
            TerminalView.output.innerHTML = 'SYSTEM REBOOTING...\n';
            UserModel.authenticated = true;
        });
        
        EventBus.subscribe('system:bootComplete', () => {
            EffectsManager.playBootSequence();
            TerminalView.clearScreen();
            NavigationController.switchFocus('terminal');
        });
    },
    
    start: function() {
        // 显示初始启动动画
        EffectsManager.playBootSequence();
        
        // 初始显示终端内容
        TerminalView.clearScreen();
        
        // 设置初始焦点
        NavigationController.switchFocus('terminal');
        
        // 设置初始用户信息
        UserInterfaceView.updateUserProfile(UserModel.profile, UserModel.isAuthenticated());
    }
    
};

// 文档加载完成后初始化应用
document.addEventListener('DOMContentLoaded', function() {
    // 确保DOM完全加载后执行初始化
    setTimeout(() => {
        try {
            // 强制初始化文件系统
            SaveManager.FileDataModule.initDefaultFiles();
            console.log("已强制初始化文件系统");
            
            App.init();
        } catch (e) {
            console.error("初始化错误:", e);
        }
    }, 100);
})