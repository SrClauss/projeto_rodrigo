
import { TextField, Button, Card } from "@mui/material"
import "./Modal.css"
import AdressCard from "../components/AdressCard/AdressCard"
import { useEffect, useState } from "react"
import CadastroEnderecos from "./CadastroEnderecos"
import Modal from "./Modal"
import { invoke } from "@tauri-apps/api"

export default function CadastroFornecedor({ onSetComponentModal, initialData = {} }) {

    const [data, setData] = useState(initialData)
    const handleSaveData = (data) => {
        console.log(data)
        invoke("create_a_fornecedor", { data: data }).then((res) => {
            console.log(res)

        }).catch((err) => {
            console.log(err)
        })

    }
    const [showAdress, setShowAdress] = useState(false);
    const handleSubmitEndereco = (endereco) => {
        setData({ ...data, enderecos: [...data.enderecos, endereco] });
        setShowAdress(false);
    }

    return (
      
                <>
                    <div className="title">Cadastro de Fornecedores</div>
                    <div className="form-cad">
                        <TextField
                            fullWidth size="small"
                            label="Nome"
                            value={data.nome}
                            onChange={(e) => setData({ ...data, nome: e.target.value })}
                        />
                    </div>
                    <div className="two-columns">
                        <TextField
                            fullWidth
                            size="small"
                            type="email"
                            label="Email"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            size="small"
                            label="Telefone"
                            value={data.telefone}
                            onChange={(e) => setData({ ...data, telefone: e.target.value })}
                        />
                    </div>

                    <div className="two-columns">
                        <TextField
                            fullWidth
                            size="small"
                            label="CNPJ"
                            value={data.cnpj}
                            onChange={(e) => setData({ ...data, cnpj: e.target.value })}

                        />
                        <TextField
                            fullWidth
                            size="small"
                            type="date"
                            label="Data de Criação"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={data.data_criacao}
                            onChange={(e) => setData({ ...data, data_criacao: e.target.value })}
                        />

                        <AdressCard adresses={data.enderecos || []} onAddAdress={(_) => setShowAdress(!showAdress)} onDeleteAdress={ 
                            (index) => {
                                const newEnderecos = data.enderecos.filter((_, i) => i !== index)
                                setData({ ...data, enderecos: newEnderecos })
                            }
                        } />
                    </div>
                    <Button onClick={(_) => handleSaveData(data)} fullWidth variant="contained">Salvar</Button>
                </>

                    )
   



/*
pub struct Fornecedor {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub nome: String,
    pub cnpj: String,
    pub enderecos: Vec<Endereco>,
    pub telefone: String,
    pub email: String,
    pub data_criacao: String,
}

    return (

        <>

            {!showAdress ?
                (
                    <div>

                            <div className="two-columns">
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="email"
                                    label="Email"
                                    value={data.email}
                                    onChange={(e) => setData({ ...data, email: e.target.value })}
                                />
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Telefone"
                                    value={data.telefone}
                                    onChange={(e) => setData({ ...data, telefone: e.target.value })}
                                />
                            </div>

                            <div className="two-columns">
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="CPF/CNPJ"
                                    value={data.cpf_cnpj}
                                    onChange={(e) => setData({ ...data, cpf_cnpj: e.target.value })}

                                />
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="date"
                                    label="Data de Nascimento"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={data.data_nascimento}
                                    onChange={(e) => setData({ ...data, data_nascimento: e.target.value })}
                                />
                            </div>
                            <AdressCard adresses={data.enderecos||[]} onAddAdress={(_) => setShowAdress(!showAdress)} onDeleteAdress={
                                (index) => {
                                    const newEnderecos = data.enderecos.filter((_, i) => i !== index)
                                    setData({ ...data, enderecos: newEnderecos })
                                }
                            } />


                            <Button onClick={(_) => handleSaveData(data)} fullWidth variant="contained">Salvar</Button>



                        </div>
                    </div>
                ) :
                <CadastroEnderecos onSubmitEndereco={(e) => handleSubmitEndereco(e)} />
            }
        </>
    )
}

*/