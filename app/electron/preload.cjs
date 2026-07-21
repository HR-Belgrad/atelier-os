const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('atelier', {
  openRepository: () => ipcRenderer.invoke('repository:open'),
});
