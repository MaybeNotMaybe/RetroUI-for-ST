// js/views/TerminalView.js - 管理终端显示
const TerminalView = {
    terminal: null,
    output: null,
    input: null,
    commandText: null,
    
    init: function() {
        this.terminal = document.getElementById('terminal');
        this.output = document.getElementById('output');
        this.input = document.getElementById('user-input');
        this.commandText = document.getElementById('command-text');
        
        if (this.input && this.commandText) {
            this.input.addEventListener('input', () => {
                this.updateCommandText();
            });
            
            this.input.addEventListener('keydown', (e) => {
                if (e.key === ' ') {
                    setTimeout(() => this.updateCursorPosition(), 10);
                }
            });
        }
        
        if (this.terminal && this.input) {
            this.terminal.addEventListener('click', () => {
                this.input.focus();
            });
        }
        
        this.initFocusIndicator();
        this.initCustomCursor();
        
        // 清屏并显示头部内容
        this.clearScreen();
    },
    
    clearScreen: function() {
        this.output.innerHTML = Constants.getTerminalHeader();
    },
    
    appendOutput: function(text) {
        if (text === "CLEAR_SCREEN") {
            this.clearScreen();
            return;
        }
        
        if (text.startsWith("LAUNCH_APP:")) {
            const appName = text.split(":")[1];
            EventBus.publish('app:launch', appName);
            return;
        }
        
        this.output.innerHTML += text + "\n";
        this.scrollToBottom();
    },
    
    updateCommandText: function() {
        if (this.commandText) {
            this.commandText.textContent = this.input.value;
            this.updateCursorPosition();
        }
    },
    
    scrollToBottom: function() {
        this.terminal.scrollTop = this.terminal.scrollHeight;
    },
    
    updateCursorPosition: function() {
        const input = this.input;
        const cursor = document.querySelector('.cursor');
        const promptElement = document.querySelector('.prompt');
        
        if (!input || !cursor || !promptElement) return;
        
        try {
            const textMeasure = document.createElement('span');
            textMeasure.style.font = window.getComputedStyle(input).font;
            textMeasure.style.position = 'absolute';
            textMeasure.style.visibility = 'hidden';
            textMeasure.style.whiteSpace = 'pre';
            textMeasure.textContent = input.value.substring(0, input.selectionStart);
            document.body.appendChild(textMeasure);
            
            const textWidth = textMeasure.getBoundingClientRect().width;
            const promptWidth = promptElement.getBoundingClientRect().width;
            
            cursor.style.left = (promptWidth + textWidth) + 'px';
            
            document.body.removeChild(textMeasure);
        } catch (error) {
            console.log("光标位置更新出错:", error);
        }
    },
    
    initCustomCursor: function() {
        const input = this.input;
        const cursor = document.querySelector('.cursor');
        
        if (!input || !cursor) return;
        
        input.addEventListener('input', () => this.updateCursorPosition());
        input.addEventListener('click', () => this.updateCursorPosition());
        input.addEventListener('keydown', () => {
            setTimeout(() => this.updateCursorPosition(), 0);
        });
        window.addEventListener('resize', () => this.updateCursorPosition());
        
        setTimeout(() => this.updateCursorPosition(), 10);
        
        input.focus();
    },
    
    initFocusIndicator: function() {
        const terminal = this.terminal;
        const input = this.input;
        
        if (terminal && input) {
            terminal.classList.add('input-focus');
            
            input.addEventListener('focus', () => {
                terminal.classList.add('input-focus');
            });
            
            input.addEventListener('blur', () => {
                terminal.classList.remove('input-focus');
            });
        }
    },
    
    getInput: function() {
        return this.input.value.trim();
    },
    
    clearInput: function() {
        this.input.value = '';
        if (this.commandText) {
            this.commandText.textContent = '';
        }
        this.updateCursorPosition();
    }
};