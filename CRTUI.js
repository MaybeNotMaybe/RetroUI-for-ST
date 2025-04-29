// EventBus - 事件发布/订阅系统，用于模块间通信
const EventBus = {
    events: {},
    
    subscribe: function(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    },
    
    publish: function(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => callback(data));
    },
    
    unsubscribe: function(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
};

// StorageManager - 管理本地存储
const StorageManager = {
    save: function(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },
    
    load: function(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },
    
    remove: function(key) {
        localStorage.removeItem(key);
    }
};

// Constants - 应用常量
const Constants = {
    STORAGE_KEYS: {
        USER_PROFILE: 'cia_user_profile',
        USER_AVATAR: 'cia_user_avatar',
        USER_NAME: 'cia_user_name',
        GAME_PROGRESS: 'cia_game_progress'
    },
    
    APPS: {
        TERMINAL: 'terminal',
        FILE_EXPLORER: 'fileExplorer',
        DOSSIER: 'dossierSystem',
        DECRYPT: 'decryptTool',
        MAIL: 'mail',
        COMMS: 'comms',
        MAP: 'map',
        MUSIC: 'musicPlayer',
        SETTINGS: 'settings'
    },
    
    COMMANDS: {
        HELP: 'help',
        STATUS: 'status',
        CLEAR: 'clear',
        EXIT: 'exit',
        LOGOUT: 'logout',
        LIST: 'list',
        RUN: 'run',
        LOGIN: 'login'
    },
    
    getTerminalHeader: function() {
// 获取未读邮件数量
const unreadCount = SaveManager.EmailDataModule.getUnreadCount();

return `>CENTRAL INTELLIGENCE AGENCY
>SYSTEML V3.2.1 [1981-10-29]
>COPYRIGHT (C) 1977
>SECURE TERMINA - AUTHORIZED PERSONNEL ONLY
>
>WEATHER - NEW BOSTON CLOUDY 56F
>MAIL - INBOX: ${unreadCount} UNREAD
>MUSIC <<[0]>> L'envol - Oil Astral
>
`;
}
};

// Config - 应用配置
const Config = {
    DEBUG_MODE: false,
    DEFAULT_DATE: new Date(1982, 3, 29, 12, 0, 0),
    CLOCK_UPDATE_INTERVAL: 1000, // ms
    DEFAULT_USER: {
        name: "AGENT",
        rank: "FIELD OPERATIVE",
        clearance: "LEVEL 3"
    }
};

// UserModel - 管理用户数据和认证
const UserModel = {
    profile: {
        name: Config.DEFAULT_USER.name,
        rank: Config.DEFAULT_USER.rank,
        clearance: Config.DEFAULT_USER.clearance,
        avatar: null
    },
    
    authenticated: true,
    
    init: function() {
        this.loadProfile();
    },
    
    login: function(username) {
        if (username) {
            this.profile.name = username.toUpperCase();
        }
        this.authenticated = true;
        this.saveProfile();
        EventBus.publish('user:login', this.profile);
        return `ACCESS GRANTED\nWELCOME ${this.profile.name}\n\nTYPE 'HELP' FOR AVAILABLE COMMANDS.`;
    },
    
    logout: function() {
        this.authenticated = false;
        EventBus.publish('user:logout');
        return "LOGOUT SUCCESSFUL\nSYSTEM LOCKED";
    },
    
    saveProfile: function() {
        if (this.profile.avatar) {
            StorageManager.save(Constants.STORAGE_KEYS.USER_AVATAR, this.profile.avatar);
        }
        StorageManager.save(Constants.STORAGE_KEYS.USER_NAME, this.profile.name);
    },
    
    loadProfile: function() {
        const savedAvatar = StorageManager.load(Constants.STORAGE_KEYS.USER_AVATAR);
        const savedName = StorageManager.load(Constants.STORAGE_KEYS.USER_NAME);
        
        if (savedAvatar) {
            this.profile.avatar = savedAvatar;
        }
        
        if (savedName) {
            this.profile.name = savedName;
        }
    },
    
    updateAvatar: function(avatarData) {
        this.profile.avatar = avatarData;
        this.saveProfile();
        EventBus.publish('user:avatarChanged', avatarData);
    },
    
    isAuthenticated: function() {
        return this.authenticated;
    }
};

