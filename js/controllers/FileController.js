// js/controllers/FileController.js - 管理文件程序
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