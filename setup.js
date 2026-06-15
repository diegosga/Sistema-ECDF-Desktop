
let selectedPath = null;
let opt = "Não"; 
const caminho_config = window.electronAPI.pegarCaminho();
async function initCheck() {
  try {
    
  
        if(!window.electronAPI.existe(caminho_config)){
            document.getElementById('status-screen').classList.add('hidden');
            document.getElementById('upload-screen').classList.remove('hidden');
            document.getElementById('prosseguir').classList.remove('hidden');
        }
          const response = await fetch(caminho_config);
          if(response.ok){
            const dados = await response.json();
            if(window.electronAPI.existe(dados.url)){ 
              window.electronAPI.send('bypass-setup-and-open-react');
              return;
            }
        }
        } catch (error) {
            console.error("Erro no carregamento:", error);
            alert("Arquivo corrompido ou inexistente. Por favor, configure novamente.");
            document.getElementById('status-screen').classList.add('hidden');
            document.getElementById('upload-screen').classList.remove('hidden');
            document.getElementById('prosseguir').classList.remove('hidden');
        }
    }

    document.querySelectorAll('input[name="opt"]').forEach(radio => {
      radio.addEventListener('change', () => {
        const p = document.getElementById("parag");
        const file = document.getElementById("file-path");
        opt = document.querySelector('input[name="opt"]:checked').value; 

        if (opt === "Sim") {
          p.innerText = "Qual planilha Excel deve ser usada?";
          file.innerText = "Nenhum arquivo selecionado.";
        } else {
          p.innerText = "Em qual caminho a planilha deve ser criada?";
          file.innerText = "Nenhum caminho selecionado";
        }
      });
    });
       
      document.getElementById('select-btn').addEventListener('click', async () => {
      selectedPath = await window.electronAPI.invoke('open-file-dialog');
      if (selectedPath) {
        document.getElementById('file-path').innerText = selectedPath;
      }
    });
    
    document.getElementById('prosseguir').addEventListener('click', () => {
      if (!selectedPath && opt ==="Sim") {
        alert('Por favor, selecione um arquivo.');
        return;
      }
      if(!selectedPath && opt ==="Não"){
        alert("Selecione onde o arquivo Excel deve ser criado!");
        return;
      }
      
      window.electronAPI.send('process-initial-file',opt, selectedPath);
    });
    
initCheck();