// SystemModel - 管理系统状态
const SystemModel = {
    currentScreen: Constants.APPS.TERMINAL,
    currentDate: new Date(Config.DEFAULT_DATE),
    
    init: function() {
        this.startClock();
    },
    
    changeScreen: function(screenId) {
        this.currentScreen = screenId;
        EventBus.publish('system:screenChanged', screenId);
    },
    
    startClock: function() {
        setInterval(() => {
            this.updateTime();
        }, Config.CLOCK_UPDATE_INTERVAL);
    },
    
    updateTime: function() {
        this.currentDate.setSeconds(this.currentDate.getSeconds() + 1);
        EventBus.publish('system:timeUpdated', this.currentDate);
    },
    
    getSystemInfo: function() {
        return {
            screen: this.currentScreen,
            date: this.currentDate
        };
    },
    
    reboot: function() {
        EventBus.publish('system:reboot');
        setTimeout(() => {
            this.changeScreen(Constants.APPS.TERMINAL);
            EventBus.publish('system:bootComplete');
        }, 1000);
    }
};

// MissionModel - 管理任务和游戏进度
const MissionModel = {
    missions: [],
    currentMission: null,
    progress: 0,
    
    init: function() {
        // 初始化任务数据
    },
    
    loadMission: function(id) {
        // 加载特定任务
    },
    
    updateProgress: function(missionId, step) {
        // 更新任务进度
        this.progress = Math.min(100, this.progress + step);
        EventBus.publish('mission:progressUpdated', this.progress);
    },
    
    getMissionStatus: function() {
        return `MISSION STATUS: IN PROGRESS (${this.progress}%)\n` +
                `AGENT: ${UserModel.profile.name}\n` +
                `RANK: ${UserModel.profile.rank}\n` +
                `CLEARANCE: ${UserModel.profile.clearance}`;
    }
};

// TerminalModel - 管理终端状态和命令处理
const TerminalModel = {
    commandHistory: [],
    currentCommandIndex: -1,
    
    init: function() {
        // 初始化终端模型
    },
    
    addToHistory: function(command) {
        this.commandHistory.push(command);
        this.currentCommandIndex = this.commandHistory.length;
    },
    
    getPreviousCommand: function() {
        if (this.currentCommandIndex > 0) {
            this.currentCommandIndex--;
            return this.commandHistory[this.currentCommandIndex];
        }
        return null;
    },
    
    getNextCommand: function() {
        if (this.currentCommandIndex < this.commandHistory.length - 1) {
            this.currentCommandIndex++;
            return this.commandHistory[this.currentCommandIndex];
        } else {
            this.currentCommandIndex = this.commandHistory.length;
            return '';
        }
    },
    
    processCommand: function(command) {
        if (!command) return '';
        
        this.addToHistory(command);
        
        // 登录逻辑
        if (!UserModel.isAuthenticated()) {
            if (command.toLowerCase().startsWith(Constants.COMMANDS.LOGIN)) {
                let username = Config.DEFAULT_USER.name; // 默认名称
                // 检查是否有提供用户名 (例如: login john)
                const parts = command.split(' ');
                if (parts.length > 1) {
                    username = parts.slice(1).join(' ');
                }
                return UserModel.login(username);
            } else {
                return "ERROR: UNAUTHORIZED ACCESS ATTEMPT\nUSE 'LOGIN' COMMAND TO PROCEED.";
            }
        }
        
        // 命令解析
        const cmd = command.toLowerCase();
        
        // 基本命令
        if (cmd === Constants.COMMANDS.HELP) {
            return "AVAILABLE COMMANDS:\n" +
                    "- HELP: Display this help message\n" +
                    "- STATUS: Show mission status\n" +
                    "- CLEAR: Clear terminal screen\n" +
                    "- EXIT: Logout of system\n" +
                    "- RUN [PROGRAM]: Launch program\n" +
                    "- LIST: List available programs";
        } else if (cmd === Constants.COMMANDS.STATUS) {
            return MissionModel.getMissionStatus();
        } else if (cmd === Constants.COMMANDS.CLEAR) {
            return "CLEAR_SCREEN";
        } else if (cmd === Constants.COMMANDS.EXIT || cmd === Constants.COMMANDS.LOGOUT) {
            return UserModel.logout();
        } else if (cmd === Constants.COMMANDS.LIST) {
            return "AVAILABLE PROGRAMS:\n" +
                    "- FILE: File browser\n" +
                    "- DOSSIER: Personnel database\n" +
                    "- DECRYPT: Decryption utility\n" +
                    "- COMMS: Communications system\n" +
                    "- MAP: World map utility\n" +
                    "- MISSION: Mission details";
        } else if (cmd.startsWith(`${Constants.COMMANDS.RUN} `)) {
            const app = cmd.substring(4).trim();
            if (app === "file") {
                return "LAUNCH_APP:fileExplorer";
            } else if (app === "dossier") {
                return "LAUNCH_APP:dossierSystem";
            } else if (app === "decrypt") {
                return "LAUNCH_APP:decryptTool";
            } else if (app === "comms" || app === "map" || app === "mission") {
                return `LAUNCHING ${app.toUpperCase()}...\nERROR: MODULE NOT AVAILABLE IN DEMO VERSION.`;
            } else {
                return `ERROR: PROGRAM '${app}' NOT FOUND.`;
            }
        }
        
        // 默认响应
        return `COMMAND NOT RECOGNIZED: ${command}\nTYPE 'HELP' FOR AVAILABLE COMMANDS.`;
    }
};

