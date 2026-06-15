import {useState, useEffect} from "react";
import * as XLSX from "xlsx";
import * as fs from "fs";
import './index.css';
function CadastrarAluno(){

    const [nome, setNome]= useState("");
    const [turno, setTurno]= useState("Matutino");
    const [idade, setIdade]= useState("");
    const [responsavel, setResp]= useState("");
    const [contato, setCtt]= useState("");
    const [unidade, setUnidade]= useState("");
    const [endereco_moradia, setEnd]= useState("");
    const [nis_crianca, setNisC]= useState("");
    const [nis_mae, setNisM]= useState("");
    const [atipicidade, setAtip]= useState("");
    const [data_nasc, setData]= useState("");
    const [aluno, setAluno] = useState([]);
    const [tabela,setTabela] = useState(false);
    const [edit, setEdit] = useState(false);
    const [id_edit,setIdEdit] = useState(null);
    const [excel,setExcel] = useState([]);

    const [termo, setTermo] = useState("");

    const pesq = aluno.filter((obj) => {
    if (termo === "") return true;
    return Object.values(obj).some((valor) =>
        String(valor).toLowerCase().includes(termo.toLowerCase())
    );
});



    const API_BASE = "http://localhost:3000";    
    XLSX.set_fs(fs);

    const getAlunos = async () => {
           const response = await fetch(`${API_BASE}/aluno`);
            if (!response.ok) {
                throw new Error("Erro ao buscar alunos");
            }
            const data = await response.json();
            setAluno(data);
        
    };

    const adicionarAluno = async (novoAluno) =>{
        try {
            const response = await fetch(`${API_BASE}/aluno`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(novoAluno),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao cadastrar alunos');
            }
            limparForm();
            await getAlunos();
        } catch (error) {
            
            console.error("Erro ao cadastrar alunos:", error);
            alert(`Erro ao cadastrar alunos: ${error.message}`);
            
        }
    }
    
     const handleEditarClick = (aluno) => {
        setIdEdit(aluno.id);
        setEdit(true); 
        setNome(aluno.nome);
        setTurno(aluno.turno);
        setIdade(aluno.idade);
        if(aluno.data_nasc.includes("/")){
            const data = new Date(aluno.data_nasc);
            const ano = data.getFullYear();
            const mes = data.getMonth();
            const dia =data.getDate()+1;
            console.log(`${ano}-${mes}-${dia}`);
            setData(`${ano}-${mes}-${dia}`);
            //setData(data);

        }else{
           setData(aluno.data_nasc);
        }
        setResp(aluno.responsavel);
        setCtt(aluno.contato);
        setUnidade(aluno.unidade);
        setEnd(aluno.endereco_moradia);
        setNisC(aluno.nis_crianca);
        setNisM(aluno.nis_mae);
        setAtip(aluno.atipicidade);
    };

    const limparForm = () => {

        setAtip("");
        setCtt("");
        setData("");
        setEnd("");
        setIdade("");
        setNome("");
        setNisC("");
        setNisM("");
        setResp("");
        setTurno("Matutino");
        setUnidade("");
    };
    
    const atualizarAlunos = async(id, novosDados)=>{
        try {
            const response = await fetch(`${API_BASE}/aluno/${id}`, {
                method :'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novosDados)
            });
             if (!response.ok) {
                const errorData = (response).statusText;
                throw new Error(errorData || 'Erro ao editar aluno.');
            }
            
            limparForm();
            setEdit(false);
            setIdEdit(null);
            await getAlunos();


        } catch (error) {
            console.error('Erro ao editar aluno:', error);
            alert(`Erro ao editar aluno: ${error.message}`);

        }
    }
    const removerAluno = async (id) => {
        if (!window.confirm('Tem certeza que deseja remover este aluno?')) {
            return;
        }
        try {
            const response = await fetch(`${API_BASE}/aluno/${id}`, {
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


    



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            
         
            const date = new Date;
            
            const nasc= new Date(data_nasc);
            nasc.setDate(nasc.getDate()+1);
            const mes_hj = date.getMonth();
            const ano_hj = date.getFullYear();

            let idade_comp=ano_hj-nasc.getFullYear();

            let cond_mes =mes_hj - nasc.getMonth();
            
            if(cond_mes<0||(cond_mes===0 && date.getDate() < nasc.getDate())){
                idade_comp--;
            }
            const nisValido = (!nis_crianca || nis_crianca.length === 11) || (!nis_mae || nis_mae.length === 11);
            const contatoValido = contato.length > 8 && contato.length < 18;

            if(!nisValido) throw new Error("Nis Invalido");
            if(!contatoValido) throw new Error("Contato Invalido");
            if(!(parseInt(idade)===idade_comp)|| data_nasc==="") throw new Error(`Data Invalida`);
            
                const dadosAluno = {
                nome,
                turno,
                idade: parseInt(idade),
                data_nasc, 
                responsavel, 
                contato,
                unidade,
                endereco_moradia,
                nis_crianca,
                nis_mae,
                atipicidade
            };
            if (edit && id_edit) {
                await atualizarAlunos(id_edit, dadosAluno);
            } else {
                await adicionarAluno(dadosAluno);
            }    
       
}
    catch (error) {
            alert(`Erro ao submeter ${error.message}`)
        }
    };

    const carregarDados = (e) => {
        
        const leitor = new FileReader();
        console.log(e.target.files[0]);
        leitor.readAsBinaryString(e.target.files[0]);
        
        leitor.onload= (e)=>{
            const data =  e.target.result;
            const wb = XLSX.read(data, {type: "binary"});
            const planilha = wb.Sheets[wb.SheetNames[0]];
            const toJson =  XLSX.utils.sheet_to_json(planilha);

            const dados =  toJson.map(item=>{
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

            dados.map(aluno => 
                 adicionarAluno(aluno)
                );  
 
        }
         
        
        

    }

    

    useEffect(()=>{
        getAlunos();
    },[ termo]);


    
    return(
        <div className='cadastro-aluno'>
        

            <h1>Cadastrar Alunos</h1> 
            <label htmlFor='nome'>NOME DO EDUCANDO/A</label>
            <input id='nome' value={nome} onChange={(e)=>{
                setNome(e.target.value)
                }}required></input>

            <label htmlFor='turno_ecdf'>TURNO NA ECDF</label>
            <select id='turno_ecdf' value={turno} onChange={(e)=>{
                setTurno(e.target.value)
                }}required>
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>

                </select>

            <label htmlFor='idade'>IDADE DO EDUCANDO/A</label>
            <input id='idade' inputMode="numeric" value={idade} onChange={(e)=>{
                setIdade(e.target.value)
                }}required></input>

            <label htmlFor='data_nasc'>DATA DE NASCIMENTO DO EDUCANDO/A</label>
            <input type="date" id='data_nasc' value={data_nasc} onChange={e=>setData(e.target.value)}></input>

            <label htmlFor='responsavel'>RESPONSÁVEL PELO EDUCANDO/A</label>
            <input id='responsavel' value={responsavel} onChange={(e)=>{
                setResp(e.target.value)
                }}required></input>


            <label htmlFor='ctt'>CONTATO DO RESPONSÁVEL</label>
            <input id='ctt' value={contato} onChange={(e)=>{
                setCtt(e.target.value)
                }}required></input>

            <label htmlFor='unidade'>UNIDADE ESCOLAR (ONDE O EDUCANDO ESTUDA)</label>
            <input id='unidade' value={unidade} onChange={(e)=>{
                setUnidade(e.target.value)
                }}required></input>

            <label htmlFor='end_moradia' >Endereço de moradia</label>
            <input id='end_moradia' value={endereco_moradia} onChange={(e)=>{
                setEnd(e.target.value)
                }}required></input>

            <label htmlFor='nis_crianca'>N° NIS Educando</label>
            <input id='nis_crianca' value={nis_crianca} onChange={(e)=>{
                setNisC(e.target.value)
                }}></input>

            <label htmlFor='nis_mae'>N° NIS Mãe</label>
            <input id='nis_mae' value={nis_mae} onChange={(e)=>{
                setNisM(e.target.value)
                }}></input>

            <label htmlFor='atipicidade'>ATIPICIDADE (TEM NECESSIDADES ESPECIAIS)</label>
            <input id='atipicidade'value={atipicidade}onChange={(e)=>{
                setAtip(e.target.value)
                }}></input>

            <button onClick={handleSubmit}>{edit?"Salvar Edição":"Cadastrar Aluno"}</button>
            
            <input type="file" accept=".xlsx,.xls,.csv" onChange={carregarDados}
            placeholder="Carregar arquivo"></input>

            <button type="button" onClick={()=>{
                if(tabela===false){
                    setTabela(true);
                    if(aluno.length===0){
                        (<strong>Alunos não cadastrados</strong>);
                    }
                }else{
                    setTabela(false);
                }
            }}>Abrir Tabela</button>

            {
                tabela &&(
                <div className="table-container">
                    <input type="search" value={termo} onChange={e=>{
                        setTermo(e.target.value);
                    }} placeholder="Pesquisar..."></input>
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>NOME DO EDUCANDO/A</th>
                                <th>TURNO NA ECDF</th>
                                <th>IDADE DO EDUCANDO/A</th>
                                <th>DATA DE NASCIMENTO DO EDUCANDO/A</th>
                                <th>RESPONSÁVEL PELO EDUCANDO/A</th>
                                <th>CONTATO DO RESPONSÁVEL</th>
                                <th>UNIDADE ESCOLAR (ONDE O EDUCANDO ESTUDA)</th>
                                <th>ENDEREÇO DE MORADIA</th>
                                <th>Nº NIS CRIANÇA</th>
                                <th>Nº NIS MÃE</th>
                                <th>ATIPICIDADE (TEM NECESSIDADES ESPECIAIS)</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            {
                            
                            termo===""?aluno.map((aluno) => (
                                <tr key={aluno.id}>
                                    <td>{aluno.nome}</td>
                                    <td>{aluno.turno}</td>
                                    <td>{aluno.idade}</td>
                                    <td>{aluno.data_nasc}</td>
                                    <td>{aluno.responsavel}</td>
                                    <td>{aluno.contato}</td>
                                    <td>{aluno.unidade}</td>
                                    <td>{aluno.endereco_moradia}</td>
                                    <td>{aluno.nis_crianca}</td>
                                    <td>{aluno.nis_mae}</td>
                                    <td>{aluno.atipicidade}</td>
                                    <td>
                                        <button onClick={()=>{handleEditarClick(aluno)}}>
                                            Editar
                                        </button>
                                        <button onClick={()=>removerAluno(aluno.id)}>
                                            Remover
                                        </button>
                                    </td>
                                </tr>
                                )):pesq.map(aluno=>(
                                    <tr key={aluno.id}>
                                    <td>{aluno.nome}</td>
                                    <td>{aluno.turno}</td>
                                    <td>{aluno.idade}</td>
                                    <td>{aluno.data_nasc}</td>
                                    <td>{aluno.responsavel}</td>
                                    <td>{aluno.contato}</td>
                                    <td>{aluno.unidade}</td>
                                    <td>{aluno.endereco_moradia}</td>
                                    <td>{aluno.nis_crianca}</td>
                                    <td>{aluno.nis_mae}</td>
                                    <td>{aluno.atipicidade}</td>
                                    <td>
                                        <button onClick={()=>{handleEditarClick(aluno)}}>
                                            Editar
                                        </button>
                                        <button onClick={()=>removerAluno(aluno.id)}>
                                            Remover
                                        </button>
                                    </td>
                                </tr>
                                ))}
                        </tbody>
                    </table>
                    </div>

                )
                
            }

            
            </div>
            )
            
}
    export default CadastrarAluno;