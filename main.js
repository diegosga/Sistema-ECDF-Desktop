const { app, BrowserWindow,ipcMain, dialog } = require('electron');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { exec,fork } = require('child_process');
let mainWindow;
let backendProcess;
const isProd = app.isPackaged;
const caminho_env = path.join(__dirname,'.env');
app.commandLine.appendSwitch('ignore-certificate-errors');
function startBackend() {
   
        
            let envConfig = {};
            if (fs.existsSync(caminho_env)) {
            console.log(`[.env Encontrado]: Carregando variáveis de ${caminho_env}`);
            envConfig = dotenv.parse(fs.readFileSync(caminho_env));
        } else {
    console.error(`[.env NÃO ENCONTRADO]: Caminho tentado: ${caminho_env}`);
}
            if (isProd) {
                const backendPath = path.join(process.resourcesPath, 'cecom-back-end', 'dist','src', 'main.js');
                                backendProcess = fork(backendPath, [], {
                env: { 
                ...process.env,
                ...envConfig,   
                NODE_ENV: 'production'
            }
                });
            } else {
      
                backendProcess =exec('npm run start:dev', { cwd: path.join(__dirname, 'cecom-back-end') });
            }

            if (backendProcess.stdout) {
                backendProcess.stdout.on('data', (data) => console.log(`[NestJS]: ${data}`));
            }
  }


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  
  if (isProd) {
    const frontendPath = path.join(__dirname, 'cecom-sistema/dist/index.html');
    console.log(`[Electron] Carregando frontend em: ${frontendPath}`);
    mainWindow.loadFile(frontendPath);
  } else {
    exec('npm run dev', { cwd: path.join(__dirname, 'cecom-sistema') });
    mainWindow.loadURL('http://localhost:5173');
  }
  mainWindow.webContents.openDevTools();
  mainWindow.on('closed', () => (mainWindow = null));

}

 function createSetupWindow() {
  setupWindow  = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  setupWindow.loadFile(path.join(__dirname, 'setup.html'));
}
  
process.on('uncaughtException', function (err) {
  console.log(err);
})

  ipcMain.on('bypass-setup-and-open-react', (event) => {
  console.log('[Electron] Banco de dados validado com sucesso. Abrindo interface principal.');
  createWindow();
  if (setupWindow) setupWindow.close();
});

ipcMain.handle('open-file-dialog', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', "openDirectory"],
    filters: [{ name: 'Arquivos de Dados', extensions: ['csv', 'xls', 'xlsx'] }] 
  });
  console.log(`[Electron] Arquivo selecionado: ${result.filePaths[0]}`);
  if (!result.canceled && result.filePaths.length > 0) {
    return String(result.filePaths[0]);
  }else return null;
});

ipcMain.on('process-initial-file', async (event,opt, filePath) => {
  console.log(`[Electron] Arquivo de carga inicial recebido: ${filePath}`);

  const response = await fetch(`http://localhost:3000/url`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  url:filePath,
                  vai_ser_usado:opt
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro enviar o arquivo');
            }else{
              createWindow();
            }

  
  if (mainWindow) setupWindow.close();
});
   


app.whenReady().then(() => {
  startBackend();
  createSetupWindow();
});

app.on('window-all-closed', () => {
  if (backendProcess) backendProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  if (backendProcess) backendProcess.kill();
});