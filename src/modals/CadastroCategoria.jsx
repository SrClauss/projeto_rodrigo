import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import "./Modal.css";
import { invoke } from '@tauri-apps/api';

export default function CadastroCategoria({ onSetComponentModal, initialData = {} }) {
    const [data, setData] = useState(initialData);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(data);

        invoke("create_a_categoria", { data: data }).then((res) => {

            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
        

        onSetComponentModal(false);
    };

    return (
        <form className="form-cad" onSubmit={handleSubmit}>
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
            <Button fullWidth type="submit" variant="contained" color="primary">
                Enviar
            </Button>
        </form>
    );
}


