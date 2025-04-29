// loader.js - 本地开发版本
const GameLoader = {
    // 本地开发的基础路径
    baseUrl: './js/',
    
    // 定义加载顺序，确保依赖正确解析
    modules: [
        // 核心模块
        'core/EventBus.js',
        'core/StorageManager.js',
        'core/Constants.js', 
        'core/Config.js',
        'core/Boot.js',
        
        // 模型层
        'models/UserModel.js',
        'models/SystemModel.js',
        'models/MissionModel.js',
        'models/TerminalModel.js',
        
        // 视图层
        'views/TerminalView.js',
        'views/ApplicationView.js',
        'views/UserInterfaceView.js',
        'views/MailView.js',
        'views/FileView.js',
        
        // 控制器层
        'controllers/NavigationController.js',
        'controllers/TerminalController.js',
        'controllers/ApplicationController.js',
        'controllers/MailController.js', 
        'controllers/FileController.js',
        
        // 管理器
        'managers/SaveManager/SaveManager.js',
        'managers/SaveManager/EmailDataModule.js',
        'managers/SaveManager/FileDataModule.js',
        'managers/EffectsManager.js',
        
        // 应用入口必须最后加载
        'app.js'
    ],
    
    loadScripts: function() {
        let chain = Promise.resolve();
        
        this.modules.forEach(module => {
            chain = chain.then(() => this.loadScript(this.baseUrl + module));
        });
        
        return chain;
    },
    
    loadScript: function(url) {
        return new Promise((resolve, reject) => {
            console.log(`正在加载: ${url}`);
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => {
                console.log(`加载成功: ${url}`);
                resolve();
            };
            script.onerror = (error) => {
                console.error(`加载失败: ${url}`, error);
                reject(error);
            };
            document.head.appendChild(script);
        });
    },
    
    init: function() {
        console.log('开始加载游戏脚本...');
        this.loadScripts()
            .then(() => {
                console.log('所有游戏脚本加载完成');
                // 启动游戏
                if (window.App && typeof window.App.init === 'function') {
                    window.App.init();
                } else {
                    console.error('App.init 未找到，请确保 app.js 正确加载');
                }
            })
            .catch(error => {
                console.error('脚本加载失败:', error);
                document.body.innerHTML += `<div style="color: #e3af00; padding: 20px; background-color: black; border: 1px solid #e3af00;">
                    ERROR: SCRIPT LOADING FAILED. CHECK CONSOLE FOR DETAILS.
                </div>`;
            });
    }
};

// 等待DOM加载完成后启动加载器
document.addEventListener('DOMContentLoaded', function() {
    GameLoader.init();
});