import { Link } from "react-router-dom";
import './index.css';
export default function Header(){
    return(
        <div className="header">
            <Link to ='/'>Cadastrar Aluno</Link>
            <Link to = '/cadastrar-ativ'>Cadastrar Atividade</Link>
            {/*<Link to = '/atendimentos'>Atendimentos</Link>*/}
        </div>
    )
}