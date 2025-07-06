const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const firebase = require('./firebase');

function createWindow() {
  const win = new BrowserWindow({
    show: false,
    icon: path.join(__dirname, 'public', process.platform === 'win32' ? 'icon.ico' : 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  
  win.maximize();
  win.show();

  if (app.isPackaged) {
    Menu.setApplicationMenu(null);
  }

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handler
ipcMain.handle('firebase-signup', async (event, { username, password }) => {
  try {
    const data = await firebase.signupUser(username, password);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('firebase-signin', async (event, { username, password }) => {
  try {
    const data = await firebase.signinUser(username, password);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
});