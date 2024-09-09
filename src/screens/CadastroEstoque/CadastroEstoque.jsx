import React, { useEffect, useRef } from 'react';
import { Checkbox, FormControl, FormControlLabel, TextField } from '@mui/material';
import { useState } from 'react';
import Estoque from '../../components/Estoque/Estoque';
import { Alert, Breadcrumbs, Button, Fab, Paper, Snackbar } from '@mui/material';
import ProductSearch from '../../components/ProductSearch/ProductSearch';
import { invoke } from '@tauri-apps/api';
import './CadastroEstoque.css'
import { ArrowBack, CheckBox } from '@mui/icons-material';
import { NavigationContext } from '../../NavigationContext';
import PedidosRecorrentes from '../../components/PedidosRecorrentes/PedidosRecorrentes';
export default function CadastroEstoque({ mode }) {
    const { setActiveScreen } = React.useContext(NavigationContext);
    const [itens, setItens] = useState([])
    const [categorias, setCategorias] = useState([])
    const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'info' })
    const [quantidades, setQuantidades] = useState([])
    const [trigger, setTrigger] = useState(false)
    const [date, setDate] = useState('')



    const handleBack = () => {
        setActiveScreen("MainScreen")
    }
    useEffect(() => {
        setQuantidades(somarQuantidades(itens))

    }, [itens])

    useEffect(() => {
        invoke("get_categorias").then((response) => {
            setCategorias(response)

        }
        ).catch((error) => {
            console.log(error)
        })





    }, [])
    const handleDelete = (item) => {
        setItens(itens.filter((i) => {
            return i !== item
        }))
    }

    const somarQuantidades = (itens) => {
        const somaQuantidades = {};


        itens.forEach(item => {
            const id = item._id.$oid;
            if (somaQuantidades[id]) {
                somaQuantidades[id] += item.quantidade;
            } else {
                somaQuantidades[id] = item.quantidade;
            }
        });


        return itens.map(item => somaQuantidades[item._id.$oid]);
    };




    const handleMovimentacaoEstoque = () => {
        let hasError = false;
        console.log(itens[0]);

        const adaptData = (item) => ({
            produto_id: item._id.$oid,
            quantidade: item.quantidade,
            data: date,
            ...(mode === 'entrada' ? { fornecedor_id: item.fornecedor.id } : { cliente_id: item.cliente.id })
        });

        const adaptedData = itens.map(adaptData);
        console.log("Adapted: ", adaptedData);

        const validateItem = (item, index) => {
            if (item.quantidade < 1) {
                setSnackbar({
                    open: true,
                    message: `A quantidade do item ${item.nome} na posição ${index + 1} deve ser maior que 0`,
                    type: 'error'
                });
                return true;
            }
            if (mode === 'entrada' && !item.fornecedor) {
                setSnackbar({
                    open: true,
                    message: `O fornecedor do item ${item.nome} na posição ${index + 1} deve ser preenchido`,
                    type: 'error'
                });
                return true;
            }
            if (mode === 'saida' && !item.cliente) {
                setSnackbar({
                    open: true,
                    message: `O cliente do item ${item.nome} na posição ${index + 1} deve ser preenchido`,
                    type: 'error'
                });
                return true;
            }
            return false;
        };

        itens.forEach((item, index) => {
            if (validateItem(item, index)) {
                hasError = true;
            }
        });

        if (hasError) {
            return;
        }

        const invokeMovimentacao = (item, index) => {
            const action = mode === 'entrada' ? 'movimentacao_entrada' : 'movimentacao_saida';
            invoke(action, { data: item }).then((response) => {
                console.log(response);
                if (index === adaptedData.length - 1) {
                    setSnackbar({
                        open: true,
                        message: `${mode === 'entrada' ? 'Entrada' : 'Saída'} de estoque realizada com sucesso`,
                        type: 'success'
                    });
                }
            }).catch((error) => {
                console.log(error);
            });
        };

        adaptedData.forEach(invokeMovimentacao);

        setItens([]);
        setTrigger(!trigger);
    };


    return (
        <div className='screen-cad'>
            <div className='title-screen'>
                {mode === 'entrada' ? 'Entrada de Estoque' : 'Saída de Estoque'}
            </div>
            <Paper elevation={2} className='screen-paper'>

                <ProductSearch
                    trigger={trigger}
                    categorias={categorias}
                    onSubmitSearch={(item) => {

                        setItens([...itens, { ...item, quantidade: 0, fornecedor: null }])
                    }} />
            </Paper>


            <Paper hidden={itens.length == 0} elevation={2} className='screen-paper' >
                <div className='two-columns'>
                    <div className='sub-title'>Itens Inseridos</div>
                    <TextField 
                    label='Data' 
                    type='date'
                    size='small'                  
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={date.split('T')[0]}
                    onChange={(e) =>{
                        const selectedDate = new Date(e.target.value)
                        setDate(selectedDate.toISOString())
                    }}
                    />
                </div>
                {itens.map((item, index) => {
                    return <Estoque
                        mode={mode}
                        key={index}
                        item={item}
                        onDelete={handleDelete}
                        estoque={mode==="saida"?itens[index].estoque_demanda - quantidades[index]:
                        itens[index].estoque_demanda + quantidades[index]
                        }
                        onSetData={
                            (data) => {
                                const newItens = [...itens]
                                newItens[index] = data
                                setItens(newItens)

                            }

                        }
                    />
                })}
                <Button
                    fullWidth
                    variant='contained'
                    color='primary'
                    onClick={handleMovimentacaoEstoque}

                >
                    Salvar
                </Button>
            </Paper>
 
            <Fab variant="extended" size="medium" color="primary" className='fab-bottom' onClick={handleBack}>
                <ArrowBack sx={{ mr: 1 }} />
                Voltar
            </Fab>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.type} sx={{ width: '100%' }}>
                    {snackbar.message}

                </Alert>

            </Snackbar>



        </div>
    )
}