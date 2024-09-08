import { Divider, IconButton, Tooltip } from "@mui/material";
import "./CardClientes.css";
import { AddBusiness, DeleteForeverRounded, Edit, Person2Outlined, Person2Rounded, Shop, Shop2 } from "@mui/icons-material";
import { useState } from "react";


export default function CardFornecedor({ pessoa, onDeleteFornecedor, onEditFornecedor}) {
    return (

        <div className="root-card-cliente">
            <div className="card-cliente">
                <div className="card-cliente-icon">
                    <Shop2 color="secondary" fontSize="large" />
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
                        <IconButton onClick={() => onEditFornecedor(pessoa)}><Edit color="secondary" /></IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir Cliente" arrow>
                        <IconButton onClick={() => onDeleteFornecedor(pessoa._id.$oid)}><DeleteForeverRounded color="secondary" /></IconButton>
                    </Tooltip>
                  
                    </div>

            </div>

        </div>

    )


}




