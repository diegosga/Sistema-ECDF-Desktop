/*

Como eu faço funcionar a tela de cadastros de atendidos?

Eu posso mostrar um select pra selecionar uma das ATIVIDADES ofertadas
e um input pra digitar a QUANTIDADE DE ATENDIDOS

Um botão que ao clicar em submeter soma o que foi digitado ao valor presente no banco de dados
pra facilitar a edição do banco de dados a gente pega o valor de atendidos e armazena em uma prop
Mas aí é que tá, são 6 atividades

O que eu pensei, criar dois esquemas no prisma, uma com 

Atividade, data e quantidade de atendidos
e outra tabela que mostre o total de atendidos por atividades e aí cada atividade é procurada 
pelo nome e dá origem a uma outra tabela com Todos os valores somados até agora


Podemos até automatizar uma função que limpe essa tabela no final do semestre


Se passar de Junho -> limpa a tabela.
Se passar de dezembro limpa a tabela.

Para não serem perdidos dados importantes, seria interessante disponibilizar a opção
 de salvar a planilha das duas tabelas.

Colocar uma tela sobreposta que mostra um input pra colocar a data que o semestre termina, 
então com essa data o sistema vai programar uma data para apagar os dados do banco de dados.


O que eu pensei, essa tela sobreposta vai enviar a data de fim do semestre para o backend

O react vai verificar se a variável está vazia, se sim, mostra essa tela, se não, mostra a outra tela.




*/


 import { useEffect, useState } from "react";

