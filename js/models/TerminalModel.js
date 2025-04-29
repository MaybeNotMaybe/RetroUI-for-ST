// js/models/TerminalModel.js - 管理终端状态和命令处理
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