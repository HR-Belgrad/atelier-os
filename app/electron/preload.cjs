const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('atelier', {
  chooseRepository: () => ipcRenderer.invoke('atelier:choose-repository')
});
