const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require("path");
contextBridge.exposeInMainWorld('electronAPI', {
  existe: (caminho)=>fs.existsSync(caminho),
  
  send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  
  pegarCaminho: () =>path.join(process.env.USER_DATA_PATH, "config.json") ,

  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
}
);
//o context bridge vai fazer uma ponte entre o html e o electron já que funções desse nao funcionam naquele

