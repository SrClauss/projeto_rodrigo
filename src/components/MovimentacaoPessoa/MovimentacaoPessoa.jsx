import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { invoke } from "@tauri-apps/api";
import AutoCompleteProdutos from "../AutoCompleteProdutos/AutoCompleteProdutos";
import { formatMoeda } from "../../frontend/utils";
import './MovimentacaoPessoa.css'
export default function MovimentacaoPessoa({ onSetMovimentacaoData, pedidos, pedidoUIID }) {
    const [produto, setProduto] = useState({});
    const [quantidade, setQuantidade] = useState(0);
    const [entrega, setEntrega] = useState(new Date().toISOString().split('T')[0]);
    const [quantidadeEstoque, setQuantidadeEstoque] = useState(0);
    useEffect(() => {
        onSetMovimentacaoData({
            provisoryId: pedidoUIID,
            produto: produto,
            quantidade: quantidade,
            entrega: entrega

        });

    }, [produto, quantidade, entrega]);

    useEffect(() => {
        const id = produto.id;
        const pedidosFiltrados = pedidos.filter((pedido) => pedido.produto_id === id);
        const quantidadePedidos = pedidosFiltrados.reduce((acc, pedido) => acc + pedido.quantidade, 0);
        setQuantidadeEstoque(produto.estoque_demanda - quantidadePedidos);
    }, [pedidos]);






    return (


        <div className="container-movimentacao">
            <div className="two-columns">
                <AutoCompleteProdutos onSetData={setProduto} />
                <TextField
                    label="Quantidade"
                    size="small"
                    type="number"
                    fullWidth
                    value={quantidade}
                    onChange={(e) => setQuantidade(parseFloat(e.target.value))}
                />
                <TextField
                    fullWidth
                    label="Entrega"
                    size="small"
                    type="date"
                    value={entrega}
                    onChange={(e) => setEntrega(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="Valor"
                    size="small"
                    type="text"
                    value={produto ? formatMoeda(produto.preco_venda * quantidade) : ""}
                    disabled
                />
                <TextField
                    fullWidth
                    label={quantidadeEstoque > 0 ? "Estoque" : "Demanda"}
                    size="small"
                    type="text"
                    value={Math.abs(quantidadeEstoque)}
                    sx={{
                        '& .Mui-disabled': {
                            color: quantidadeEstoque < 0 ? 'red' : '#045b1c',
                            borderColor: quantidadeEstoque < 0 ? 'red' : '#045b1c',
                        },
                        '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                            borderColor: quantidadeEstoque < 0 ? 'red' : '#045b1c',
                        },
                        '& .MuiInputBase-input.Mui-disabled': {
                            color: quantidadeEstoque < 0 ? 'red' : '#045b1c',
                        },
                    }}
                    disabled
                />


            </div>

        </div>
    )




}