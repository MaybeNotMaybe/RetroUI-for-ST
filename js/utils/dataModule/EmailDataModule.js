// js/utils/modules/EmailDataModule.js - 邮件数据模块
const EmailDataModule = {
    // 初始化模块
    init: function() {
        // 检查并初始化默认邮件
        if (SaveManager.gameData.emails.length === 0) {
            this.initDefaultEmails();
        }
    },
    
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
};

// 导出模块
// 注意：在浏览器环境中，这会被添加到全局作用域