function Atendimentos(){
    
    const [ativ, setAtiv] = useState("ATIVIDADES DE ARTE EDUCAÇÃO");
    const [qtd, setQTD] = useState(0);
    const [dataFim, setDataFim] = useState('');
    const [arr,setArr]= useState({});
    const [edit, setEdit] = useState(false);
    const [editFim, setEditFim] = useState(false);
    const [id_edit_fim,setIdEditFim] = useState(null);
    const [id_edit,setIdEdit] = useState(null);
    const [tabela,setTabela] = useState(false);

    const API_BASE = "http://localhost:3000";


    const adicionarFim = async (novoDado) =>{
        try {
                const response = await fetch(`${API_BASE}/fim-sem`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(novoDado),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Erro ao registrar o fim do semestre');
                }
                await getData();
            } catch (error) {
                
                console.error("Erro ao registrar o fim do semestre:", error);
                alert(`Erro ao registrar o fim do semestre: ${error.message}`);
                
            }
        }   
        const atualizarFim = async (id, novosDados)=>{
        try {
            const response = await fetch(`${API_BASE}/fim-sem/${id}`, {
                method :'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novosDados)
            });
             if (!response.ok) {
                const errorData = (response).statusText;
                throw new Error(errorData || 'Erro ao editar o fim do semestre.');
            }
            else{
                setEditFim(false);
                await getData();
            }

        } catch (error) {
            console.error('Erro ao editar atendimento:', error);
            alert(`Erro ao editar atendimento: ${error.message}`);

        }

     }
    const getData = async() =>{
        try {
            const response = await fetch(`${API_BASE}/fim-sem`);
            if (!response.ok) {
                throw new Error("Não foi possível pegar a data");
            }
            const data = await response.json();
                setArr(data);
                if(arr.length===0|| dataFim=="")setDataFim(data[0].fim_semestre);

        } catch (error) {
            alert(`Erro ao carregar data: ${error.message}`);
        }
    };
    const removerData = async (id) => {
        if (!window.confirm('Tem certeza que deseja remover este aluno?')) {
            return;
        }
        try {
            const response = await fetch(`${API_BASE}/fim-sem/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao remover aluno.');
            }

            alert('Aluno removido com sucesso!');
            getAlunos();
        } catch (error) {
            console.error('Erro ao remover aluno:', error);
            alert(`Erro ao remover aluno: ${error.message}`);
        }
    };



    const handleFim = async (e) =>{
        try {
        const dadosFim ={
            fim_semestre:dataFim,
        };
        console.log(dataFim);
        
            if(editFim && id_edit_fim){
                
                await atualizarFim(id_edit_fim,dadosFim);
            }else{
                await adicionarFim(dadosFim);
            }
        } catch (error) {
             alert("Erro ao submeter o fim do semestre: ", error.message);
                
        }
    };
    const editarData = ()=>{
        setEditFim(true);
        setIdEditFim(arr[0].id);
        setDataFim(arr[0].fim_semestre);
        console.log(dataFim);
    }
    
    useEffect(()=>{
        getData();
    
    },[arr]);
    
    

    const limparForm = () => {

        setAtiv("ATIVIDADES DE ARTE EDUCAÇÃO");
        setQTD(0);
    };

    const adicionarAtend = async (novoDado) =>{
    try {
            const response = await fetch(`${API_BASE}/atendimentos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(novoDado),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao registrar atendimento');
            }
            limparForm();
            await getAtend();
        } catch (error) {
            
            console.error("Erro ao registrar atendimento:", error);
            alert(`Erro ao registrar atendimento: ${error.message}`);
            
        }
    }
    const atualizarAtend = async (id, novosDados)=>{

        try {
            const response = await fetch(`${API_BASE}/atendimentos/${id}`, {
                method :'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novosDados)
            });
             if (!response.ok) {
                const errorData = (response).statusText;
                throw new Error(errorData || 'Erro ao editar atendimento.');
            }
            
            limparForm();
            setEdit(false);
            setIdEdit(null);
            await getAtend();


        } catch (error) {
            console.error('Erro ao editar atendimento:', error);
            alert(`Erro ao editar atendimento: ${error.message}`);

        }

     }
    

    const handleSubmit = async (e) =>{
        const dadosAtend ={
            atividade: ativ,
            qtd_atendimentos:qtd
        }
        try {
            if(id_edit&& edit){
                await atualizarAtend(id_edit, dadosAtend);
            }else{
                await adicionarAtend(dadosAtend);
            }
        } catch (error) {
             alert("Erro ao submeter atendimento: ", error.message);
                
        }
    };

  return (
    <div>
        {!arr.length||editFim?(
           <div>
            <label htmlFor="dataFim">Digite a data do fim do semestre</label>
            <input id="dataFim" type="date" value={dataFim} onChange={(e)=>setDataFim(e.target.value)}></input>
            <button onClick={handleFim}>{editFim?"Salvar Edição":"Enviar"}</button>
        </div>
         ):(
             <div>
                <label htmlFor="atividade">Selecione a atividade que foi atendida</label>
                <select id = "atividade" onChange={(e)=>setAtiv(e.target.value)}>
                    <option value='ATIVIDADES DE ARTE EDUCAÇÃO'>ATIVIDADES DE ARTE EDUCAÇÃO</option>
                    <option value='OFICINAS TEMATICAS REFLEXIVAS – EQUIPE PSI'>OFICINAS TEMATICAS REFLEXIVAS – EQUIPE PSI</option>
                    <option value='OFICINA DE INCENTIVO A LEITURA'>OFICINA DE INCENTIVO A LEITURA</option>
                    <option value='VIVÊNCIA TECNOLÓGICA'>VIVÊNCIA TECNOLÓGICA</option>
                    <option value='A ESCOLA VEM AO CIRCO'>A ESCOLA VEM AO CIRCO</option>
                    <option value='O CIRCO VAI A ESCOLA'>O CIRCO VAI A ESCOLA</option>
                </select>
                <label htmlFor="qtd">Digite a quantidade de atendimentos</label>
                <input id="qtd" type="number" onChange={(e)=>setQTD(e.target.value)}></input>
                <button onClick={handleSubmit}>{edit?"Salvar Edição":"Enviar"}</button>
                <button onClick={editarData}>Editar fim do semestre</button>
                <button>Ver atendimentos específicos</button>
                <button>Ver todos os atendimentos</button>

            </div>
        
    
     )
    }
    </div>
     )}

export default Atendimentos;