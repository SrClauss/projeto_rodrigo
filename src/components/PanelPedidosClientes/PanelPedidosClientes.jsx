
import './PanelPedidosClientes.css';
import MovimentacaoPessoa from '../MovimentacaoPessoa/MovimentacaoPessoa';
import { useEffect, useState } from 'react';
import { Button, FormControlLabel, TextField, Checkbox } from '@mui/material';
import { generateUUID } from '../../frontend/utils';
import PedidosRecorrentes from '../PedidosRecorrentes/PedidosRecorrentes';


export default function PanelPedidosClientes({ cliente }) {

    const [pedidos, setPedidos] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [showPedidosRecorrentes, setShowPedidosRecorrentes] = useState(false);

    const handleAddPedido = () => {
        const pedido = {
            key: generateUUID(),
            cliente: cliente,
            data: date,
            produto_id: '',
            quantidade: 0,
            entrega: '',
            recorrente: showPedidosRecorrentes
        }
        setPedidos([...pedidos, pedido]);
    };

    useEffect(() => {
        if (pedidos.length === 0) {
            setShowPedidosRecorrentes(false);
        }
    }, [pedidos]);

    const handleSetMovimentacaoData = (pedido) => {
        setPedidos(pedidos.map((p) => {
            if (p.key === pedido.provisoryId) {
                return {
                    ...p,
                    produto_id: pedido.produto.id,
                    quantidade: pedido.quantidade,
                    entrega: pedido.entrega
                }
            }
            return p;
        }));


    }


    const savePedidoComum = (pedido) => {
        /*
         pub id: ObjectId,
    pub cliente_id: ObjectId,
    pub produto: ObjectId,
    pub quantidade: f64,
    pub data: String,
    pub entrega: Option<String>,
         */
        console.log(pedido);
        const adaptedData = {
            cliente_id: pedido.cliente._id.$oid,
            produto: pedido.produto_id,
            quantidade: pedido.quantidade,
            data : new Date(pedido.data).toISOString(),
            entrega: new Date(pedido.entrega).toISOString()
        }
        console.log(adaptedData);
    }
    return (
        <div className='root-panel'>
            <div className='two-columns'>
                <Button variant='text' onClick={handleAddPedido}>Adicionar Pedido</Button>
                <Button variant='text' onClick={(e) => { setPedidos([]) }}>Limpar</Button>
                <TextField

                    label="Data"
                    size="small"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />



            </div>
            <div className='container-pedido'>
                {
                    pedidos.map((pedido) => {

                        return (

                            <div key={pedido.key} className='pedido'>
                                <MovimentacaoPessoa pedidos={pedidos} onSetMovimentacaoData={handleSetMovimentacaoData} pedidoUIID={pedido.key} />
                            </div>
                        )
                    })
                }
            </div>
            {

                pedidos.length > 0 &&

                <div>
                    <FormControlLabel
                        control={

                            <Checkbox
                                checked={showPedidosRecorrentes}
                                onChange={(e) => setShowPedidosRecorrentes(e.target.checked)}
                            />}
                        label="Pedidos Recorrentes" />


                    {
                        showPedidosRecorrentes &&
                        <PedidosRecorrentes onSubmitData={
                            (data) => {
                                setPedidos(pedidos.map((pedido) => {
                                    return {
                                        ...pedido,
                                        recorrencia: data
                                    }
                                }))
                            }
                        } />
                    }
                    <Button variant='contained' fullWidth onClick={() => savePedidoComum(pedidos[0])}>Salvar</Button>
                </div>


            }

        </div>
    )
}