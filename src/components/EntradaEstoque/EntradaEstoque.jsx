import { Autocomplete, IconButton, TextField } from "@mui/material";
import "./EntradaEstoque.css";
import { useEffect, useState } from "react";
import { DeleteForever } from "@mui/icons-material";

export default function EntradaEstoque({ item, fornecedores, onDelete }) {

    const optionsFornecedors = fornecedores.map((fornecedor) => {
        return { label: fornecedor.nome, id: fornecedor._id.$oid }
    })
    return (
        <>
            <div className="raiz">

                <div className="three-col">
                    <div className="label">{item.nome}</div>
                    <TextField size="small" className="quant" label="Quant." variant="outlined" type="number" />
                    <TextField size="small" className="lote" label="Lote" variant="outlined" />
                    <Autocomplete
                        className="fornecedor"
                        size='small'
                        id="combo-box-demo"
                        options={optionsFornecedors}
                        renderInput={(params) => <TextField {...params} label="Fornecedor" />}
                    />


                    <TextField size="small" label="Preço Compra" variant="outlined" defaultValue={item.preco_compra_sugerido} type="number" />
                    <TextField size="small" label="Preço Venda" variant="outlined"  defaultValue={item.preco_venda_sugerido} type="number" />

                    <IconButton
                    
                    style={{marginTop: "-5px"}}
                
          
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