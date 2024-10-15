const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('node:path');
const { fork } = require('child_process');

let tray;
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        },
        icon: path.join(__dirname, 'iconjpg.png')
    });

    mainWindow.loadFile('index.html');

    tray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    });

    mainWindow.on('minimize', () => {
        mainWindow.hide();
    });
}

function createTray() {
    tray = new Tray(path.join(__dirname, 'iconjpg.png'));

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Restore', click: () => { mainWindow.show(); }},
        { label: 'Quit', click: () => { app.quit(); }}
    ]);
    
    tray.setToolTip('My Application');
    tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
    fork(path.join(__dirname, 'server.js'));
    createTray();
    createWindow();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
