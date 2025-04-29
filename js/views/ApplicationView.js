// js/views/ApplicationView.js - 管理应用程序窗口显示
const ApplicationView = {
    init: function() {
        // 初始化应用程序窗口处理
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                EventBus.publish('app:close');
            });
        });
    },
    
    showApp: function(appId) {
        // 隐藏所有应用程序
        document.querySelectorAll('.app-window').forEach(app => {
            app.style.display = 'none';
        });
        
        // 隐藏终端
        document.getElementById('terminal').style.display = 'none';
        
        // 显示请求的应用程序
        if (appId === Constants.APPS.TERMINAL) {
            document.getElementById('terminal').style.display = 'block';
            document.getElementById('user-input').focus();
        } else {
            const app = document.getElementById(appId);
            if (app) {
                app.style.display = 'block';
            }
        }
    },
    
    renderAppContent: function(appId, content) {
        // 根据不同应用渲染内容
        const app = document.getElementById(appId);
        if (!app) return;
        
        const contentContainer = app.querySelector('.window-content');
        if (contentContainer) {
            contentContainer.innerHTML = content;
        }
    }
};