// TerminalView - 管理终端显示
const TerminalView = {
    terminal: null,
    output: null,
    input: null,
    commandText: null,
    
    init: function() {
        this.terminal = document.getElementById('terminal');
        this.output = document.getElementById('output');
        this.input = document.getElementById('user-input');
        this.commandText = document.getElementById('command-text');
        
        if (this.input && this.commandText) {
            this.input.addEventListener('input', () => {
                this.updateCommandText();
            });
            
            this.input.addEventListener('keydown', (e) => {
                if (e.key === ' ') {
                    setTimeout(() => this.updateCursorPosition(), 10);
                }
            });
        }
        
        if (this.terminal && this.input) {
            this.terminal.addEventListener('click', () => {
                this.input.focus();
            });
        }
        
        this.initFocusIndicator();
        this.initCustomCursor();
        
        // 清屏并显示头部内容
        this.clearScreen();
    },
    
    clearScreen: function() {
        this.output.innerHTML = Constants.getTerminalHeader();
    },
    
    appendOutput: function(text) {
        if (text === "CLEAR_SCREEN") {
            this.clearScreen();
            return;
        }
        
        if (text.startsWith("LAUNCH_APP:")) {
            const appName = text.split(":")[1];
            EventBus.publish('app:launch', appName);
            return;
        }
        
        this.output.innerHTML += text + "\n";
        this.scrollToBottom();
    },
    
    updateCommandText: function() {
        if (this.commandText) {
            this.commandText.textContent = this.input.value;
            this.updateCursorPosition();
        }
    },
    
    scrollToBottom: function() {
        this.terminal.scrollTop = this.terminal.scrollHeight;
    },
    
    updateCursorPosition: function() {
        const input = this.input;
        const cursor = document.querySelector('.cursor');
        const promptElement = document.querySelector('.prompt');
        
        if (!input || !cursor || !promptElement) return;
        
        try {
            const textMeasure = document.createElement('span');
            textMeasure.style.font = window.getComputedStyle(input).font;
            textMeasure.style.position = 'absolute';
            textMeasure.style.visibility = 'hidden';
            textMeasure.style.whiteSpace = 'pre';
            textMeasure.textContent = input.value.substring(0, input.selectionStart);
            document.body.appendChild(textMeasure);
            
            const textWidth = textMeasure.getBoundingClientRect().width;
            const promptWidth = promptElement.getBoundingClientRect().width;
            
            cursor.style.left = (promptWidth + textWidth) + 'px';
            
            document.body.removeChild(textMeasure);
        } catch (error) {
            console.log("光标位置更新出错:", error);
        }
    },
    
    initCustomCursor: function() {
        const input = this.input;
        const cursor = document.querySelector('.cursor');
        
        if (!input || !cursor) return;
        
        input.addEventListener('input', () => this.updateCursorPosition());
        input.addEventListener('click', () => this.updateCursorPosition());
        input.addEventListener('keydown', () => {
            setTimeout(() => this.updateCursorPosition(), 0);
        });
        window.addEventListener('resize', () => this.updateCursorPosition());
        
        setTimeout(() => this.updateCursorPosition(), 10);
        
        input.focus();
    },
    
    initFocusIndicator: function() {
        const terminal = this.terminal;
        const input = this.input;
        
        if (terminal && input) {
            terminal.classList.add('input-focus');
            
            input.addEventListener('focus', () => {
                terminal.classList.add('input-focus');
            });
            
            input.addEventListener('blur', () => {
                terminal.classList.remove('input-focus');
            });
        }
    },
    
    getInput: function() {
        return this.input.value.trim();
    },
    
    clearInput: function() {
        this.input.value = '';
        if (this.commandText) {
            this.commandText.textContent = '';
        }
        this.updateCursorPosition();
    }
};

// ApplicationView - 管理应用程序窗口显示
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

