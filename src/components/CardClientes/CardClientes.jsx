import { Divider, IconButton } from "@mui/material";
import "./CardClientes.css";
import { AddBusiness, DeleteForeverRounded, Edit, Person2Outlined, Person2Rounded, Shop, Shop2 } from "@mui/icons-material";
const cli = {
    id: "1c088ed4-96fa-48c1-a6eb-7417c24e821f",
    nome: "João Carlos do Nascimento",
    cpf: "123.456.789-00",
    telefone: "(11) 99999-9999",
    email: "joao@hotmail.com"
}
export default function CardClientes({pessoa, onDeleteCliente, onEditCliente, onCreatePedido }) {
    return (
        <div className="card-cliente">
            <div className="card-cliente-icon">
                <Person2Rounded color="secondary" fontSize="large"/>
            </div>
            <Divider orientation="vertical" flexItem />
            <div className="card-cliente-info">


                <div className="first-line">
                    <div>{pessoa._id.$oid}</div>
                </div>
                <div className="second-line">
                    {pessoa.nome}
                </div>
                <div className="third-line">
                    <div>CPF/CNPJ: {pessoa.cpf_cnpj}</div>
                    <Divider orientation="vertical" flexItem />
                    <div>Telefone: {pessoa.telefone}</div>
                
                </div>

            </div>
            <Divider orientation="vertical" flexItem />
            <div className="card-cliente-actions">
                <IconButton onClick={() => onEditCliente(pessoa.id)}><Edit color="secondary"/></IconButton>
                <IconButton onClick={() => onDeleteCliente(pessoa.id)}><DeleteForeverRounded color="secondary"/></IconButton>
                <IconButton onClick={()=> onCreatePedido(pessoa.id)}><Shop color="secondary"/></IconButton>

            </div>
        </div>
    )
}