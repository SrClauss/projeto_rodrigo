import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import "./Modal.css";
import { invoke } from '@tauri-apps/api';

export default function CadastroCategoria({ onSetComponentModal, onSetTabOrders }) {
    const [data, setData] = useState({
        nome: '',
        descricao: ''
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(data);

        invoke("create_a_categoria", { data: data }).then((res) => {

            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
        setData({ nome: '', descricao: '' });
        

    };

    return (
        <form className="form-cad">
            <div className="title">Cadastro de Categorias</div>
            <div className="two-columns">
                <TextField
                    fullWidth
                    size="small"
                    label="Nome"
                    value={data.nome || ''}
                    onChange={(e) => setData({ ...data, nome: e.target.value })}
                />
                <TextField
                    fullWidth
                    size="small"
                    label="Descrição"
                    value={data.descricao || ''}
                    onChange={(e) => setData({ ...data, descricao: e.target.value })}
                />
            </div>
            <Button fullWidth onClick={handleSubmit} variant="contained" color="primary">
                Enviar
            </Button>
            <Button
                    fullWidth
                    variant="contained"
                    tabIndex={-1}
                    onClick={() =>{
                        onSetTabOrders([1,2,3,4]);
                        onSetComponentModal(false);
                    }}
                    color='error'


                >
                    Sair

                </Button>

        </form>
    );
}


