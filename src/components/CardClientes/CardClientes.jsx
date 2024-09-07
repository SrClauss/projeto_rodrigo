import { Divider, IconButton, Tooltip } from "@mui/material";
import "./CardClientes.css";
import { AddBusiness, DeleteForeverRounded, Edit, Person2Outlined, Person2Rounded, Shop, Shop2 } from "@mui/icons-material";
import PanelPedidosClientes from "../PanelPedidosClientes/PanelPedidosClientes";
import { useState } from "react";
export default function CardClientes({ pessoa, onDeleteCliente, onEditCliente, onCreatePedido }) {
    const [showPedidos, setShowPedidos] = useState(false)
    return (

        <div className="root-card-cliente">
            <div className="card-cliente">
                <div className="card-cliente-icon">
                    <Person2Rounded color="secondary" fontSize="large" />
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
                    <Tooltip title="Editar Cliente" arrow>
                        <IconButton onClick={() => onEditCliente(pessoa._id.$oid)}><Edit color="secondary" /></IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir Cliente" arrow>
                        <IconButton onClick={() => onDeleteCliente(pessoa._id.$oid)}><DeleteForeverRounded color="secondary" /></IconButton>
                    </Tooltip>
                    <Tooltip title="Cadastrar Pedido" arrow>
                        <IconButton onClick={() => {onCreatePedido(pessoa)
                        setShowPedidos(true)}}><Shop color="secondary" /></IconButton>
                    </Tooltip>

                </div>
            </div>
            {
                showPedidos ?
                    <PanelPedidosClientes cliente={pessoa} onClose={() => setShowPedidos(false)} />
                    :
                    null
            }
            


           
        </div>
    )
}