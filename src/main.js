'use strict';

const electron  = require('electron');
const { app, BrowserWindow, Menu } = electron;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600, minWidth: 600,
    height: 600, minHeight: 600,
    // TODO: use electron-window-state instead
    center: true,
    title: "Blih GUI",
    show: false
  });
  mainWindow.loadURL(`file://${__dirname}/../views/base.html`);
  mainWindow.on('ready-to-show', () => {
      mainWindow.show();
      mainWindow.focus();
  }).on('closed', () => {
      mainWindow = null;
  });
}

/*
 * Event listeners
 */

app.on('ready', () => {
  createWindow();
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: 'Dev Tools',
      click: () => mainWindow.webContents.openDevTools(),
      accelerator: 'Ctrl+Shift+I',
    }
  ]));
})
.on('activate', () => {
  if (mainWindow == null)
    createWindow();
})
.on('window-all-closed', () => {
  if (process.platform !== 'darwin')
    app.quit();
});
