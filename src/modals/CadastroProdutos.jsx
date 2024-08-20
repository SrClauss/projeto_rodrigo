import React, { useEffect, useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Box } from '@mui/system';
import { invoke } from '@tauri-apps/api';


export default function CadastroProdutos({ onSetComponentModal, initialData = {} }) {

    const [data, setData] = useState(initialDatagit )
    const [categorias, setCategorias] = useState([])

    useEffect(() => {
        invoke('get_categorias').then((res) => {
            setCategorias(res)
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    }, [])


    const handleSubmitData = () => {
        const adaptedData = {
            nome: data.nome,
            categoria_id: data.categoria.$oid
        }
        console.log(adaptedData)
        invoke('create_a_produto', {data: adaptedData}).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
        onSetComponentModal(null)
    }




    return (
        <>
            <div className="title">Cadastro de Produtos</div>

            <div className="form-cad">
                <div className="two-columns">
                    <TextField
                        required
                        fullWidth
                        id="standard-required"
                        label="Nome"
                        defaultValue={data.nome}
                        onChange={(e) => setData({ ...data, nome: e.target.value })}
                    />
                    <FormControl variant="outlined" fullWidth>

                        <InputLabel id="demo-simple-select-outlined-label">Categoria</InputLabel>
                        <Select
                            fullWidth
                            label="Categoria"
                            value={data?.categoria}
                            onChange={(e) => setData({ ...data, categoria: e.target.value })}
                        >
                            {categorias.map((categoria, key) => (
                                <MenuItem key={key} value={categoria._id}>{categoria.nome}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </div>

            <div className='buttons-div'>

                <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleSubmitData()}
                >
                    Salvar
                </Button>
            </div>

        </>
    )
}









/*

pub struct Produto {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub nome: String,
    pub descricao: String,
    pub categoria_id: ObjectId,
    pub itens: Vec<ItemProduto>,

}


impl ItemProduto {
    pub fn new(

       
        fornecedor_id: ObjectId,
        quantidade: i32,
        preco_compra: f64,
        preco_venda: f64,
        lote: Option<String>,
        data_fabricacao: DateTime,
        data_validade: DateTime,
    ) -> Self {
        ItemProduto {
            id: ObjectId::new(),    
            fornecedor_id,
            quantidade,
            preco_compra,
            preco_venda,
            lote,
            data_fabricacao,
            data_validade,
        }
    }
 */