import React, { useEffect, useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Input, InputAdornment, Autocomplete } from '@mui/material';
import { Box } from '@mui/system';
import { dialog, invoke } from '@tauri-apps/api';


export default function CadastroProdutos({ onSetComponentModal, initialData = {} }) {
    const nomeRef = React.useRef(null)
    const [data, setData] = useState({
        nome: initialData.nome || '',
        categoria: initialData.categoria || null,
        preco_compra_sugerido: initialData.preco_compra_sugerido || '',
        preco_venda_sugerido: initialData.preco_venda_sugerido || '',
        unidade: initialData.unidade || '',
    })
    const [categorias, setCategorias] = useState([])

    useEffect(() => {
        invoke('get_categorias').then((res) => {
            const adaptedData = res.map((item) => {
                return { label: item.nome, value: item._id.$oid }
            })
            const categorias = [{label: '', value: null}, ...adaptedData]
            setCategorias(categorias)
            nomeRef.current.focus()
            
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    useEffect(() => {
        console.log(data)
    }, [data])
    const handleSubmitData = () => {

        console.log(data)
        const adaptedData = {
            nome: data.nome,
            categoria_id: data.categoria,
            preco_compra_sugerido: parseFloat(data.preco_compra_sugerido.replace(',', '.')),
            preco_venda_sugerido: parseFloat(data.preco_venda_sugerido.replace(',', '.')),
            unidade: data.unidade


        }
    
        if (!adaptedData.nome || !adaptedData.categoria_id || !adaptedData.preco_compra_sugerido || !adaptedData.preco_venda_sugerido || !adaptedData.unidade) {
            dialog.message('Preencha todos os campos')
            return
        }
 
        invoke('create_a_produto', { data: adaptedData }).then((res) => {
            console.log(res)
            dialog.message('Produto cadastrado com sucesso')
            setData({
                nome: '',
                categoria: null,
                preco_compra_sugerido: '',
                preco_venda_sugerido: '',
                unidade: ''
            })

      
        }).catch((err) => {
            dialog.message(err)
        })
            
    }




    return (
        <>
            <div className="title">Cadastro de Produtos</div>

            <div className="form-cad">
                <div className="two-columns">
                    <FormControl variant="outlined" fullWidth>
                        <TextField

                            ref = {nomeRef}
                            required
                            fullWidth
                            id="standard-required"
                            label="Nome"
                            value={data?.nome}
                            onChange={(e) => setData({ ...data, nome: e.target.value })}
                        />

                    </FormControl>
                    <Autocomplete
                        fullWidth
                        id="combo-box-demo"
                        options={categorias}
                        renderInput={(params) => <TextField {...params} label="Categoria" />}
                        value = {data.categoria}
                        onChange={(e, value) => setData({ ...data, categoria: value?.value })}
                       
                    />
                        
                      


                </div>

                <div className="two-columns">
                    <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
                        <InputLabel>Preço Compra Sugerido</InputLabel>
                        <Input
                            id="standard-adornment-amount"
                            startAdornment={<InputAdornment position="start">R$</InputAdornment>}
                            value={data?.preco_compra_sugerido}
                            onChange={(e) => setData({ ...data, preco_compra_sugerido: e.target.value })}

                        />
                    </FormControl>

                    <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
                        <InputLabel>Preço Venda Sugerido</InputLabel>
                        <Input
                            id="standard-adornment-amount"
                        
                            startAdornment={<InputAdornment position="start">R$</InputAdornment>}
                            value={data?.preco_venda_sugerido}
                            onChange={(e) => setData({ ...data, preco_venda_sugerido: e.target.value })}
                        />
                    </FormControl>

                    <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
                        
                        <TextField
                            id="standard-adornment-amount"
                            label="Unidade"
                            value={data?.unidade} 
                            onChange={(e) => setData({ ...data, unidade: e.target.value.toUpperCase() })}
                           
                        />
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

                <Button
                    fullWidth
                    variant="contained"
                    onClick={() => onSetComponentModal(null)}
                    color='error'

                >
                    Sair

                </Button>
            </div>


        </>
    )
}









