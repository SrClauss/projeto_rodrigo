import { TextField, Button, Card } from "@mui/material"
import "./Modal.css"
import AdressCard from "../components/AdressCard/AdressCard"
import { useEffect, useState } from "react"
import CadastroEnderecos from "./CadastroEnderecos"
import { invoke } from "@tauri-apps/api"
import { maskTelefone, maskCpfCnpj } from "../frontend/utils"

export default function UpdateCliente({ onSetComponentModal, onSetTabOrders, initialData, onCleanPesquisa }) {
    const [data, setData] = useState({

        id: initialData._id.$oid,
        nome: initialData.nome, 
        email: initialData.email,
        telefone: initialData.telefone,
        cpf_cnpj: initialData.cpf_cnpj,
        data_nascimento: initialData.data_nascimento,
        enderecos: initialData.enderecos
    })


    useEffect(() => {
        console.log(initialData)
    }, [])







    const handleSaveData = (data) => {
        invoke("update_cliente", { data: data }).then((res) => {
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

                        <div className="title">Cadastro de Clientes</div>
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
                                    value={data.telefone}
                                    onChange={(e) => {
                                        if (e.target.value.length <= 11) {
                                            setData({ ...data, telefone: e.target.value })
                                        }
                                    }}

                                    onKeyDown={(e) => {
                                        if (
                                            !e.key.match(/[0-9]/) &&
                                            e.key !== 'Backspace' &&
                                            e.key !== 'Tab' &&
                                            e.key !== 'Shift' &&
                                            e.key !== 'ArrowLeft' &&
                                            e.key !== 'ArrowRight' &&
                                            e.key !== 'ArrowUp' &&
                                            e.key !== 'ArrowDown' &&
                                            e.key !== 'Delete'
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onFocus={
                                        (e) => {
                                            setData({ ...data, telefone: e.target.value.replace(/\D/g, '') })
                                        }
                                    }
                                    onBlur={
                                        (e) => {
                                            if (e.target.value.length != 10 && e.target.value.length != 11 && e.target.value.length != 0) {
                                                alert('Telefone inválido')
                                                setTimeout(() => {
                                                    e.target.focus()
                                                }, 100)
                                            }
                                            setData({ ...data, telefone: maskTelefone(e.target.value) })
                                        }
                                    }



                                />

                            </div>

                            <div className="two-columns">
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="text"
                                    label="CPF/CNPJ"
                                    value={data.cpf_cnpj}
                                    onChange={(e) => {
                                        if (e.target.value.length <= 14) {
                                            setData({ ...data, cpf_cnpj: e.target.value })
                                        }
                                    }
                                    }
                                    onKeyDown={(e) => {
                                        // Verifica se a tecla pressionada é uma letra ou símbolo
                                        if (
                                            !e.key.match(/[0-9]/) &&
                                            e.key !== 'Backspace' &&
                                            e.key !== 'Tab' &&
                                            e.key !== 'Shift' &&
                                            e.key !== 'ArrowLeft' &&
                                            e.key !== 'ArrowRight' &&
                                            e.key !== 'ArrowUp' &&
                                            e.key !== 'ArrowDown' &&
                                            e.key !== 'Delete'
                                        ) {
                                            e.preventDefault();
                                        }


                                    }}
                                    onBlur={

                                        (e) => {
                                            if (e.target.value.length != 14 && e.target.value.length != 11 && e.target.value.length != 0) {
                                                alert('CPF/CNPJ inválido')
                                                setTimeout(() => {

                                                    e.target.focus()
                                                }, 100)


                                            }

                                            setData({ ...data, cpf_cnpj: maskCpfCnpj(e.target.value) })

                                        }



                                    }

                                    onFocus={
                                        (e) => {
                                            setData({ ...data, cpf_cnpj: e.target.value.replace(/\D/g, '') })
                                        }
                                    }


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
                            <AdressCard adresses={data.enderecos} onAddAdress={(_) => setShowAdress(!showAdress)} onDeleteAdress={
                                (index) => {
                                    const newEnderecos = data.enderecos.filter((_, i) => i !== index)
                                    setData({ ...data, enderecos: newEnderecos })
                                }
                            } />


                            <Button onClick={(_) => handleSaveData(data)} fullWidth variant="contained">Salvar</Button>
                        


                        </div>
                    </div >
                ) :
                <CadastroEnderecos onSubmitEndereco={(e) => handleSubmitEndereco(e)} />
            }
        </>
    )
}
