// js/models/UserModel.js - 管理用户数据和认证
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