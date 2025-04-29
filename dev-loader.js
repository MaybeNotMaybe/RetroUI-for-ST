// dev-loader.js - 本地开发版本的加载器
const CIAGameDevLoader = {
    // 基本路径配置
    basePath: './js/',
    
    // 定义模块文件路径
    modules: {
        // 核心模块
        "eventBus": "core/EventBus.js",
        "storageManager": "core/StorageManager.js",
        "constants": "core/Constants.js",
        "config": "core/Config.js",
        
        // 模型
        "userModel": "models/UserModel.js",
        "systemModel": "models/SystemModel.js",
        "missionModel": "models/MissionModel.js",
        "terminalModel": "models/TerminalModel.js",
        
        // 视图
        "terminalView": "views/TerminalView.js",
        "applicationView": "views/ApplicationView.js",
        "userInterfaceView": "views/UserInterfaceView.js",
        "mailView": "views/MailView.js",
        "fileView": "views/FileView.js",
        
        // 控制器
        "navigationController": "controllers/NavigationController.js",
        "terminalController": "controllers/TerminalController.js",
        "applicationController": "controllers/ApplicationController.js",
        "mailController": "controllers/MailController.js",
        "fileController": "controllers/FileController.js",
        
        // 管理器
        "saveManager": "managers/SaveManager.js",
        "effectsManager": "managers/EffectsManager.js",
        
        // 应用入口
        "app": "app.js"
    },
    
    // 定义加载顺序，确保依赖正确解析
    loadOrder: [
        // 核心模块（需要首先加载）
        "eventBus",
        "storageManager",
        "constants",
        "config",
        
        // 模型（依赖核心模块）
        "userModel",
        "systemModel",
        "missionModel",
        "terminalModel",
        
        // 视图（依赖模型和核心）
        "terminalView",
        "applicationView",
        "userInterfaceView",
        "mailView",
        "fileView",
        
        // 控制器（依赖视图和模型）
        "navigationController",
        "terminalController",
        "applicationController",
        "mailController",
        "fileController",
        
        // 管理器
        "saveManager",
        "effectsManager",
        
        // 应用入口必须最后加载
        "app"
    ],
    
    // 开发环境配置
    devConfig: {
        // 是否显示详细日志
        verbose: true,
        // 加载模块间的延迟（毫秒），方便调试
        loadDelay: 0, 
        // 缓存破坏（防止浏览器缓存旧版本）
        bustCache: true
    },
    
    // 加载所有脚本
    loadScripts: function() {
        let chain = Promise.resolve();
        const startTime = Date.now();
        
        if (this.devConfig.verbose) {
            console.log('%c[CIA Game Loader] 开始加载模块...', 'color: #4CAF50; font-weight: bold;');
        }
        
        this.loadOrder.forEach((moduleId, index) => {
            chain = chain.then(() => {
                return new Promise(resolve => {
                    // 可选的延迟加载，方便调试
                    setTimeout(() => {
                        this.loadModule(moduleId, index + 1)
                            .then(resolve)
                            .catch(err => {
                                console.error(`模块 ${moduleId} 加载失败:`, err);
                                resolve(); // 继续加载其他模块
                            });
                    }, this.devConfig.loadDelay);
                });
            });
        });
        
        return chain.then(() => {
            const loadTime = Date.now() - startTime;
            if (this.devConfig.verbose) {
                console.log(
                    `%c[CIA Game Loader] 所有模块加载完成! (${loadTime}ms)`, 
                    'color: #4CAF50; font-weight: bold;'
                );
            }
        });
    },
    
    // 加载单个模块
    loadModule: function(moduleId, index) {
        if (!this.modules[moduleId]) {
            return Promise.reject(new Error(`模块 "${moduleId}" 未定义`));
        }
        
        let url = this.basePath + this.modules[moduleId];
        
        // 添加缓存破坏参数
        if (this.devConfig.bustCache) {
            url += `?_=${Date.now()}`;
        }
        
        if (this.devConfig.verbose) {
            console.log(
                `%c[${index}/${this.loadOrder.length}] 加载模块: ${moduleId}`, 
                'color: #2196F3;'
            );
        }
        
        return this.loadScript(url, moduleId);
    },
    
    // 加载脚本并返回Promise
    loadScript: function(url, moduleId) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            
            script.onload = () => {
                if (this.devConfig.verbose) {
                    console.log(
                        `%c✓ 模块加载成功: ${moduleId}`, 
                        'color: #4CAF50;'
                    );
                }
                resolve();
            };
            
            script.onerror = (e) => {
                console.error(`%c✗ 模块加载失败: ${moduleId}`, 'color: #F44336; font-weight: bold;');
                reject(e);
            };
            
            document.head.appendChild(script);
        });
    },
    
    // 为开发环境添加工具函数
    devTools: {
        // 重新加载指定模块
        reloadModule: function(moduleId) {
            if (!CIAGameDevLoader.modules[moduleId]) {
                console.error(`未找到模块: ${moduleId}`);
                return Promise.reject(new Error(`模块 "${moduleId}" 未定义`));
            }
            
            console.log(`%c正在重新加载模块: ${moduleId}...`, 'color: #FF9800;');
            return CIAGameDevLoader.loadModule(moduleId, '重载');
        },
        
        // 获取所有已加载的模块列表
        listModules: function() {
            console.table(
                Object.keys(CIAGameDevLoader.modules).map(id => ({
                    id: id,
                    path: CIAGameDevLoader.modules[id],
                    loaded: window[id.charAt(0).toUpperCase() + id.slice(1)] !== undefined
                }))
            );
        },
        
        // 检查依赖情况
        checkDependencies: function() {
            const missing = [];
            
            CIAGameDevLoader.loadOrder.forEach(moduleId => {
                // 使用简单的命名约定检查
                const expectedGlobal = moduleId.charAt(0).toUpperCase() + moduleId.slice(1);
                if (window[expectedGlobal] === undefined) {
                    missing.push(moduleId);
                }
            });
            
            if (missing.length === 0) {
                console.log('%c✓ 所有依赖模块已正确加载', 'color: #4CAF50; font-weight: bold;');
            } else {
                console.error('%c以下模块可能未正确加载:', 'color: #F44336;', missing);
            }
            
            return missing;
        }
    },
    
    // 初始化函数
    init: function() {
        console.log('%c[CIA Game Dev Loader] 开发环境启动中...', 'color: #E91E63; font-weight: bold; font-size: 14px;');
        
        // 添加开发工具到全局
        window.devTools = this.devTools;
        
        // 加载所有脚本
        this.loadScripts()
            .then(() => {
                console.log('%c[CIA Game] 游戏初始化开始', 'color: #9C27B0; font-weight: bold;');
                // 启动游戏
                if (window.App && typeof window.App.init === 'function') {
                    window.App.init();
                } else {
                    console.error('找不到App.init方法，游戏无法启动');
                }
            })
            .catch(error => {
                console.error('游戏加载失败:', error);
                // 显示错误信息给用户
                const output = document.getElementById('output');
                if (output) {
                    output.innerHTML = 'SYSTEM ERROR: Game initialization failed. Please check console for details.';
                }
            });
    }
};

// 启动加载器
document.addEventListener('DOMContentLoaded', function() {
    CIAGameDevLoader.init();
});

// 为了便于调试，将加载器暴露到全局
window.CIAGameDevLoader = CIAGameDevLoader;