import React, { useEffect, useState } from 'react';
import { TextField, Button, Snackbar, FormControl, InputLabel, Input, InputAdornment, Autocomplete, Alert } from '@mui/material';
import { Box } from '@mui/system';
import { dialog, invoke } from '@tauri-apps/api';


export default function CadastroProdutos({ onSetComponentModal, initialData = {}, onSetTabOrders }) {
    const nomeRef = React.useRef(null)
    const [data, setData] = useState({
        nome: initialData?.nome || '',
        categoria: initialData?.categoria || { label: 'Selecione uma categoria', value: null },
        preco_compra: initialData?.preco_compra || '',
        preco_venda: initialData?.preco_venda || '',
        unidade: initialData?.unidade || '',
    })
    const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'info' })

    const [categorias, setCategorias] = useState([])

    useEffect(() => {
        invoke('get_categorias').then((res) => {
            const adaptedData = res.map((item) => {
                return { label: item.nome, value: item._id.$oid }
            })
            const categorias = [{ label: 'Selecione uma categoria', value: null }, ...adaptedData]
            setCategorias(categorias)


        }).catch((err) => {
            console.log(err)
        })
    }, [])
    
    const handleSubmitData = () => {
        if (!data.nome || !data.categoria || !data.preco_compra || !data.preco_venda || !data.unidade) {
            setSnackbar({ open: true, message: 'Preencha todos os campos', type: 'error' })
            return;
        }
        const adaptedData = {
            ...data,
            categoria_id: data.categoria.value
        }

        console.log(adaptedData)
        invoke('create_a_produto', {data: adaptedData}).then((res) => {

            setSnackbar({ open: true, message: 'Produto cadastrado com sucesso', type: 'success' })
            setData({
                nome: '',
                categoria: { label: 'Selecione uma categoria', value: null },
                preco_compra: '',
                preco_venda: '',
                unidade: '',
            })
       
            
        }).catch((err) => {
            setSnackbar({ open: true, message: 'Erro ao cadastrar o produto', type: 'error' })
        })



    }
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false })
    }

    useEffect(() => {
        if (nomeRef.current) {
          nomeRef.current.focus();
        }
      }, [nomeRef.current]);


    return (
        <>
            <div className="title">Cadastro de Produtos</div>

            <div className="form-cad">
                <div className="two-columns">
                    <FormControl variant="outlined" fullWidth>
                        <TextField

                            ref={nomeRef}
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
                        disablePortal
                        options={categorias}
                        renderInput={(params) => <TextField {...params} label="Categoria" />}
                        value={data?.categoria}
                        onChange={(e, value) => setData({ ...data, categoria: value })}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                    />




                </div>

                <div className="two-columns">
                    <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
                        <InputLabel>Preço Compra Sugerido</InputLabel>
                        <Input
                            id="standard-adornment-amount"
                            startAdornment={<InputAdornment position="start">R$</InputAdornment>}
                            value={data?.preco_compra}
                            onChange={(e) => setData({ ...data, preco_compra: e.target.value })}

                        />
                    </FormControl>

                    <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
                        <InputLabel>Preço Venda Sugerido</InputLabel>
                        <Input
                            id="standard-adornment-amount"

                            startAdornment={<InputAdornment position="start">R$</InputAdornment>}
                            value={data?.preco_venda}
                            onChange={(e) => setData({ ...data, preco_venda: e.target.value })}
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
                    tabIndex={-1}
                    onClick={() =>{
                        onSetTabOrders([1,2,3,4]);
                        onSetComponentModal(null);
                    }}
                    color='error'


                >
                    Sair

                </Button>
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.type} sx={{ width: '100%' }}>
                        {snackbar.message}

                    </Alert>

                </Snackbar>
            </div>


        </>
    )
}









