// js/core/StorageManager.js - 管理本地存储
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