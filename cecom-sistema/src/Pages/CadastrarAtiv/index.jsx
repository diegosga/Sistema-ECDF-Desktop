import SelectAcomp from "../../Components/SelectAcomp";
import {useState, useEffect} from "react";
import './index.css';
import { generatePath } from "react-router-dom";




function CadastrarAtiv(){
    
    const [atividade, setAtividade] = useState([]);
    
    const [dia, setDia] = useState('Segunda');
    const [horario, setHorario] = useState('');
    const [turno,setTurno] = useState('Matutino');
    
    const [horaLanche, setHoraLanche] = useState('');
    const [grupo, setGrupo] = useState('A - Mat');
    const [seraDividido, setSeraDividido] = useState(false);
    
    const [alunos, setAlunos] = useState([]);    
    const [aluno_g, setAlunoGrupo] = useState([]);


    const [inicioAcolhida, setInicioAcolhida] = useState(" ");
    const [fimAcolhida, setFimAcolhida] = useState(" ");
    const [respAcolhida, setRespAcolhida] = useState('NENHUM');

    // Lanche
    const [inicioLanche, setInicioLanche] = useState(" ");
    const [fimLanche, setFimLanche] = useState(" ");
    const [respLanche, setRespLanche] = useState('NENHUM');

    // Saída
    const [inicioSaida, setInicioSaida] = useState(" ");
    const [fimSaida, setFimSaida] = useState(" ");
    const [respSaida, setRespSaida] = useState('NENHUM');

    const [edit, setEdit] = useState(false);
    const [id_edit,setIdEdit] = useState(null);

    const [ativMatutino,setAtivMatutino] = useState([]);
    const [ativVesp,setAtivVesp] = useState([]);

    const [tabela,setTabela] = useState(false);
    const API_BASE = "http://localhost:3000";
    const [termo, setTermo] = useState("");

    const pesqMat = ativMatutino.filter((obj) => {
    if (termo === "") return true;
    return Object.values(obj).some((valor) =>
        String(valor).toLowerCase().includes(termo.toLowerCase())
    );
});
    const pesqVesp = ativVesp.filter((obj) => {
    if (termo === "") return true;
    return Object.values(obj).some((valor) =>
        String(valor).toLowerCase().includes(termo.toLowerCase())
    );
});


    const getAtiv = async () => {
        try {
            const response = await fetch(`${API_BASE}/atividade`);
            if (!response.ok) {
                throw new Error("Erro ao buscar atividades");
            }
            const data = await response.json();
            
            const vesp = data.filter(
                v=>{
                    if(!v.horario)return false;
                    const hora = parseInt(v.horario.split(":")[0]);
                    return hora>=12;
                }
            );

            const manha = data.filter(
                v=>{
                    if(!v.horario)return false;
                    const hora = parseInt(v.horario.split(":")[0]);
                    return hora<12;
                }
            );
            
            setAtivVesp(vesp);
            setAtivMatutino(manha);
            
        } catch (error) {
            console.error("Erro ao carregar atividades:", error.message);
            alert(`Erro ao carregar atividades: ${error.message}`);
        }
    };


    function mostrarTurmaDividida(){
        
       
        if(Array.isArray(aluno_g)&&aluno_g.length>0 || Array.isArray(aluno_g)&&aluno_g.length>0 && edit)
            
            {
                return(
                    <div>
                        <label htmlFor="adicionados">Alunos Adicionados</label>
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>NOME DO EDUCANDO/A</th>
                                    <th>IDADE</th>
                                    <th>TURNO NA ECDF</th>
                                </tr>
                            </thead>
                            <tbody>
                                {aluno_g.map((aluno) => (
                                    <tr key={aluno.id}>
                                        <td>{aluno.nome}</td>
                                        <td>{aluno.idade}</td>
                                        <td>{aluno.turno}</td>
                                        <td>
                                            <button id={aluno.id} onClick={()=>{
                                                console.log(aluno);
                                                const novaLista = aluno_g.filter(a => a.id != aluno.id);
                                                setAlunoGrupo(novaLista);
                                                console.log(aluno_g);
                                            
                                            }}>
                                                Remover
                                            </button>
                                            
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                )}
                else{
                   return ( <div>
                        <label>Nenhum aluno adicionado</label>
                    </div>)
                }
             
    }

    function divide(alunos){
            console.log(alunos)
            if(seraDividido){
                return(
                    <div>
                        <table className="custom-table">
                        <thead>
                            <tr>
                                <th>NOME DO EDUCANDO/A</th>
                                <th>IDADE</th>
                                <th>TURNO NA ECDF</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alunos.map((aluno) => (
                                <tr key={aluno.id}>
                                    <td>{aluno.nome}</td>
                                    <td>{aluno.idade}</td>
                                    <td>{aluno.turno}</td>
                                    
                                    <td>
                                        <button id={aluno.id} onClick={()=>{
                                        try {
                                            
                                        
                                            const novoDado={
                                                id:aluno.id,
                                                nome:aluno.nome,
                                                idade: aluno.idade,
                                                turno:aluno.turno
                                            };
                                            if (novoDado.turno==="Matutino" && aluno_g.some(a => a.turno==="Vespertino")||novoDado.turno==="Vespertino"&& aluno_g.some(a => a.turno==="Matutino")){
                                                
                                                throw new Error("Turma e turno incompativeis!");
                                            }
                                            else{
                                                const repete = aluno_g.some(a => a.id ===novoDado.id);
                                                if(repete){
                                                    throw new Error("Aluno repetido");
                                                }else{
                                                    setAlunoGrupo(prevState => [...prevState, novoDado]);
                                                }
                                            }
                                            
                                            
                                            } catch (error) {
                                            alert(`Erro ao adicionar aluno: ${error.message}`);
                                        }
                                            
                                            
                                        }}>
                                            Adicionar
                                        </button>
                                        
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {mostrarTurmaDividida()}
                    
                    </div>
                    
                )
                
            }
            
            }
    useEffect(() => {
        const getAlunos = async () => {
            try {
                const response = await fetch(`${API_BASE}/aluno`);
                if (!response.ok) {
                    throw new Error("Erro ao buscar alunos");
                }
                const data = await response.json();
                
                
                const state_alunos=data.map((data)=>{
                    return {
                        id: data.id,
                        nome: data.nome,
                        idade:data.idade,
                        turno:data.turno
                    };
                 });

                
               const filtrados =() => state_alunos.filter(a =>{
                    if(grupo === 'A - Mat') return (a.idade>6 && a.idade <10 && a.turno==="Matutino");
                    else if(grupo === 'B - Mat') return(a.idade>9 && a.idade <18 && a.turno==="Matutino");
                    else if(grupo === 'B - Vesp')return(a.idade>9 && a.idade <18 && a.turno==="Vespertino");
                    else if(grupo === 'A - Vesp')return(a.idade>6 && a.idade <10 && a.turno==="Vespertino");

                    }
            );
            setAlunos(filtrados());
            
                }  
                    
                catch (error) {
                    console.error("Erro ao carregar alunos:", error.message);
                }
            };
            getAtiv();
            getAlunos();
            
}, [grupo,edit]);
    const limparForm = () => {

        setAlunoGrupo(prevArr=>[]);
        setHorario("");
        setHoraLanche("");
        setInicioAcolhida("");
        setFimAcolhida("");
        setInicioLanche("");
        setFimLanche("");  
        setInicioSaida("");
        setFimSaida("");
        setRespSaida("NENHUM");
        setRespLanche("NENHUM");
        setRespAcolhida("NENHUM");
        setDia("Segunda");
        setAtividade(prevArr=>[]);
        setGrupo("A - Mat");
        setSeraDividido(false);
        console.log(aluno_g);

    };

        
    

    

    const adicionarAtiv = async (novaAtiv) =>{
    try {
            const response = await fetch(`${API_BASE}/atividade`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(novaAtiv),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao cadastrar atividade');
            }
            limparForm();
            await getAtiv();
        } catch (error) {
            
            console.error("Erro ao cadastrar atividade:", error);
            alert(`Erro ao cadastrar atividade: ${error.message}`);
            
        }
    }


     const atualizarAtiv = async(id, novosDados)=>{

        try {
            const response = await fetch(`${API_BASE}/atividade/${id}`, {
                method :'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novosDados)
            });
             if (!response.ok) {
                const errorData = (response).statusText;
                throw new Error(errorData || 'Erro ao editar atividade.');
            }
            
            limparForm();
            setEdit(false);
            setIdEdit(null);
            await getAtiv();


        } catch (error) {
            console.error('Erro ao editar atividade:', error);
            alert(`Erro ao editar atividade: ${error.message}`);

        }

     }

     const removerAtividade = async (id) => {
        if (!window.confirm('Tem certeza que deseja remover esta atividade?')) {
            return;
        }
        try {
            const response = await fetch(`${API_BASE}/atividade/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao remover atividade.');
            }

            alert('Atividade removido com sucesso!');
            await getAtiv();
        } catch (error) {
            console.error('Erro ao remover atividade:', error);
            alert(`Erro ao remover atividade: ${error.message}`);
        }
    };

    
    




     const handleEditarClick = (ativ) =>{
        setAtividade(ativ.atividade);
        setDia(ativ.dia);
        setHorario(ativ.horario);
        setHoraLanche(ativ.hora_lanche);
        setGrupo(ativ.grupo);
        setRespAcolhida(ativ.resp_acolhida);
        setRespLanche(ativ.resp_lanche);
        setRespSaida(ativ.resp_saida);
        if(ativ.sera_dividido){
                    setSeraDividido(1===1);
                    setAlunoGrupo(ativ.alunos);
                    console.log();
                }
        inicioAcolhida===undefined&&setInicioAcolhida(" ");
        fimAcolhida===undefined&&setFimAcolhida(" ");
        inicioLanche===undefined&&setInicioLanche(" ");
        fimLanche===undefined&&setFimLanche(" ");
        inicioSaida===undefined&&setInicioSaida(" ");
        fimSaida===undefined&&setFimSaida(" ")

        setIdEdit(ativ.id);
        setEdit(true);
        console.log(seraDividido);
        console.log(ativ.alunos);
     }


    const handleSubmit = async (e) => {
        
            
            
            
            if(horario==='' || horaLanche==='') throw new Error("Insira um horario");


            const tempo_acolhida= inicioAcolhida+" - "+ fimAcolhida;
            const tempo_lanche= inicioLanche + " - "+ fimLanche;
            const tempo_saida= inicioSaida +" - "+ fimSaida;

            console.log(tempo_acolhida, tempo_lanche, tempo_saida);
            
            let arr = [];
            if (!seraDividido){
                arr = alunos;
            }else{
                arr = aluno_g;
            }

            const APorc =() =>{
                const A = arr.filter(alunos => alunos.idade>6 && alunos.idade <10);
                return A.length/arr.length;
            }
            console.log(APorc());
            const BPorc =() =>{
                const B = arr.filter(alunos => alunos.idade>9 && alunos.idade <18);
                return B.length/arr.length;
            }

            

            if(seraDividido){
                    if(APorc()>0.5 && arr.some(a=> a.turno==="Matutino")||BPorc()===0.5|| APorc()===0.5) setGrupo("A - Mat");
                    if(APorc()>0.5 && arr.some(a=> a.turno==="Vespertino")||BPorc()===0.5|| APorc()===0.5) setGrupo("A - Vesp");
                    if(BPorc()>0.5 && arr.some(a=> a.turno==="Matutino"))setGrupo("B - Mat");
                    if(BPorc()>0.5 && arr.some(a=> a.turno==="Vespertino")) setGrupo("B - Vesp");
            };

            if(horario.split(":")[0]<12&&horaLanche.split(":")[0]>=12)throw new Error("Horarios incompativeis");
           
            const dadosAtividade = {
                    atividade,
                    dia,
                    horario,
                    hora_lanche: horaLanche, 
                    grupo, 
                    alunos : arr,
                    sera_dividido: seraDividido,
                    tempo_acolhida,
                    resp_acolhida: respAcolhida,
                    tempo_lanche,
                    resp_lanche: respLanche,
                    tempo_saida,
                    resp_saida : respSaida
                };

            try {
            
            if (edit && id_edit){
                    await atualizarAtiv(id_edit, dadosAtividade);
            }else{
                    await adicionarAtiv(dadosAtividade);
            }
        } catch (error) {
            alert("Erro ao submeter atividade: ", error.message);
                
            }
             
            
    };

        const opcoes = [
        "ATIVIDADES DE ARTE EDUCAÇÃO",
        "OFICINAS TEMATICAS REFLEXIVAS – EQUIPE PSI",
        "OFICINA DE INCENTIVO A LEITURA",
        "VIVÊNCIA TECNOLÓGICA",
        "A ESCOLA VEM AO CIRCO",
        "O CIRCO VAI A ESCOLA"
    ];

        const handleCheckboxChange = (atividade) => {
            setAtividade((prevAtividades) => {
                if (prevAtividades.includes(atividade)) {
                    return prevAtividades.filter((item) => item !== atividade);
            } else {
                return [...prevAtividades, atividade];
            }
            });
        };

    return(
        <div className='cadastro-ativ'>
            <h1>Cadastrar Atividades</h1>
            

            
            <label htmlFor='escolhas'>Atiividades Ministradas</label>

            {opcoes.map((opcao) => (
                <div key={opcao}>
                    <label>
                    <input
                        type="checkbox"
                        checked={atividade.includes(opcao)}
                        onChange={() => handleCheckboxChange(opcao)}
                    />
                    {opcao}
                    </label>
                </div>
                ))
                
                }

            <label htmlFor='dias-semana'>Dia da atividade</label>
            <select id="dias-semana"value={dia} onChange={(e)=>{
                setDia(e.target.value)
                }} required>
                <option value="Segunda">Segunda</option>
                <option value="Terca">Terça</option>
                <option value="Quarta">Quarta</option>
                <option value="Quinta">Quinta</option>
                <option value="Sexta">Sexta</option>
            </select>

            <label htmlFor='hora-ativ'>Horario da atividade</label>
            <input type='time' id='hora-ativ'value={horario} onChange={(e)=>{
                setHorario(e.target.value)
                }}required></input>

            <label htmlFor='hora-lanche'>Horario do Lanche</label>
            <input type='time' id='hora-lanche' value={horaLanche} onChange={(e)=>{
                setHoraLanche(e.target.value)
                }}required></input>

            <label htmlFor='grupos'>Qual Grupo terá essa atividade?</label>
            <select id='grupos' value={grupo} onChange={(e)=>{
                setGrupo(e.target.value);
                }}required>
                <option value='A - Mat' id='g_A'>Grupo A - Matutino</option>
                <option value='B - Mat' id='g_B'>Grupo B - Matutino</option>
                <option value='A - Vesp' id='g_A'>Grupo A - Vespertino</option>
                <option value='B - Vesp' id='g_B'>Grupo B - Vespertino</option>
            </select>

            <label htmlFor='sera-dividido'>Será dividido</label>
            <select id='sera-dividido' value={seraDividido} onChange={
                (e)=>{
                    setSeraDividido(e.target.value==="true");
            }}>
                <option value={false}>Não</option>
                <option value={true}>Sim</option>
                
            </select>

                {seraDividido&&divide(alunos)}
                    

                    
                
                
        
            <hr></hr>
           
            <label htmlFor='portao'>Acolher no portão</label>
            <div className="acolher-portao" id='portao'>
                
                <label htmlFor='ini_port'>Início</label>
                <input type='time' id='ini_port' value={inicioAcolhida} onChange={(e)=>{
                setInicioAcolhida(e.target.value)
                }}></input>

                <label htmlFor='fim_port'>Fim</label>

                <input type='time' id='fim_port' value={fimAcolhida} onChange={(e)=>{
                setFimAcolhida(e.target.value)
                }}></input>
                <label htmlFor='resp_portao'>Equipe Responsável</label>

                <SelectAcomp id='resp_portao' value={respAcolhida} onChange={(e)=>{
                setRespAcolhida(e.target.value)
                }}></SelectAcomp>

                

            </div>

            <label htmlFor='lanche'>Acompanhar Lanche</label>
            <div className="acompanhar-lanche" id='lanche'>

                <label htmlFor='ini_lanche'>Início</label>

                <input type='time' id='ini_lanche' value={inicioLanche} onChange={(e)=>{
                setInicioLanche(e.target.value)
                }}></input>


                <label htmlFor='fim_lanche' >Fim</label>
                <input type='time' id='fim_lanche' value={fimLanche} onChange={(e)=>{
                setFimLanche(e.target.value)
                }} ></input>

                <label htmlFor='resp_lanche'>Equipe Responsável</label>
                <SelectAcomp id="resp_lanche" value={respLanche} onChange={(e)=>{
                setRespLanche(e.target.value)
                }}></SelectAcomp>

            </div>
            <label htmlFor='saida'>Acompanhar Saída</label>
            <div id='saida'>

                <label htmlFor='ini_saida'>Início</label>

                <input type='time' id='ini_saida' value={inicioSaida}
                onChange={(e)=>{
                setInicioSaida(e.target.value)
                }}
                ></input>

                <label htmlFor='fim_saida'>Fim</label>

                <input type='time' id='fim_saida' value={fimSaida} onChange={(e)=>{
                setFimSaida(e.target.value)
                }}></input>
                
                <label htmlFor='resp_saida'>Equipe Responsável</label>
                <SelectAcomp id='resp_saida' value={respSaida} onChange={(e)=>{
                setRespSaida(e.target.value)
                }}></SelectAcomp>
            </div>

            <button onClick={handleSubmit}>{edit?"Salvar Edição":"Cadastrar Atividade"}</button>

            
            <label htmlFor="qual-tabela">Qual tabela gostaria de ver?</label>
            <select id="qual-tabela" onChange={(e)=>setTurno(e.target.value)}>
                <option value={"Matutino"}>Matutino</option>
                <option value={"Vespertino"}>Vespertino</option>
            </select>

            <button onClick={()=>{
                if(tabela===false){
                    setTabela(true);
                    if(!ativMatutino){
                        (<strong>Atividades não cadastradas</strong>);
                    }
                }else{
                    setTabela(false);
                }
            }}>Abrir Tabela</button>
            {tabela && turno=== "Matutino" &&(
                <div className="table-container">

                    <input type="search" value={termo} onChange={e=>{
                        setTermo(e.target.value);
                    }} placeholder="Pesquisar..."></input>

                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>ATIVIDADES</th>
                                <th>DIA DA ATIVIDADE</th>
                                <th>HORARIO</th>
                                <th>HORARIO DO LANCHE</th>
                                <th>GRUPO</th>
                                <th>ALUNOS</th>
                                <th>DIVIDIDO</th>
                                <th>ACOLHER AO PORTÃO</th>
                                <th>RESPONSÁVEL PELO ACOLHIMENTO</th>
                                <th>ACOMPANHAR LANCHE</th>
                                <th>RESPONSAVEL PELO ACOMPANHAMENTO</th>
                                <th>ACOMPANHAR A SAÍDA</th>
                                <th>RESPONSAVEL PELO ACOMPANHAMENTO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {termo===""?ativMatutino.map((ativARR) =>(
                                <tr key={ativARR.id}>
                                    <td><ul>{ativARR.atividade.map((ativ, index) => (
                                                
                                                
                                                    <li key={index}>{ativ}</li>
                                                
                                                
                                                
                                            ))}</ul></td>
                                    <td>{ativARR.dia}</td>
                                    <td>{ativARR.horario}</td>
                                    <td>{ativARR.hora_lanche}</td>
                                    <td>{ativARR.grupo}</td>
                                    <td><ul>{ativARR.alunos.map((aluno, index) => (
                                                
                                                
                                                    <li key={index}>{aluno.nome}</li>
                                                
                                                
                                                
                                            ))}</ul></td>
                                    
                                    <td>{ativARR.sera_dividido?"Sim":"Não"}</td>
                                    <td>{ativARR.tempo_acolhida}</td>
                                    <td>{ativARR.resp_acolhida}</td>
                                    <td>{ativARR.tempo_lanche}</td>
                                    <td>{ativARR.resp_lanche}</td>
                                    <td>{ativARR.tempo_saida}</td>
                                    <td>{ativARR.resp_saida}</td>
                                    <td>
                                        <button onClick={()=>handleEditarClick(ativARR)}>
                                            Editar
                                        </button>
                                        <button onClick={()=>removerAtividade(ativARR.id)}>
                                            Remover
                                        </button>
                                    </td>
                                </tr>
                            )
                        ):pesqMat.map((ativARR) =>(
                                <tr key={ativARR.id}>
                                    <td><ul>{ativARR.atividade.map((ativ, index) => (
                                                
                                                
                                                    <li key={index}>{ativ}</li>
                                                
                                                
                                                
                                            ))}</ul></td>
                                    <td>{ativARR.dia}</td>
                                    <td>{ativARR.horario}</td>
                                    <td>{ativARR.hora_lanche}</td>
                                    <td>{ativARR.grupo}</td>
                                    <td><ul>{ativARR.alunos.map((aluno, index) => (
                                                
                                                
                                                    <li key={index}>{aluno.nome}</li>
                                                
                                                
                                                
                                            ))}</ul></td>
                                    
                                    <td>{ativARR.sera_dividido?"Sim":"Não"}</td>
                                    <td>{ativARR.tempo_acolhida}</td>
                                    <td>{ativARR.resp_acolhida}</td>
                                    <td>{ativARR.tempo_lanche}</td>
                                    <td>{ativARR.resp_lanche}</td>
                                    <td>{ativARR.tempo_saida}</td>
                                    <td>{ativARR.resp_saida}</td>
                                    <td>
                                        <button onClick={()=>handleEditarClick(ativARR)}>
                                            Editar
                                        </button>
                                        <button onClick={()=>removerAtividade(ativARR.id)}>
                                            Remover
                                        </button>
                                    </td>
                                </tr>
                            ))

                            }
                        </tbody>
                    </table>
                    </div>
                            )
                        }
                        {tabela && turno ==="Vespertino" &&(
                <div className="table-container">
                    <input type="search" value={termo} onChange={e=>{
                        setTermo(e.target.value);
                    }} placeholder="Pesquisar..."></input>
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>ATIVIDADES</th>
                                <th>DIA DA ATIVIDADE</th>
                                <th>HORARIO</th>
                                <th>HORARIO DO LANCHE</th>
                                <th>GRUPO</th>
                                <th>ALUNOS</th>
                                <th>DIVIDIDO</th>
                                <th>ACOLHER AO PORTÃO</th>
                                <th>RESPONSÁVEL PELO ACOLHIMENTO</th>
                                <th>ACOMPANHAR LANCHE</th>
                                <th>RESPONSAVEL PELO ACOMPANHAMENTO</th>
                                <th>ACOMPANHAR A SAÍDA</th>
                                <th>RESPONSAVEL PELO ACOMPANHAMENTO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {termo===""?ativVesp.map((ativARR) =>(
                                <tr key={ativARR.id}>
                                    <td><ul>{ativARR.atividade.map((ativ, index) => (
                                                
                                                
                                                    <li key={index}>{ativ}</li>
                                                
                                                
                                                
                                            ))}</ul></td>
                                    <td>{ativARR.dia}</td>
                                    <td>{ativARR.horario}</td>
                                    <td>{ativARR.hora_lanche}</td>
                                    <td>{ativARR.grupo}</td>
                                    <td>
                                        <ul>
                                            {ativARR.alunos.map((aluno, index) => (   
                                                <li key={index}>{aluno.nome}</li>
                                                
                                            ))}
                                            </ul>
                                            </td>
                                    <td>{ativARR.sera_dividido?"Sim":"Não"}</td>
                                    <td>{ativARR.tempo_acolhida}</td>
                                    <td>{ativARR.resp_acolhida}</td>
                                    <td>{ativARR.tempo_lanche}</td>
                                    <td>{ativARR.resp_lanche}</td>
                                    <td>{ativARR.tempo_saida}</td>
                                    <td>{ativARR.resp_saida}</td>
                                    <td>                                        
                                    <button onClick={()=>handleEditarClick(ativARR)}>
                                            Editar
                                    </button>
                                    <button onClick={()=>removerAtividade(ativARR.id)}>
                                            Remover
                                    </button>
                                    </td>
                                </tr>
                            )):pesqVesp.map((ativARR) =>(
                                <tr key={ativARR.id}>
                                    <td><ul>{ativARR.atividade.map((ativ, index) => (
                                                
                                                
                                                    <li key={index}>{ativ}</li>
                                                
                                                
                                                
                                            ))}</ul></td>
                                    <td>{ativARR.dia}</td>
                                    <td>{ativARR.horario}</td>
                                    <td>{ativARR.hora_lanche}</td>
                                    <td>{ativARR.grupo}</td>
                                    <td><ul>{ativARR.alunos.map((aluno, index) => (
                                                
                                                
                                                    <li key={index}>{aluno.nome}</li>
                                                
                                                
                                                
                                            ))}</ul></td>
                                    
                                    <td>{ativARR.sera_dividido?"Sim":"Não"}</td>
                                    <td>{ativARR.tempo_acolhida}</td>
                                    <td>{ativARR.resp_acolhida}</td>
                                    <td>{ativARR.tempo_lanche}</td>
                                    <td>{ativARR.resp_lanche}</td>
                                    <td>{ativARR.tempo_saida}</td>
                                    <td>{ativARR.resp_saida}</td>
                                    <td>
                                        <button onClick={()=>handleEditarClick(ativARR)}>
                                            Editar
                                        </button>
                                        <button onClick={()=>removerAtividade(ativARR.id)}>
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

export default CadastrarAtiv;