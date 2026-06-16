const { app, BrowserWindow,ipcMain, dialog } = require('electron');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const { exec,fork,spawn } = require('child_process');
let mainWindow;
let backendProcess;
const isProd = app.isPackaged;
const caminho_env = path.join(__dirname,'.env');

process.env.USER_DATA_PATH =app.getPath("userData");

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (typeof setupWindow !== 'undefined' && setupWindow && !setupWindow.isDestroyed()) {
      setupWindow.close();
      setupWindow = null;
    }
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
      sandbox: false
    },
  });

  setupWindow.loadFile(path.join(__dirname, 'setup.html'));
}
  

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
                silent: true,
                env: { 
                ...process.env,
                ...envConfig,   
                NODE_ENV: 'production'
            }
                });
            } else {
      
                backendProcess =spawn('npm',['run','start:dev'], { 
                  cwd: path.join(__dirname, 'cecom-back-end'), 
                  shell:true
                });
            }

            if (backendProcess.stdout) {
                backendProcess.stdout.on('data', (data) => {
                  console.log(`[NestJS]: ${data}`);
                  const carregou = data.toString().includes("NestApplication");
                  if(carregou) createSetupWindow();
              });
            }
  }



  

process.on('uncaughtException', function (err) {
  console.log(err);
})

  ipcMain.on('bypass-setup-and-open-react', (event) => {
  console.log('[Electron] Banco de dados validado com sucesso. Abrindo interface principal.');
  
  createWindow();

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

  if(opt ==="Sim"){
                const wb = xlsx.readFile(filePath);
                const alunos = wb.SheetNames[0];
                const ativ = wb.SheetNames[1];
                const ws_alunos = wb.Sheets[alunos];
                const ws_ativ = wb.Sheets[ativ];
                const dados_alunos = xlsx.utils.sheet_to_json(ws_alunos);
                const dados_ativ = xlsx.utils.sheet_to_json(ws_ativ);

                const dadosF_aluno =  dados_alunos.map(item=>{
                    return{
                        nome: item["NOME DO EDUCANDO/A"],
                        turno: item["TURNO NA ECDF"],
                        idade: item["IDADE DO EDUCANDO/A"],
                        data_nasc: item["DATA DE NASCIMENTO DO EDUCANDO/A"], 
                        responsavel: item["RESPONSÁVEL PELO EDUCANDO/A"], 
                        contato: item["CONTATO DO RESPONSÁVEL"],
                        unidade: item["UNIDADE ESCOLAR (ONDE O EDUCANDO ESTUDA)"],
                        endereco_moradia: item["ENDEREÇO DE MORADIA"],
                        nis_crianca: item["Nº NIS CRIANÇA"],
                        nis_mae: item["Nº NIS MÃE"],
                        atipicidade: item["ATIPICIDADE (TEM NECESSIDADES ESPECIAIS)"]
                    }
                    
                })
                const dadosF_atividades = dados_ativ.map(item => {
                        return {
                            atividade: item["ATIVIDADES"],
                            dia: item["DIA DA ATIVIDADE"],
                            horario: item["HORARIO"],
                            hora_lanche: item["HORARIO DO LANCHE"],
                            grupo: item["GRUPO"],
                            alunos: item["ALUNOS"],
                            sera_dividido: item["DIVIDIDO"],
                            tempo_acolhida: item["ACOLHER AO PORTÃO"],
                            resp_acolhida: item["RESPONSÁVEL PELO ACOLHIMENTO"],
                            tempo_lanche: item["ACOMPANHAR LANCHE"],
                            resp_lanche: item["RESPONSAVEL PELO ACOMPANHAMENTO"],
                            tempo_saida: item["ACOMPANHAR A SAÍDA"],
                            resp_saida: item["RESPONSAVEL PELO ACOMPANHAMENTO"]
                        }
                    });
                            await Promise.all(dadosF_aluno.map(async (aluno) => {
                      await fetch(`http://localhost:3000/aluno`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(aluno),
                      });
                    }));

                    await Promise.all(dadosF_atividades.map(async (ativ) => {
                      await fetch(`http://localhost:3000/atividade`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(ativ),
                      });
                    }));
                                          }
                
                else{
                    const dadosAlunos = [[
                                    "NOME DO EDUCANDO/A",
                                    "TURNO NA ECDF",
                                    "IDADE DO EDUCANDO/A",
                                    "DATA DE NASCIMENTO DO EDUCANDO/A",
                                    "RESPONSÁVEL PELO EDUCANDO/A",
                                    "CONTATO DO RESPONSÁVEL",
                                    "UNIDADE ESCOLAR (ONDE O EDUCANDO ESTUDA)",
                                    "ENDEREÇO DE MORADIA",
                                    "Nº NIS CRIANÇA",
                                    "Nº NIS MÃE",
                                    "ATIPICIDADE (TEM NECESSIDADES ESPECIAIS)"
                                    ]];
                    const dadosAtividades =[[
                                                "ATIVIDADES",
                                                "DIA DA ATIVIDADE",
                                                "HORARIO",
                                                "HORARIO DO LANCHE",
                                                "GRUPO",
                                                "ALUNOS",
                                                "DIVIDIDO",
                                                "ACOLHER AO PORTÃO",
                                                "RESPONSÁVEL PELO ACOLHIMENTO",
                                                "ACOMPANHAR LANCHE",
                                                "RESPONSAVEL PELO ACOMPANHAMENTO",
                                                "ACOMPANHAR A SAÍDA",
                                                "RESPONSAVEL PELO ACOMPANHAMENTO"
                                                ]];          
                    const ws_alunos = xlsx.utils.aoa_to_sheet(dadosAlunos);
                    const ws_ativ_mat = xlsx.utils.aoa_to_sheet(dadosAtividades);
                    const ws_ativ_vesp = xlsx.utils.aoa_to_sheet(dadosAtividades);
                    const wb = xlsx.utils.book_new();
                    xlsx.utils.book_append_sheet(wb,ws_alunos,"Alunos");
                    xlsx.utils.book_append_sheet(wb,ws_ativ_mat,"Atividades - Matutino");
                    xlsx.utils.book_append_sheet(wb,ws_ativ_vesp,"Atividades - Vespertino");
                    const caminho_esp = path.join(filePath, "planilha_cecom.xlsx");
                    xlsx.writeFile(wb, caminho_esp);
                    filePath= caminho_esp;
                }
                app.addRecentDocument(filePath);
                const cwd_config = path.join(process.env.USER_DATA_PATH, "config.json");
                const conteudo = JSON.stringify({url: filePath, vai_ser_usado: opt});
                fs.writeFile(cwd_config, conteudo, (err)=>{
                   if(err)throw new Error(err.message || 'Erro enviar o arquivo');
                  createWindow();
                  setupWindow.close();
                });
});
   


app.whenReady().then(() => {
  startBackend();

});

app.on('window-all-closed', () => {
  backendProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  backendProcess.kill();
});