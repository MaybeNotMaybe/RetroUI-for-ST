// js/models/SystemModel.js - 管理系统状态
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