// UserInterfaceView - 管理用户界面通用元素
const UserInterfaceView = {
    init: function() {
        this.initAvatarUpload();
    },
    
    updateClock: function(date) {
        const clock = document.getElementById('clock');
        if (!clock) return;
        
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const formattedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
        clock.textContent = `${formattedDate} ${formattedTime}`;
    },
    
    updateUserProfile: function(userProfile, authenticated) {
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        
        if (!userAvatar || !userName) {
            console.log("无法找到用户头像或名称元素");
            return;
        }
        
        try {
            // 更新头像
            if (userProfile.avatar && authenticated) {
                userAvatar.src = userProfile.avatar;
                userAvatar.classList.remove('pixelated');
            } else {
                // 默认或登出状态使用马赛克效果
                userAvatar.src = "data:image/jpeg;base64,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";
                userAvatar.classList.add('pixelated');
            }
            
            // 更新用户名
            if (authenticated) {
                userName.textContent = userProfile.name;
            } else {
                userName.textContent = "No User";
            }
            } catch (error) {
            console.log("更新用户档案时出错:", error);
        }
    },
    
    updateInfoBar: function(text) {
        const infoText = document.getElementById('info-text');
        if (infoText) {
            infoText.textContent = text;
        }
    },
    
    bootSequence: function() {
        const terminal = document.getElementById('terminal');
        if (terminal) {
            terminal.classList.add('flicker-effect');
            setTimeout(() => {
                terminal.classList.remove('flicker-effect');
            }, 2000);
        }
    },
    
    initAvatarUpload: function() {
        const avatarContainer = document.querySelector('.avatar-container');
        const avatarUpload = document.getElementById('avatar-upload');
        
        if (avatarContainer && avatarUpload) {
            avatarContainer.addEventListener('click', () => {
                if (UserModel.isAuthenticated()) {
                    avatarUpload.click();
                }
            });
            
            avatarUpload.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    
                    reader.onload = (e) => {
                        UserModel.updateAvatar(e.target.result);
                    };
                    
                    reader.readAsDataURL(e.target.files[0]);
                }
            });
        }
    }
};

// MailView - 管理邮件界面显示
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

