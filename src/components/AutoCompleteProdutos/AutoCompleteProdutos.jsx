import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useState } from 'react';
import { invoke } from '@tauri-apps/api';
import './AutoCompleteProdutos.css'

export default function AutoCompleteProdutos ({ onSetData }) {
    const [opcoes, setOpcoes] = useState([]);

    const handleSubmitSearch = (chave) => {
        if (chave === "") {
            return;
        }
        invoke('find_produto_by_substring_name', { nameSubstring: chave }).then((result) => {
            const options = result.map((produto) => {
               
                return {
                    label: produto.nome,
                    id: produto._id.$oid,
                    preco_compra: produto.preco_compra,
                    preco_venda: produto.preco_venda,
                    estoque_demanda: produto.estoque_demanda
                };
            });
        
            setOpcoes(options);
        }).catch((err) => {
            console.error(err);
        });
    };

    const formatMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    };

    return (
        <>
            <Autocomplete
                sx={{ width: '200%' }}
                options={opcoes}
                onChange={(event, value) => {
      
                    onSetData(value);


                
                }}
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                        <div className="option">
                            <div className='two-columns detalhes'>
                                <div>ID: {option.id}</div>
                                <div>Compra: {formatMoeda(option.preco_compra)}</div>
                                <div>Venda: {formatMoeda(option.preco_venda)}</div>
                                {
                                    option.estoque_demanda >= 0 ?
                                        <div className='green'><span className='bold'>Estoque:</span> {option.estoque_demanda}</div>
                                        :
                                        <div className='red'> <span className='bold'>Demanda:</span> {option.estoque_demanda}</div>
                                }
                            </div>
                            <div className="nome-label">{option.label}</div>
                        </div>
                    </li>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        size='small'
                        label="Produto"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSubmitSearch(e.target.value);
                            }
                        }}
                    />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
            />
        </>
    );
};

