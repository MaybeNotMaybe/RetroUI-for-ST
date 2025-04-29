// js/utils/SaveManager.js - 高级游戏存档管理系统
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
        
        // 初始化邮件数据
        if (this.gameData.emails.length === 0) {
            this.EmailDataModule.initDefaultEmails();
        }
        
        // 修改这里：确保文件系统一定被初始化
        // 注意：为测试目的可以添加强制初始化
        console.log("检查文件系统数据:", this.gameData.files);
        
        // 如果files不是对象或没有list数组，或是空数组，就初始化
        if (!this.gameData.files || !this.gameData.files.list || this.gameData.files.list.length === 0) {
            console.log("正在初始化默认文件数据...");
            this.FileDataModule.initDefaultFiles();
        }
        
        // 调试：检查初始化后的文件
        console.log("初始化后的文件数据:", this.gameData.files);
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
    },
    
    // 邮件数据模块
    EmailDataModule: {
        // 获取所有邮件
        getAllEmails: function() {
            return SaveManager.gameData.emails;
        },
        
        // 获取未读邮件数量
        getUnreadCount: function() {
            return SaveManager.gameData.emails.filter(email => !email.read).length;
        },
        
        // 按ID获取邮件
        getEmailById: function(id) {
            return SaveManager.gameData.emails.find(email => email.id === id);
        },
        
        // 获取未读邮件
        getUnreadEmails: function() {
            return SaveManager.gameData.emails.filter(email => !email.read);
        },
        
        // 添加新邮件
        addEmail: function(emailData) {
            // 生成唯一ID
            const id = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            
            // 创建邮件对象
            const email = {
                id: id,
                sender: emailData.sender,
                subject: emailData.subject,
                date: emailData.date || new Date().toISOString(),
                read: emailData.read || false,
                content: emailData.content
            };
            
            // 添加到邮件数组
            SaveManager.gameData.emails.push(email);
            
            // 保存更新
            SaveManager.saveData('emails', SaveManager.gameData.emails);
            
            if (!email.read) {
                const unreadCount = this.getUnreadCount();
                EventBus.publish('mail:unreadChanged', unreadCount);
            }
            
            return email;
        },
        
        // 标记邮件为已读
        markAsRead: function(id) {
            const email = this.getEmailById(id);
            if (email) {
                email.read = true;
                SaveManager.saveData('emails', SaveManager.gameData.emails);
                
                // 发布未读邮件变化事件
                const unreadCount = this.getUnreadCount();
                EventBus.publish('mail:unreadChanged', unreadCount);
                
                return true;
            }
            return false;
        },
        
        // 删除邮件
        deleteEmail: function(id) {
            const initialLength = SaveManager.gameData.emails.length;
            SaveManager.gameData.emails = SaveManager.gameData.emails.filter(email => email.id !== id);
            
            // 如果数组长度变化了，说明删除成功
            if (initialLength !== SaveManager.gameData.emails.length) {
                SaveManager.saveData('emails', SaveManager.gameData.emails);
                return true;
            }
            return false;
        },
        
        // 初始化默认邮件
        initDefaultEmails: function() {
            // 清空现有邮件
            SaveManager.gameData.emails = [];
            
            // 添加默认邮件
            this.addEmail({
                sender: "DIRECTOR",
                subject: "WELCOME TO THE AGENCY",
                date: "1982-04-28T09:15:00",
                read: false,
                content: "AGENT,\n\nWELCOME TO YOUR NEW ASSIGNMENT. THIS TERMINAL WILL BE YOUR PRIMARY INTERFACE FOR MISSION COMMUNICATIONS AND INTELLIGENCE GATHERING.\n\nYOUR FIRST BRIEFING WILL ARRIVE SHORTLY. STAY VIGILANT.\n\n- DIRECTOR"
            });
            
            this.addEmail({
                sender: "TECH_SUPPORT",
                subject: "TERMINAL USAGE INSTRUCTIONS",
                date: "1982-04-28T10:30:00",
                read: false,
                content: "TO: FIELD AGENT\nFROM: TECHNICAL SUPPORT\n\nYOUR TERMINAL SYSTEM HAS BEEN CONFIGURED WITH VARIOUS TOOLS:\n\n- FILE BROWSER: Access mission documents\n- DOSSIER SYSTEM: Review personnel files\n- DECRYPTION TOOL: Decode intercepted messages\n\nCONTACT SUPPORT IF YOU ENCOUNTER ANY ISSUES.\n\nREGARDS,\nTECHNICAL DIVISION"
            });
            
            this.addEmail({
                sender: "HANDLER",
                subject: "FIRST MISSION DETAILS",
                date: "1982-04-29T08:00:00",
                read: false,
                content: "AGENT,\n\nYOU ARE ASSIGNED TO MONITOR DIPLOMATIC COMMUNICATIONS FROM THE SOVIET EMBASSY. WE HAVE INTELLIGENCE SUGGESTING UNUSUAL ACTIVITY THAT MAY INDICATE A SECURITY BREACH.\n\nUSE THE DECRYPTION TOOL TO ANALYZE ANY INTERCEPTED MESSAGES. REPORT FINDINGS IMMEDIATELY.\n\nDESTROY THIS MESSAGE AFTER READING.\n\n- HANDLER"
            });
        }
    },
    
    // 文件数据模块
    FileDataModule: {
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
            
            this.addFile({
                type: "TXT",
                title: "CURRENT_MISSION.TXT",
                content: "MISSION: EAGLE EYE\n\nOBJECTIVE: MONITOR DIPLOMATIC COMMUNICATIONS FROM SOVIET EMBASSY\n\nSTATUS: ACTIVE\n\nDETAILS:\n1. INTERCEPT ALL OUTGOING COMMUNICATIONS\n2. DECODE ENCRYPTED MESSAGES USING DECRYPTION TOOL\n3. REPORT ANY SUSPICIOUS ACTIVITY\n\nCONTACT HANDLER IF SITUATION ESCALATES."
            });
            
            // 添加带路径的文件 - 将自动创建目录结构
            this.addFile({
                type: "TXT",
                title: "MISSIONS/EAGLE_EYE.TXT",
                content: "MISSION BRIEF: EAGLE EYE\n\nCODE NAME: EAGLE EYE\nCLASSIFICATION: TOP SECRET\nLOCATION: WASHINGTON D.C.\nDURATION: ONGOING\n\nOBJECTIVE:\nEstablish surveillance on Soviet diplomatic channels. Monitor for encoded transmissions that may indicate espionage activities.\n\nRESOURCES:\n- Terminal access to SIGINT database\n- Decryption tools\n- Field agents on standby\n\nPROCEDURE:\n1. Monitor all communications channels daily\n2. Decrypt any suspicious messages\n3. Cross-reference with known Soviet codes\n4. Report findings through secure channels\n\nAUTHORIZATION:\nDirector of Operations\n28-APR-1982"
            });
            
            this.addFile({
                type: "TXT",
                title: "MISSIONS/ARCHIVE/BLUEJAY.TXT",
                content: "MISSION BRIEF: BLUE JAY\n\nCODE NAME: BLUE JAY\nCLASSIFICATION: SECRET\nLOCATION: WEST BERLIN\nDURATION: COMPLETED (1981)\n\nOBJECTIVE:\nInfiltrate suspected KGB front organization and recover intelligence on East German operations.\n\nOUTCOME:\nSuccess. Recovered documents revealing three deep cover agents in NATO.\n\nCASUALTIES: None\n\nNOTES:\nFollow-up surveillance recommended on identified associates."
            });
            
            this.addFile({
                type: "TXT",
                title: "INTEL/SOVIET_EMBASSY_STAFF.TXT",
                content: "SOVIET EMBASSY PERSONNEL - WASHINGTON D.C.\n\nOFFICIAL DIPLOMATIC STAFF:\n\n1. VIKTOR PETROV - AMBASSADOR\n   ARRIVED: 1980-03-15\n   NOTES: CAREER DIPLOMAT, NO KNOWN KGB AFFILIATIONS\n\n2. MIKHAIL BARANOV - CULTURAL ATTACHÉ\n   ARRIVED: 1981-06-22\n   NOTES: SUSPECTED GRU INTELLIGENCE OFFICER\n\n3. NATALIA SOKOLOVA - PRESS SECRETARY\n   ARRIVED: 1979-11-04\n   NOTES: CLEAN BACKGROUND\n\n4. DMITRI VOLKOV - FIRST SECRETARY\n   ARRIVED: 1981-01-10\n   NOTES: UNUSUAL COMMUNICATION PATTERNS DETECTED\n         POSSIBLE HANDLER FOR ASSETS\n         PRIORITY SURVEILLANCE TARGET\n\n5. IVAN KUZNETSOV - ECONOMIC ADVISOR\n   ARRIVED: 1982-02-18\n   NOTES: RECENT ARRIVAL, BACKGROUND CHECK PENDING"
            });
            
            this.addFile({
                type: "TXT",
                title: "PERSONNEL/CONTACTS.TXT",
                content: "EMERGENCY CONTACTS\n\nFIELD OPERATIONS:\nHANDLER: JOHNSON\nCODE: OSCAR-DELTA-7\nEMERGENCY LINE: 555-3900\n\nTECHNICAL SUPPORT:\nLEAD: CLARKE\nCODE: TANGO-SIERRA-2\nDIRECT LINE: 555-4017\n\nEXTRACTION TEAM:\nLEAD: MARTINEZ\nCODE: ECHO-XRAY-9\nSTANDBY: 24HR\n\nSAFE HOUSES:\n1. GEORGETOWN - 1429 WISCONSIN AVE\n   PASSPHRASE: \"THE WEATHER IN CHICAGO IS UNPREDICTABLE\"\n\n2. ALEXANDRIA - 227 KING STREET\n   PASSPHRASE: \"I'M LOOKING FOR MY BROTHER'S RECORD COLLECTION\"\n\nMEDICAL:\nDR. WILSON - 555-6332\nCODE: MEDICAL SITUATION ALPHA"
            });
            
            // 添加深层嵌套目录中的文件
            this.addFile({
                type: "TXT",
                title: "INTEL/KGB/ASSETS/KNOWN_OPERATIVES.TXT",
                content: "KGB KNOWN OPERATIVES - NORTH AMERICA\n\n1. CODENAME: FALCON\n   REAL NAME: UNKNOWN\n   POSITION: SUSPECTED STATE DEPARTMENT INFILTRATION\n   STATUS: ACTIVE\n\n2. CODENAME: MERCURY\n   REAL NAME: POSSIBLY ALEXEI KUZNETSOV\n   POSITION: SCIENTIFIC INTELLIGENCE\n   STATUS: UNDER SURVEILLANCE\n\n3. CODENAME: VEGA\n   REAL NAME: UNKNOWN (FEMALE)\n   POSITION: COMMUNICATIONS SPECIALIST\n   STATUS: ACTIVE, HIGH PRIORITY TARGET\n\nLAST UPDATED: MARCH 12, 1982\nCLEARANCE LEVEL: TOP SECRET/UMBRA"
            });
            
            // 在最后增加确认保存的代码
            console.log("已创建默认文件和自动生成的目录结构");
            SaveManager.saveData('files', SaveManager.gameData.files);
        }
    },

    // 此处可以添加其他数据模块，如FileDataModule, MissionDataModule等
    
    // 初始化所有模块默认数据
    initAllDefaultData: function() {
        this.EmailDataModule.initDefaultEmails();
        // 其他模块的默认数据初始化...
    }
};