// FileView - 管理文件浏览器显示
const FileView = {
    // 当前选中的文件索引
    selectedIndex: 0,
    // 当前显示视图 (list/detail)
    currentView: 'list',
    // 当前显示的文件列表
    displayedFiles: [],
    // 当前路径
    currentPath: "",
    // 是否处于活动状态
    isActive: false,

    // 确保视图状态与当前模式匹配
    ensureViewState: function() {
        if (this.currentView === 'list') {
            document.getElementById('file-list-view').style.display = 'block';
            document.getElementById('file-detail-view').style.display = 'none';
        } else {
            document.getElementById('file-list-view').style.display = 'none';
            document.getElementById('file-detail-view').style.display = 'block';
        }
    },
    
    // 初始化
    init: function() {
        this.initEventListeners();
        
        // 增加视图状态订阅
        EventBus.subscribe('app:launch', (appId) => {
            if (appId === 'fileExplorer') {
                // 确保每次启动时都是列表视图并在根目录
                setTimeout(() => {
                    this.currentView = 'list';
                    this.currentPath = "";
                    this.ensureViewState();
                    this.loadDirectory(this.currentPath);
                }, 50);
            }
        });

        // 确保点击文件浏览器区域时设置焦点
        document.getElementById('fileExplorer').addEventListener('click', (e) => {
            // 避免与具体项的点击事件冲突
            if (e.target.id === 'fileExplorer' || 
                e.target.className.includes('window-content') ||
                e.target.className.includes('file-list-view') ||
                e.target.className.includes('file-detail-view')) {
                
                this.isActive = true;
                NavigationController.setFocusMode('app');
            }
        });
    },
    
    // 初始化事件监听器
    initEventListeners: function() {
        // 返回按钮点击事件
        document.querySelector('.file-back-btn').addEventListener('click', () => {
            // 确保设置活动状态，防止焦点跳转到菜单
            this.isActive = true;
            NavigationController.setFocusMode('app');
            
            this.showListView();
        });
        
        // 订阅应用程序退出请求
        EventBus.subscribe('app:requestExit', () => {
            if (SystemModel.currentScreen === 'fileExplorer') {
                if (this.currentView === 'detail') {
                    // 如果在详情视图，先返回列表视图
                    this.showListView();
                } else if (this.currentPath !== "") {
                    // 如果不在根目录，返回上一级目录
                    this.navigateToParentDirectory();
                } else {
                    // 如果已经在根目录列表视图，则退出应用
                    EventBus.publish('app:close');
                }
            }
        });
        
        // 订阅导航模式变化
        EventBus.subscribe('navigation:modeChanged', (mode) => {
            this.isActive = (mode === 'app' && SystemModel.currentScreen === 'fileExplorer');
        });

        // 订阅应用激活事件
        EventBus.subscribe('app:activated', (appId) => {
            if (appId === 'fileExplorer') {
                // 确保为列表视图
                this.currentView = 'list';
                this.isActive = true;
                this.ensureViewState();
                this.updateSelection();
            }
        });
        
        // 全局键盘事件监听
        document.addEventListener('keydown', (e) => {
            // 仅当文件应用活动时处理键盘事件
            if (!this.isActive || SystemModel.currentScreen !== 'fileExplorer') return;
            
            // ESC键处理
            if (e.key === 'Escape') {
                if (this.currentView === 'detail') {
                    // 在详情视图时，ESC返回列表视图
                    e.stopPropagation(); // 阻止事件冒泡，防止被NavigationController捕获
                    this.showListView();
                } else if (this.currentPath !== "") {
                    // 非根目录返回上级
                    e.stopPropagation();
                    this.navigateToParentDirectory();
                } else {
                    // 根目录时，让事件冒泡到NavigationController，关闭应用
                    // 不需要特殊处理
                }
                e.preventDefault();
                return;
            }
            
            // 确保视图状态与实际显示一致
            this.ensureViewState();
            
            // 如果在应用焦点模式下但没有响应键盘，尝试激活
            if (NavigationController.focusMode === 'app' && !this.isActive) {
                this.isActive = true;
            }
            
            // 处理不同视图模式下的键盘事件
            if (this.currentView === 'list') {
                // 列表视图下的键盘导航
                switch (e.key) {
                    case 'ArrowUp':
                        this.selectPrevFile();
                        e.preventDefault();
                        break;
                    case 'ArrowDown':
                        this.selectNextFile();
                        e.preventDefault();
                        break;
                    case 'Enter':
                        this.openSelectedItem();
                        e.preventDefault();
                        break;
                    case 'Backspace':
                        // 返回上级目录
                        if (this.currentPath !== "") {
                            this.navigateToParentDirectory();
                            e.preventDefault();
                        }
                        break;
                }
            } else if (this.currentView === 'detail') {
                // 详情视图下的键盘导航
                switch (e.key) {
                    case 'ArrowLeft':
                    case 'Backspace':
                        this.showListView();
                        e.preventDefault();
                        break;
                }
            }
        });
    },
    
    // 加载并显示指定目录
    loadDirectory: function(path) {
        this.currentPath = path;
        
        // 更新路径显示
        document.getElementById('current-path').textContent = `PATH: /${path}`;
        
        // 获取目录内容
        let files = SaveManager.FileDataModule.getFilesByPath(path);
        
        // 为非根目录添加返回上级目录的选项
        if (path !== "") {
            // 使用特殊标记，不是真实文件
            files.unshift({
                id: "parent-dir",
                type: "UP-DIR",
                title: "..",
                isParentDir: true
            });
        }
        
        // 设置显示文件列表
        this.displayedFiles = files;
        this.selectedIndex = 0;
        
        // 渲染文件列表
        this.renderFileList();
    },
    
    // 导航到父级目录
    navigateToParentDirectory: function() {
        if (this.currentPath === "") return;
        
        const pathParts = this.currentPath.split('/');
        pathParts.pop(); // 移除最后一个部分
        const parentPath = pathParts.join('/');
        
        this.loadDirectory(parentPath);
    },
    
    // 渲染文件列表
    renderFileList: function() {
        const container = document.getElementById('file-list-container');
        container.innerHTML = '';
        
        if (this.displayedFiles.length === 0) {
            container.innerHTML = '<div class="no-file-message">DIRECTORY EMPTY</div>';
            return;
        }
        
        // 排序文件列表：父目录优先，然后是目录，最后是文件
        this.displayedFiles.sort((a, b) => {
            // 父目录(..)始终在最前
            if (a.isParentDir) return -1;
            if (b.isParentDir) return 1;
            
            // 目录在文件前面
            if (a.type === 'DIR' && b.type !== 'DIR') return -1;
            if (a.type !== 'DIR' && b.type === 'DIR') return 1;
            
            // 同类型按名称排序
            return a.title.localeCompare(b.title);
        });
        
        // 创建文件列表项
        this.displayedFiles.forEach((file, index) => {
            const row = document.createElement('div');
            row.className = `file-item ${index === this.selectedIndex ? 'selected' : ''}`;
            row.setAttribute('data-index', index);
            
            // 设置图标
            let icon = '[TXT]';
            if (file.type === 'DIR') {
                icon = '[DIR]';
            } else if (file.type === 'EXE') {
                icon = '[EXE]';
            } else if (file.type === 'IMG') {
                icon = '[IMG]';
            } else if (file.type === 'UP-DIR') {
                icon = '[..]';
            }
            
            // 显示文件名（不包含路径）
            let displayName = file.title;
            if (!file.isParentDir) {
                // 提取文件名（不含路径）
                const nameParts = file.title.split('/');
                displayName = nameParts[nameParts.length - 1];
            }
            
            // 组装行内容
            row.innerHTML = `
                <span class="file-icon">${icon}</span>
                <span class="file-name">${displayName}</span>
            `;
            
            // 添加点击事件
            row.addEventListener('click', () => {
                // 设置活动状态和焦点模式
                this.isActive = true;
                NavigationController.setFocusMode('app');
                
                // 更新选中项
                this.selectedIndex = index;
                this.updateSelection();
                
                // 打开选中项
                this.openSelectedItem();
            });
            
            container.appendChild(row);
        });
        
        // 确保选中项高亮
        this.updateSelection();
        
        // 更新信息栏
        UserInterfaceView.updateInfoBar("FILE BROWSER: USE ARROWS to NAVIGATE, ENTER to OPEN, BACKSPACE for PARENT DIR");
    },
    
    // 打开选中的项目（文件或目录）
    openSelectedItem: function() {
        if (this.displayedFiles.length === 0) return;
        
        const selectedFile = this.displayedFiles[this.selectedIndex];
        if (!selectedFile) return;
        
        // 处理上级目录
        if (selectedFile.isParentDir) {
            this.navigateToParentDirectory();
            return;
        }
        
        // 根据类型处理
        if (selectedFile.type === 'DIR') {
            // 如果是目录，进入该目录
            let newPath = selectedFile.title;
            this.loadDirectory(newPath);
        } else {
            // 如果是文件，显示文件内容
            this.viewFileContent(selectedFile);
        }
    },
    
    // 显示文件内容
    viewFileContent: function(file) {
        // 更新UI元素
        document.getElementById('file-name').textContent = file.title;
        document.getElementById('file-type').textContent = file.type;
        document.getElementById('file-content').textContent = file.content || "NO CONTENT AVAILABLE";
        
        // 切换到详情视图
        this.currentView = 'detail';
        this.ensureViewState();
        
        // 确保保持活动状态和应用焦点模式
        this.isActive = true;
        NavigationController.setFocusMode('app');
        
        // 更新信息栏
        UserInterfaceView.updateInfoBar("FILE CONTENT: BACKSPACE or LEFT ARROW to RETURN");
    },
    
    // 返回列表视图
    showListView: function() {
        this.currentView = 'list';
        document.getElementById('file-detail-view').style.display = 'none';
        document.getElementById('file-list-view').style.display = 'block';
        
        // 更新信息栏
        UserInterfaceView.updateInfoBar("FILE BROWSER: USE ARROWS to NAVIGATE, ENTER to OPEN, BACKSPACE for PARENT DIR");
    },
    
    // 更新选中项的高亮
    updateSelection: function() {
        const rows = document.querySelectorAll('.file-item');
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
    
    // 选择上一个文件
    selectPrevFile: function() {
        if (this.displayedFiles.length === 0) return;
        
        this.selectedIndex = Math.max(0, this.selectedIndex - 1);
        this.updateSelection();
    },
    
    // 选择下一个文件
    selectNextFile: function() {
        if (this.displayedFiles.length === 0) return;
        
        this.selectedIndex = Math.min(this.displayedFiles.length - 1, this.selectedIndex + 1);
        this.updateSelection();
    }
};

// NavigationController - 管理焦点和导航
const NavigationController = {
    currentFocus: 'terminal',
    menuItems: [],
    menuIndex: 0,
    focusMode: 'system', // 'system'(系统菜单/终端) 或 'app'(应用内部)
    
    init: function() {
        this.menuItems = Array.from(document.querySelectorAll('.menu-item'));
        this.updateHighlight();
        this.initEventListeners();
    },
    
    initEventListeners: function() {
        document.addEventListener('keydown', this.handleKeyNavigation.bind(this));
        
        // 终端点击事件
        document.getElementById('terminal').addEventListener('click', (e) => {
            e.stopPropagation(); 
            this.switchFocus('terminal');
            this.setFocusMode('system');
        });
        
        // 菜单面板点击事件
        document.querySelector('.menu-panel').addEventListener('click', (e) => {
            e.stopPropagation();
            // 只在点击到菜单面板空白处时切换焦点
            if (e.target.classList.contains('menu-panel') || 
                e.target.classList.contains('menu-title')) {
                this.switchFocus('menu');
                this.setFocusMode('system');
            }
        });
        
        // 为每个菜单项添加点击事件
        this.menuItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                // 更新选中的菜单索引
                this.menuIndex = index;
                this.updateHighlight();
                
                // 如果点击的是应用程序项，设置为应用模式
                const appId = item.getAttribute('data-app');
                if (appId && appId !== 'terminal') {
                    // 延迟设置应用模式，确保在应用启动后执行
                    setTimeout(() => {
                        this.setFocusMode('app');
                    }, 50);
                }
            });
        });
    },
    
    // 设置焦点模式
    setFocusMode: function(mode) {
        if (this.focusMode === mode) return; // 避免重复设置
        
        this.focusMode = mode;
        
        // 处理UI反馈
        if (mode === 'app') {
            // 隐藏系统菜单的选中效果
            this.menuItems.forEach(item => item.classList.remove('selected'));
            UserInterfaceView.updateInfoBar("APP MODE: USE ESC TO RETURN");
            
            // 发布应用激活事件
            EventBus.publish('app:activated', SystemModel.currentScreen);
        } else {
            // 恢复系统菜单的选中效果
            this.updateHighlight();
            if (this.currentFocus === 'menu') {
                const selectedText = this.getSelectedItemText();
                UserInterfaceView.updateInfoBar(`SELECT: ${selectedText}`);
            } else {
                UserInterfaceView.updateInfoBar("MODE: COMMAND INPUT");
            }
        }
        
        EventBus.publish('navigation:modeChanged', mode);
    },

    // 切换焦点区域
    switchFocus: function(target) {
        this.currentFocus = target;
        
        if (target === 'terminal') {
            document.querySelector('.cursor').style.display = 'inline-block';
            document.getElementById('user-input').focus();
            UserInterfaceView.updateInfoBar("MODE: COMMAND INPUT");
        } else {
            document.querySelector('.cursor').style.display = 'none';
            document.getElementById('user-input').blur();
            this.ensureSelection();
            const selectedText = this.getSelectedItemText();
            UserInterfaceView.updateInfoBar(`SELECT: ${selectedText}`);
        }
        
        EventBus.publish('navigation:focusChanged', target);
    },
    
    // 处理键盘导航
    handleKeyNavigation: function(e) {
            // 如果在应用模式下，不要处理菜单导航键
            if (this.focusMode === 'app') {
                // 只处理ESC键
                if (e.key === 'Escape') {
                    // 检查是否是文件浏览器的详情视图
                    if (SystemModel.currentScreen === 'fileExplorer' && 
                        FileView && FileView.currentView === 'detail') {
                        // 让FileView处理这个事件
                        return; // 不执行后续代码
                    }
                    
                    // 检查是否是文件浏览器的非根目录
                    if (SystemModel.currentScreen === 'fileExplorer' && 
                        FileView && FileView.currentPath !== "") {
                        // 让FileView处理这个事件
                        return; // 不执行后续代码
                    }
                    
                    // 从应用模式退出到系统菜单 (其他情况)
                    this.setFocusMode('system');
                    this.switchFocus('menu');
                    
                    // 触发应用退出事件
                    EventBus.publish('app:requestExit');
                    e.preventDefault();
                }
                return; // 在应用模式下不处理其他键
        }
        
        // 系统模式下的ESC键处理
        if (e.key === 'Escape' && this.currentFocus === 'menu') {
            // 从系统菜单退出到终端
            this.switchFocus('terminal');
            e.preventDefault();
            return;
        }
        
        // 方向键导航 - 只在系统模式下处理
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            if (e.key === 'ArrowUp') {
                this.navigateUp();
            } else {
                this.navigateDown();
            }
            
            // 如果在终端模式，自动切换到菜单模式
            if (this.currentFocus === 'terminal') {
                this.switchFocus('menu');
            }
            
            e.preventDefault();
            return;
        }
        
        // Enter键行为区分
        if (e.key === 'Enter') {
            if (this.currentFocus === 'terminal') {
                // 让TerminalController处理
                EventBus.publish('terminal:commandEntered');
            } else {
                // 菜单模式：选择菜单项
                this.activateSelection();
            }
            e.preventDefault();
            return;
        }
        
        // Tab键切换焦点区域
        if (e.key === 'Tab') {
            if (this.currentFocus === 'terminal') {
                this.switchFocus('menu');
            } else {
                this.switchFocus('terminal');
            }
            e.preventDefault();
            return;
        }
        
        // 如果按下其他键且当前不在终端模式，自动切换到终端模式
        if (this.currentFocus !== 'terminal' && 
            e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
            this.switchFocus('terminal');
        }
    },
    
    navigateUp: function() {
        this.menuIndex = (this.menuIndex - 1 + this.menuItems.length) % this.menuItems.length;
        this.updateHighlight();
    },
    
    navigateDown: function() {
        this.menuIndex = (this.menuIndex + 1) % this.menuItems.length;
        this.updateHighlight();
    },
    
    activateSelection: function() {
        if (this.menuItems.length > 0) {
            const selectedItem = this.menuItems[this.menuIndex];
            const appId = selectedItem.getAttribute('data-app');
            
            // 如果选中的是应用程序，预设为应用模式
            if (appId && appId !== 'terminal') {
                // 记录要激活的应用ID，便于后续处理
                this.pendingAppActivation = appId;
                // 实际模式转换将在应用启动后进行
            }
            
            // 触发点击
            selectedItem.click();
        }
    },
    
    ensureSelection: function() {
        if (this.menuItems.length > 0 && this.menuIndex < 0) {
            this.menuIndex = 0;
        }
        this.updateHighlight();
    },
    
    getSelectedItemText: function() {
        if (this.menuItems.length > 0 && this.menuIndex >= 0 && this.menuIndex < this.menuItems.length) {
            return this.menuItems[this.menuIndex].textContent;
        }
        return "NONE";
    },
    
    updateHighlight: function() {
        // 移除所有高亮
        this.menuItems.forEach(item => item.classList.remove('selected'));
        
        // 设置新的高亮
        if (this.menuItems.length > 0) {
            this.menuItems[this.menuIndex].classList.add('selected');
            
            // 更新底部信息栏
            const selectedText = this.getSelectedItemText();
            UserInterfaceView.updateInfoBar(`SELECT: ${selectedText}`);
        }
    }
};

