import { TextField, Button, Card } from "@mui/material"
import "./Modal.css"
import AdressCard from "../components/AdressCard/AdressCard"
import { useEffect, useState } from "react"
import CadastroEnderecos from "./CadastroEnderecos"
import { invoke } from "@tauri-apps/api"
import { maskTelefone, maskCpfCnpj } from "../frontend/utils"

export default function UpdateFornecedor({ onSetComponentModal, onSetTabOrders, initialData, onCleanPesquisa }) {
    const [data, setData] = useState({

        id: initialData._id.$oid,
        nome: initialData.nome, 
        email: initialData.email,
        telefone: initialData.telefone,
        cpf_cnpj: initialData.cpf_cnpj,
        data_criacao: initialData.data_criacao,
        enderecos: initialData.enderecos
    })
    

    const handleSaveData = (data) => {
        invoke("update_fornecedor", { data: data }).then((res) => {
            console.log(res)

        }).catch((err) => {
            console.log(err)
        })
        onSetTabOrders([1, 2, 3, 4, 5, 6]);
        onSetComponentModal(null)
        onCleanPesquisa()

    }
    const [showAdress, setShowAdress] = useState(false);
    const handleSubmitEndereco = (endereco) => {

        setData({ ...data, enderecos: [...data.enderecos, endereco] });
        setShowAdress(false);
    }


    return (

        <>

            {!showAdress ?
                (
                    <div>

                        <div className="title">Cadastro de Fornecedores</div>
                        <div className="form-cad">
                            <TextField
                                fullWidth size="small"
                                label="Nome"
                                value={data.nome}
                                onChange={(e) => setData({ ...data, nome: e.target.value })}
                            />

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
                                    value={maskTelefone(data.telefone)}
                                    onChange={(e) => setData({ ...data, telefone: e.target.value })}
                                />
                            </div>
                            <div className="two-columns">
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="CPF/CNPJ"
                                    value={maskCpfCnpj(data.cpf_cnpj)}
                                    onChange={(e) => setData({ ...data, cpf_cnpj: e.target.value })}
                                />
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Data de Criação"
                                    value={data.data_criacao}
                                    onChange={(e) => setData({ ...data, data_criacao: e.target.value })}
                                />
                            </div>
                            <div className="two-columns">
                                <Button
                                    onClick={() => setShowAdress(true)}
                                    variant="contained"
                                    color="primary"
                                >
                                    Adicionar Endereço
                                </Button>
                                <Button
                                    onClick={() => handleSaveData(data)}
                                    variant="contained"
                                    color="primary"
                                >
                                    Salvar
                                </Button>
                            </div>
                            <AdressCard
                                adresses={data.enderecos}
                                onAddAdress={() => setShowAdress(true)}
                                onDeleteAdress={(index) => {
                                    const newAdresses = data.enderecos.filter((_, i) => i !== index);
                                    setData({ ...data, enderecos: newAdresses });
                                }}
                            />
                        </div>
                    </div>
                ) : <CadastroEnderecos onSubmitEndereco={(e) => handleSubmitEndereco(e)} />
            }
        </>
    )


}

