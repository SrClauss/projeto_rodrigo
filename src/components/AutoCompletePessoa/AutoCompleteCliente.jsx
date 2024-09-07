import { invoke } from '@tauri-apps/api';
import './AutoCompletePessoa.css';
import { useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { formatStrings } from '../../frontend/utils';
export default function AutoCompleteCliente({ onSetData }) {

    const [opcoes, setOpcoes] = useState([])


    const handleSubmitSearch = (chave) => {
        if (chave === "") {
            return
        }
        invoke('find_cliente_by_substring_name', { nameSubstring: chave }).then((result) => {
            const options = result.map((client) => {

                return { label: client.nome, id: client._id.$oid, cpf: client.cpf_cnpj }
            })


            setOpcoes(options)

        }).catch((err) => {
            console.error(err)
        })
    }
    return (

        <>
            <Autocomplete
                style={{ width: '100%' }}
                options={opcoes}
                onChange={
                    (event, value) => {
                        onSetData(value)
                    }}

                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => (
                    <li {...props}>
                        <div className="option">
                            <div className='two-columns cpf-label'>


                                <div>{option.id}</div>
                                <div>{formatStrings(option.cpf)}</div>
                            </div>
                            <div className="name-label">{option.label}</div>
                        </div>
                    </li>
                )}
                renderInput={(params) => <TextField  {...params} size='small' label="Cliente" onKeyDown={
                    (e) => {
                        if (e.key === 'Enter') {
                            handleSubmitSearch(e.target.value)
                        }
                    }
                } />}
                isOptionEqualToValue={(option, value) => option.id === value.id}




            />

        </>

    )


}



