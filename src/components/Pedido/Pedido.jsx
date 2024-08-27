import { useEffect, useState } from "react";
import { TextField, IconButton, Select, Menu } from "@mui/material";
import './Pedido.css'





export default function Pedido({ produto}){

    const [quantidade, setQuantidade] = useState(0)
    const [valorVenda, setValorVenda] = useState(0)
    const [valorCompra, setValorCompra] = useState(0)

    return (
        <>
        <div className="card-produto" tabIndex={0}>
            <div className="card-content">
                <div className="item">{produto.nome}</div>
                <TextField size="small" type="number"/>
                <Select>
                    {produto.itens.map((item, key) => {
                        return (
                            <MenuItem key={key} value={item.lote}>{item.value}</MenuItem>
                        )
                    }

                    )}

                    
                </Select>
            </div>
        </div>
        </>
    )

    

    

}