// TerminalController - 管理终端输入和命令
const TerminalController = {
    init: function() {
        this.initEventListeners();
    },
    
    initEventListeners: function() {
        const input = document.getElementById('user-input');
        if (!input) return;
        
        input.addEventListener('keydown', this.handleTerminalInput.bind(this));
        
        // 订阅命令回车事件
        EventBus.subscribe('terminal:commandEntered', () => {
            this.processCommand();
        });
    },
    
    handleTerminalInput: function(e) {
        // 处理上下箭头导航命令历史
        if (e.key === 'ArrowUp') {
            const prevCommand = TerminalModel.getPreviousCommand();
            if (prevCommand !== null) {
                TerminalView.input.value = prevCommand;
                TerminalView.updateCommandText();
            }
            e.preventDefault();
        }
        else if (e.key === 'ArrowDown') {
            const nextCommand = TerminalModel.getNextCommand();
            TerminalView.input.value = nextCommand;
            TerminalView.updateCommandText();
            e.preventDefault();
        }
    },
    
    processCommand: function() {
        const command = TerminalView.getInput();
        if (!command) return;
        
        // 添加命令到输出历史
        TerminalView.appendOutput("> " + command);
        
        // 清空输入
        TerminalView.clearInput();
        
        // 处理命令并显示响应
        const response = TerminalModel.processCommand(command);
        TerminalView.appendOutput(response);
        
        // 滚动到底部
        TerminalView.scrollToBottom();
    }
};

