// js/utils/SaveManager.js - 核心存档管理系统
const SaveManager = {
    // 存档数据对象
    gameData: {
        emails: [],          // 邮件数据
        files: {},           // 文件系统数据
        missions: {},        // 任务数据
        progress: {},        // 游戏进度
        dossiers: [],        // 档案数据
        logs: [],            // 系统日志
        decrypted: []        // 已解密内容
    },
    
    // 存档标识符前缀
    SAVE_PREFIX: 'cia_save_',
    
    // 初始化存档系统
    init: function() {
        this.loadAllData();
        
        // 初始化各个模块
        this.EmailDataModule.init();
        this.FileDataModule.init();
        
        console.log("SaveManager 初始化完成");
    },
    
    // 保存所有游戏数据
    saveAllData: function() {
        for (const key in this.gameData) {
            this.saveData(key, this.gameData[key]);
        }
        console.log("已保存所有游戏数据");
    },
    
    // 保存特定模块数据
    saveData: function(module, data) {
        const saveKey = this.SAVE_PREFIX + module;
        StorageManager.save(saveKey, data);
    },
    
    // 加载所有游戏数据
    loadAllData: function() {
        for (const key in this.gameData) {
            const loadedData = this.loadData(key);
            if (loadedData) {
                this.gameData[key] = loadedData;
            }
        }
    },
    
    // 加载特定模块数据
    loadData: function(module) {
        const saveKey = this.SAVE_PREFIX + module;
        return StorageManager.load(saveKey);
    },
    
    // 重置所有游戏数据
    resetAllData: function() {
        for (const key in this.gameData) {
            this.resetData(key);
        }
        console.log("已重置所有游戏数据");
    },
    
    // 重置特定模块数据
    resetData: function(module) {
        const saveKey = this.SAVE_PREFIX + module;
        StorageManager.remove(saveKey);
        
        // 重置内存中的数据
        if (Array.isArray(this.gameData[module])) {
            this.gameData[module] = [];
        } else {
            this.gameData[module] = {};
        }
    }
    
    // 模块引用将在index.html加载后设置
    // EmailDataModule 和 FileDataModule 会被注入
};