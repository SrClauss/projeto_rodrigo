import React, { useEffect, useState } from 'react';
import { maskCpfCnpj, maskUUID } from '../frontend/utils';
import { Select, TextField, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import { invoke } from '@tauri-apps/api';
import ProductSearch from '../components/ProductSearch/ProductSearch';
import Pedido from '../components/Pedido/Pedido';
export default function CadastroPedidos({ onSetComponentModal, initialData = {}, cliente }) {
    const [categorias, setCategorias] = useState([])
    const [data, setData] = useState({ ...initialData })
    const [itensPedidos, setItensPedidos] = useState([])
    useEffect(() => {
        invoke('get_categorias').then((res) => {
            setCategorias(res)

            
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    
    return (
        <>
            <div className="title">Cadastro de Pedidos</div>
            <div className='two-columns'>
                <div className='gray'>{cliente._id.$oid}</div>
                <div className='gray'>{maskCpfCnpj(cliente.cpf_cnpj)}</div>
            </div>
            <div className='name'>{cliente.nome}</div>
            <div className='form-cad'>
                <div className='form-info-pedido'>

                    <div className='two-columns'>

                        <TextField
                            required
                            fullWidth
                            type="date"
                            label="Data do Pedido"
                            InputLabelProps={{
                                shrink: true,
                            }}

                            value={data.dataPedido}
                            onChange={(e) => setData({ ...data, dataPedido: e.target.value })}
                        />
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>
                            <Select
                                fullWidth
                                label="Status"
                                value={data?.status}
                                defaultValue={'0'}
                                onChange={(e) => setData({ ...data, status: e.target.value })}

                            >
                                <MenuItem value='0'>Aberto</MenuItem>
                                <MenuItem value='1'>Pago</MenuItem>
                                <MenuItem value='2'>Cancelado</MenuItem>

                            </Select>
                        </FormControl>

                    </div>
                    
                </div>
                <div className='form-info-itens'>
                    <div hidden={itensPedidos.length == 0}>
                        {

                            itensPedidos.map((item) => {
                                return (
                                    <Pedido produto={item} />
                                )
                            })
                        }
                    </div>

                  <ProductSearch categorias={categorias} onSubmitSearch={

                    (produto) => {

                        setItensPedidos([...itensPedidos, produto])
                        
                    }
                  }/>
                    
                    
                    

                </div>

            </div>


        </>

    )

}

/*

pub struct Pedido{

    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub cliente_id: ObjectId,
    pub data: DateTime,
    pub status: StatusPedido,
    pub itens: Vec<ItemPedido>,
    
}
*/