// ApplicationController - 管理应用程序
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

// MailController - 管理邮件程序
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

// FileController - 管理文件程序
const FileController = {
    init: function() {
        // 初始化文件视图
        FileView.init();
        
        // 订阅相关事件
        this.setupEventListeners();
    },
    
    setupEventListeners: function() {
        // 监听文件程序启动事件
        EventBus.subscribe('app:launch', (appId) => {
            if (appId === 'fileExplorer') {
                this.openFileExplorer();
            }
        });
    },
    
    openFileExplorer: function() {
        // 确保用户已登录
        if (!UserModel.isAuthenticated()) {
            TerminalView.appendOutput("ERROR: AUTHENTICATION REQUIRED");
            ApplicationController.showTerminal();
            return;
        }
        
        // 检查文件系统数据
        console.log("打开文件浏览器, 检查文件数据:", SaveManager.gameData.files);
        if (!SaveManager.gameData.files || !SaveManager.gameData.files.list || SaveManager.gameData.files.list.length === 0) {
            console.log("文件数据为空，尝试初始化");
            SaveManager.FileDataModule.initDefaultFiles();
        }

        // 重置文件视图状态
        FileView.selectedIndex = 0;
        FileView.currentView = 'list';
        FileView.isActive = true;
        FileView.currentPath = "";
        
        // 显示文件列表视图，隐藏详情视图
        document.getElementById('file-list-view').style.display = 'block';
        document.getElementById('file-detail-view').style.display = 'none';
        
        // 加载根目录
        FileView.loadDirectory("");
        
        // 显示文件浏览器应用
        ApplicationView.showApp('fileExplorer');
        SystemModel.changeScreen('fileExplorer');
        
        // 设置为应用焦点模式
        NavigationController.setFocusMode('app');
        
        // 确保选中状态更新
        setTimeout(() => {
            FileView.updateSelection();
        }, 100);
    }
};

// EffectsManager - 管理视觉和音效
const EffectsManager = {
    init: function() {
        // 初始化音效和视觉效果
    },
    
    playBootSequence: function() {
        UserInterfaceView.bootSequence();
    }
};

// App - 应用入口
const App = {
    init: function() {
        // 初始化各个模块
        UserModel.init();
        SystemModel.init();
        MissionModel.init();
        TerminalModel.init();
        SaveManager.init();
        
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

// SaveManager - 高级游戏存档管理系统
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
});

