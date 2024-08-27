import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import EntradaEstoque from '../../components/EntradaEstoque/EntradaEstoque';
import { Button, Fab, Paper } from '@mui/material';
import ProductSearch from '../../components/ProductSearch/ProductSearch';
import { invoke } from '@tauri-apps/api';
import './CadastroEntradaEstoque.css'
import { BackHand, ArrowBack } from '@mui/icons-material';
import { NavigationContext } from '../../NavigationContext';
export default function CadastroEntradaEstoque() {
    const { setActiveScreen } = React.useContext(NavigationContext);
    const [itens, setItens] = useState([])
    const [categorias, setCategorias] = useState([])
    const [fornecedores, setFornecedores] = useState([])




    const handleBack = () => {
        setActiveScreen("MainScreen")
    }


    useEffect(() => {
        console.log
        invoke("get_categorias").then((response) => {
            setCategorias(response)

        }
        ).catch((error) => {
            console.log(error)
        })
        invoke("find_all_fornecedores").then((response) => {

            setFornecedores(response)

        }).catch((error) => {
            console.log(error)
        }
        )

    }, [])
    const handleDelete = (item) => {
        setItens(itens.filter((i) => {
            return i !== item
        }))
    }


    return (
        <div className='screen-cad'>
            <div className='title-screen'>Entrada Estoque</div>
            <Paper elevation={2} className='screen-paper'>

                <ProductSearch categorias={categorias} onSubmitSearch={(item) => {
                    setItens([...itens, item])
                }} />
            </Paper>


            <Paper hidden={itens.length == 0} elevation={2} className='screen-paper' >
                <div className='sub-title'>Itens Inseridos</div>
                {itens.map((item, index) => {
                    return <EntradaEstoque key={index} item={item} fornecedores={fornecedores} onDelete={handleDelete} onSetData={console.log} />
                })}
                <Button fullWidth variant='contained' color='primary'>Salvar</Button>
            </Paper>

            <Fab variant="extended" size="medium" color="primary" className='fab-bottom' onClick={handleBack}>
                <ArrowBack sx={{ mr: 1 }} />
                Voltar
            </Fab>


        </div>
    )
}