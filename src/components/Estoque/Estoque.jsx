import {IconButton, TextField } from "@mui/material";
import "./Estoque.css";
import { useState } from "react";
import { DeleteForever } from "@mui/icons-material";
import EstoqueDemanda from "./EstoqueDemanda";
import AutoCompleteCliente from "../AutoCompletePessoa/AutoCompleteCliente";
import AutoCompleteFornecedor from "../AutoCompletePessoa/AutocompleteFornecedor";

export default function Estoque({ item, onDelete, estoque, onSetData, mode }) {

 

    const [quantidade, setQuantidade] = useState(0)
    const [pessoa, setPessoa] = useState(null)

    



    const NumberFieldChange = (e) => {
        if (e.target.value === "") {
            setQuantidade(0)
        }
        if (e.target.value < 0) {
            setQuantidade(0)
        }
    }
    return (
        <>
            <div className="raiz">

                <div className="three-col">

                    <div className="label">
                        <EstoqueDemanda estoquedemanda={estoque} />
                        <div>

                            {item.nome}</div>
                    </div>
                    <TextField
                        size="small"
                        className="quant"
                        label="Quant."
                        onBlur={NumberFieldChange}
                        variant="outlined"
                        type="number"
                        value={quantidade}
                        onChange={(e) => {


                            setQuantidade(parseFloat(e.target.value || 0))
                            if (mode === 'entrada') {
                            onSetData({ ...item, quantidade: parseFloat(e.target.value || 0), fornecedor: pessoa })
                            }

                            else {
                                onSetData({ ...item, quantidade: parseFloat(e.target.value || 0), cliente: pessoa })
                            }

                        }}

                        isOptionEqualToValue={(option, value) => option.id === value.id} // Comparar opções pelo ID
                    />
                    {
                        mode === 'entrada'&& 


                        <AutoCompleteFornecedor onSetData={(data) => {
                            setPessoa(data)
                            onSetData({ ...item, quantidade: quantidade, fornecedor: data })
                        }} />

                    }


                    {
                        mode === 'saida' &&

                        <AutoCompleteCliente onSetData={(data) => {

                            setCliente(data)
                            onSetData({ ...item, quantidade: quantidade, cliente: data })

                        }} />
                    }
                    
                    
                        


                  


                   
                    <TextField onBlur={NumberFieldChange} size="small" label="Preço Compra" disabled variant="outlined" defaultValue={item.preco_compra} type="number" />
                    <TextField onBlur={NumberFieldChange} size="small" label="Preço Venda" disabled variant="outlined" defaultValue={item.preco_venda} type="number" />
                    <TextField onBlur={NumberFieldChange} size="small" label="Total Compra" disabled value={item.preco_compra * quantidade || 0} type="number" />
                    <TextField onBlur={NumberFieldChange} size="small" label="Total Venda" disabled value={item.preco_venda * quantidade || 0} type="number" />

                    <IconButton

                        style={{ marginTop: "-5px" }}


                        onClick={


                            () => {
                                onDelete(item)
                            }



                        }

                    >
                        <DeleteForever fontSize="large" color="error" />
                    </IconButton>

                </div>






            </div>

        </>
    )

}