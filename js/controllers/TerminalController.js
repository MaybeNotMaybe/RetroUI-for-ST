// js/controllers/TerminalController.js - 管理终端输入和命令
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