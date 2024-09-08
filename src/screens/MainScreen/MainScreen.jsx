import { AdminPanelSettingsSharp, Agriculture, CalendarMonth, ExitToAppSharp, InfoSharp, PersonAdd, PersonAddAlt, SettingsSuggest, ShoppingBasket, Store, Warehouse, WarehouseOutlined } from "@mui/icons-material";
import "./MainScreen.css";
import { useEffect, useState } from "react";
import SearchButton from "../../components/SearchButton/SearchButton";
import { NavigationContext } from "../../NavigationContext";
import React from "react";
import CardClientes from "../../components/CardClientes/CardClientes";
import CardFornecedor from "../../components/CardClientes/CardFornecedor";
import { Button } from "@mui/material";
import { invoke } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";
import Modal from "../../modals/Modal";
import UpdateCliente from "../../modals/UpdateCliente";
export default function MainScreen({ privilege }) {

    const { setActiveScreen } = React.useContext(NavigationContext);
    const [criterio, setCriterio] = useState("Cliente");
    const [pessoas, setPessoas] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [componentModal, setComponentModal] = useState(null);
    const [tabOrder, setTabOrder] = useState([0, 1, 2])
    const [tipoPessoa, setTipoPessoa] = useState("Cliente") 

    useEffect(() => {

    }, [pessoas])

    const handleConfigScreen = () => {

        setActiveScreen("AdminScreen");

    }

    const handleEntradaEstoque = () => {
        setActiveScreen("CadastroEntradaEstoque")
    }
    const handleSaidaEstoque = () => {
        setActiveScreen("CadastroSaidaEstoque")

    }
    const handleSubmitSearch = (key) => {

        if (criterio === "Cliente") {
            invoke("find_cliente_by_substring_name", { nameSubstring: key }).then((response) => {

                setPessoas(response)
                setTipoPessoa("Cliente")

            }).catch((error) => {
                console.log(error)
            })
        }


        if (criterio === "Fornecedor") {
            invoke("find_fornecedor_by_substring_name", { nameSubstring: key }).then((response) => {

                setPessoas(response)
                setTipoPessoa("Fornecedor")
            }).catch((error) => {
                console.log(error)
            })
        }

    }
    const handleCreatePedido = (cliente) => {

        setPessoas([cliente])
    }

    const handleDeleteCliente = (id) => {

        invoke("delete_cliente", { clienteId: id }).then((response) => {
            console.log(response)
            setPessoas([])
        }).catch((error) => {
            console.log(error)
        })
        setPessoas([])
    }
    const handleEditCliente = (pessoa) => {


    }
    return (


        <>
            <div>
                <div className="main-screen">

                    <div className="left-menu">




                        <button
                            tabIndex={tabOrder[0]}
                            onClick={() => {
                                handleSaidaEstoque();

                            }}

                        >

                            <div><WarehouseOutlined /></div>
                            <div className="label-button">Saída de Estoque</div>
                        </button>


                        <button
                            tabIndex={tabOrder[1]}
                            onClick={() => {
                                handleEntradaEstoque();
                            }}


                        >
                            <div><Warehouse /></div>
                            <div className="label-button">Entrada de Estoque</div>
                        </button>
                        <button
                            tabIndex={tabOrder[2]}
                            onClick={() => {
                                appWindow.close()

                            }}
                        >
                            <div><ExitToAppSharp /></div>
                            <div className="label-button">Sair</div>
                        </button>
                        <button onClick={handleConfigScreen} >
                            <div><AdminPanelSettingsSharp /></div>
                            <div className="label-button" >Configurações</div>
                        </button>

                    </div>

                    <Modal show={showModal} onClose={() => setShowModal(false)} component={componentModal} />
                    <div className="content">
                        <div className="barra-pesquisa">
                            <SearchButton onSubmitSearch={handleSubmitSearch} onSetCategory={(e) => setCriterio(e)} />


                            <div className="content-mutable">

                                {pessoas.length != 0 &&
                                    <div className="button-limpar">
                                        <Button
                                            onClick={() => setPessoas([])}
                                        >Limpar</Button>
                                    </div>
                                }
                                {

                                    tipoPessoa === "Cliente"?
                                    pessoas.map((pessoa, index) => {
                                        return <CardClientes
                                            key={index}
                                            pessoa={pessoa}

                                            onCreatePedido={handleCreatePedido}

                                            onDeleteCliente={handleDeleteCliente}

                                            onEditCliente={(cliente)=>{
                                          
                                                setComponentModal(<UpdateCliente initialData={cliente} onSetTabOrders={setTabOrder} onCleanPesquisa={setPessoas([])}/>)
                                                setShowModal(true)
                                                setTabOrder([-1, -1, -1])

                                            }}
                                            />
                                    })

                                    :
                                    pessoas.map((pessoa, index) => {
                                        return <CardFornecedor
                                            key={index}
                                            pessoa={pessoa}

                                            onCreatePedido={handleCreatePedido}

                                            onDeleteCliente={handleDeleteCliente}

                                           
                                            />

                                    })

                                }

                            </div>


                        </div>
                    </div>

                </div>


            </div>
        </>
    )
}