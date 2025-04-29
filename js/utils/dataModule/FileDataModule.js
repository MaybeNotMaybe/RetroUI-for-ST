// js/utils/modules/FileDataModule.js - 文件数据模块
const FileDataModule = {
    // 初始化模块
    init: function() {
        // 检查并初始化文件系统
        console.log("检查文件系统数据:", SaveManager.gameData.files);
        
        // 如果files不是对象或没有list数组，或是空数组，就初始化
        if (!SaveManager.gameData.files || !SaveManager.gameData.files.list || SaveManager.gameData.files.list.length === 0) {
            console.log("正在初始化默认文件数据...");
            this.initDefaultFiles();
        }
        
        // 调试：检查初始化后的文件
        console.log("初始化后的文件数据:", SaveManager.gameData.files);
    },
    
    // 获取所有文件
    getAllFiles: function() {
        return SaveManager.gameData.files.list || [];
    },
    
    // 按ID获取文件
    getFileById: function(id) {
        const files = this.getAllFiles();
        return files.find(file => file.id === id);
    },
    
    // 按类型获取文件
    getFilesByType: function(type) {
        const files = this.getAllFiles();
        return files.filter(file => file.type === type);
    },
    
    // 按路径获取文件
    getFilesByPath: function(path) {
        if (!SaveManager.gameData.files || !SaveManager.gameData.files.list) {
            return [];
        }
        
        const files = SaveManager.gameData.files.list;
        
        // 过滤出当前路径下的直接子项
        return files.filter(file => {
            // 根目录处理
            if (path === "" || path === "/") {
                // 返回顶级项（不包含/的项）
                return !file.title.includes('/');
            }
            
            // 非根目录处理：
            // 1. 不包含当前目录自身
            if (file.title === path) {
                return false;
            }
            
            // 2. 检查是否为直接子项
            if (file.title.startsWith(path + '/')) {
                const remainingPath = file.title.substring(path.length + 1);
                // 不包含更多/的是直接子项
                return !remainingPath.includes('/');
            }
            
            return false;
        });
    },
    
    // 添加新文件
    addFile: function(fileData) {
        // 确保files.list存在
        if (!SaveManager.gameData.files.list) {
            SaveManager.gameData.files.list = [];
        }
        
        // 生成唯一ID
        const id = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        
        // 创建文件对象
        const file = {
            id: id,
            type: fileData.type,
            title: fileData.title,
            content: fileData.content
        };
        
        // 添加到文件数组
        SaveManager.gameData.files.list.push(file);
        
        // 如果是文件并且包含路径，确保所有父目录存在
        if (file.type !== "DIR" && file.title.includes('/')) {
            this.ensureDirectories(file.title);
        }
        
        // 保存更新
        SaveManager.saveData('files', SaveManager.gameData.files);
        
        return file;
    },

    // 确保所有路径中的目录存在
    ensureDirectories: function(filePath) {
        const pathParts = filePath.split('/');
        
        // 移除最后一个部分(文件名)
        pathParts.pop();
        
        if (pathParts.length === 0) return; // 没有目录部分
        
        // 逐级创建目录
        let currentPath = "";
        pathParts.forEach((part, index) => {
            if (index > 0) currentPath += "/";
            currentPath += part;
            
            // 检查此目录是否已存在
            const exists = SaveManager.gameData.files.list.some(file => 
                file.type === "DIR" && file.title === currentPath
            );
            
            // 如果不存在，创建目录
            if (!exists) {
                console.log("自动创建目录:", currentPath);
                
                // 创建目录对象
                const dirId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
                const directory = {
                    id: dirId,
                    type: "DIR",
                    title: currentPath,
                    content: `DIRECTORY: AUTO-GENERATED FOR ${currentPath}`
                };
                
                // 添加到文件数组
                SaveManager.gameData.files.list.push(directory);
            }
        });
    },
    
    // 更新文件
    updateFile: function(id, newData) {
        const file = this.getFileById(id);
        if (file) {
            if (newData.type !== undefined) file.type = newData.type;
            if (newData.title !== undefined) file.title = newData.title;
            if (newData.content !== undefined) file.content = newData.content;
            
            SaveManager.saveData('files', SaveManager.gameData.files);
            return true;
        }
        return false;
    },
    
    // 删除文件
    deleteFile: function(id) {
        if (!SaveManager.gameData.files.list) return false;
        
        const initialLength = SaveManager.gameData.files.list.length;
        SaveManager.gameData.files.list = SaveManager.gameData.files.list.filter(file => file.id !== id);
        
        // 如果数组长度变化了，说明删除成功
        if (initialLength !== SaveManager.gameData.files.list.length) {
            SaveManager.saveData('files', SaveManager.gameData.files);
            return true;
        }
        return false;
    },
    
    // 初始化默认文件
    initDefaultFiles: function() {
        // 清空现有文件
        SaveManager.gameData.files = { list: [] };
        
        // 添加顶级文件
        this.addFile({
            type: "TXT",
            title: "README.TXT",
            content: "WELCOME TO CIA TERMINAL SYSTEM\n\nTHIS SYSTEM IS DESIGNED FOR SECURE COMMUNICATIONS AND INTELLIGENCE GATHERING.\n\nUSE THE FILE BROWSER TO ACCESS MISSION DOCUMENTS AND INTELLIGENCE REPORTS.\n\nCONTACT TECHNICAL SUPPORT IF YOU ENCOUNTER ANY ISSUES."
        });
        
        // 添加其他默认文件...
        this.addFile({
            type: "TXT",
            title: "CURRENT_MISSION.TXT",
            content: "MISSION: EAGLE EYE\n\nOBJECTIVE: MONITOR DIPLOMATIC COMMUNICATIONS FROM SOVIET EMBASSY\n\nSTATUS: ACTIVE\n\nDETAILS:\n1. INTERCEPT ALL OUTGOING COMMUNICATIONS\n2. DECODE ENCRYPTED MESSAGES USING DECRYPTION TOOL\n3. REPORT ANY SUSPICIOUS ACTIVITY\n\nCONTACT HANDLER IF SITUATION ESCALATES."
        });
        
        // 添加带路径的文件与其他文件...
        // [这里省略了原来代码中的其他文件，实际使用时需要保留]
        
        // 添加带路径的文件 - 将自动创建目录结构
        this.addFile({
            type: "TXT",
            title: "MISSIONS/EAGLE_EYE.TXT",
            content: "MISSION BRIEF: EAGLE EYE\n\nCODE NAME: EAGLE EYE\nCLASSIFICATION: TOP SECRET\nLOCATION: WASHINGTON D.C.\nDURATION: ONGOING\n\nOBJECTIVE:\nEstablish surveillance on Soviet diplomatic channels. Monitor for encoded transmissions that may indicate espionage activities.\n\nRESOURCES:\n- Terminal access to SIGINT database\n- Decryption tools\n- Field agents on standby\n\nPROCEDURE:\n1. Monitor all communications channels daily\n2. Decrypt any suspicious messages\n3. Cross-reference with known Soviet codes\n4. Report findings through secure channels\n\nAUTHORIZATION:\nDirector of Operations\n28-APR-1982"
        });
        
        // [添加其他文件...]
        
        console.log("已创建默认文件和自动生成的目录结构");
        SaveManager.saveData('files', SaveManager.gameData.files);
    }
};

// 导出模块
// 注意：在浏览器环境中，这会被添加到全局作用域