// js/core/EventBus.js
(function(window) {
    'use strict';
    
    // 模块定义
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
    
    // 暴露模块到全局命名空间
    window.EventBus = EventBus;
    
    console.log('EventBus模块已加载');
    
})(window);