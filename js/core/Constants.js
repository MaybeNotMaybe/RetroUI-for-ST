// js/core/Constants.js - 应用常量
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