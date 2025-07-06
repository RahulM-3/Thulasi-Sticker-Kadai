const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('firebaseAPI', {
  signinUser: (username, password) => ipcRenderer.invoke('firebase-signin', { username, password }),
  signupUser: (username, password) => ipcRenderer.invoke('firebase-signup', { username, password }),
});

contextBridge.exposeInMainWorld('electronAPI', {
  saveUserCreds: (username, password) => ipcRenderer.invoke('save-username', { username, password }),
  getUserCreds: () => ipcRenderer.invoke('get-username', {}),
});