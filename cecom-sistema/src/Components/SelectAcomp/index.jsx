 function SelectAcomp(id, onChange, className){
    return(
        <select id = {id} onChange={onChange} className={className}>
            <option value='NENHUM'>NENHUM</option>
            <option value='EQUIPE MULTI DISCIPLINAR'>EQUIPE MULTI DISCIPLINAR</option>
            <option value='ARTE EDUCADOR'>ARTE EDUCADOR</option>
            <option value='EQUIPE ADMINISTRATIVA'>EQUIPE ADMINISTRATIVA</option>
            <option value='ATIVIDADES EXTERNAS'>EQUIPE ADMINISTRATIVA</option>
        </select>
    )
}
export default SelectAcomp;