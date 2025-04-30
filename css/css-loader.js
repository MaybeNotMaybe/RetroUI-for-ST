// css/css-loader.js
document.addEventListener('DOMContentLoaded', function() {
    const cssFiles = [
        'base.css',
        'crt-effects.css',
        'layout.css',
        'menu.css',
        'terminal.css',
        'app-window.css',
        'mail-app.css',
        'file-app.css',
        'animations.css'
    ];
    
    cssFiles.forEach(file => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `./css/${file}`;
        document.head.appendChild(link);
    });
});