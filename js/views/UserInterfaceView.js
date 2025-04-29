// js/views/UserInterfaceView.js - 管理用户界面通用元素
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