const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('firebaseAPI', {
  signupUser: (username, password) => ipcRenderer.invoke('firebase-signup', { username, password }),
});