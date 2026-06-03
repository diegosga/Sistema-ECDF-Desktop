import {BrowserRouter, HashRouter, Route, Routes} from 'react-router-dom';
import CadastrarAtiv from './Pages/CadastrarAtiv';
import CadastrarAluno from './Pages/CadastrarAluno';
import Header from './Components/Header';
import Atendimentos from './Pages/Atendimentos';
export default function RoutesApp(){
    return(
    <HashRouter>
            <Header/>
            <Routes>
                <Route path= "*" element={<CadastrarAluno/>}/>
                <Route path='/cadastrar-ativ' element={<CadastrarAtiv/>}/>
            </Routes>

        </HashRouter>
    )
}