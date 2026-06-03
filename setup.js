
let selectedPath = null;
let opt = "Não"; 
const delay = t => new Promise(res=>setTimeout(res, t));
async function initCheck() {
  for(let i=1; i<=5;i++){
    try {
        
        const response = await fetch('http://127.0.0.1:3000/url');
        

        if (response.ok) {
          const data = await response.json();
          console.log(data.length>0);
          if(data.length>0){
            window.electronAPI.send('bypass-setup-and-open-react');
            return;
          }
        }
      
          
      
      }catch (error) {
          console.error(error);
          await delay(1500);
          continue;
      }}
    
       document.getElementById('status-screen').classList.add('hidden');
       document.getElementById('upload-screen').classList.remove('hidden');
       document.getElementById('prosseguir').classList.remove('hidden');
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