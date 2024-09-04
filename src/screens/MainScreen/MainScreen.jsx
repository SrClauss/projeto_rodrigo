import { AdminPanelSettingsSharp, Agriculture, CalendarMonth, ExitToAppSharp, InfoSharp, PersonAdd, PersonAddAlt, SettingsSuggest, ShoppingBasket, Store, Warehouse } from "@mui/icons-material";
import "./MainScreen.css";
import Modal from "../../modals/Modal";
import { useEffect, useState } from "react";
import CadastroCliente from "../../modals/CadastroCliente";
import SearchButton from "../../components/SearchButton/SearchButton";
import { NavigationContext } from "../../NavigationContext";
import React from "react";
import CadastroFornecedor from "../../modals/CadastroFornecedor";
import CardClientes from "../../components/CardClientes/CardClientes";
import { Button, Card } from "@mui/material";
import { invoke } from "@tauri-apps/api";
import CadastroPedidos from "../../modals/CadastroPedidos";
export default function MainScreen({ privilege }) {
    const [showModal, setShowModal] = useState(false);
    const [componentModal, setComponentModal] = useState(null);
    const { setActiveScreen } = React.useContext(NavigationContext);
    const [criterio, setCriterio] = useState("Cliente");
    const handleModal = () => {
        setShowModal(true);
        setComponentModal(componentModal);
    }
    const [pessoa, setPessoa] = useState([])
    useEffect(() => {

    }, [pessoa])
    const handleConfigScreen = () => {

        setActiveScreen("AdminScreen");

    }

    const handleEntradaEstoque = () => {
        setActiveScreen("CadastroEntradaEstoque")
    }
    const handleSubmitSearch = (key) => {

        if (criterio === "Cliente") {
            invoke("find_cliente_by_substring_name", { nameSubstring: key }).then((response) => {

                setPessoa(response)

            }).catch((error) => {
                console.log(error)
            })
        }


        if (criterio === "Fornecedor") {
            invoke("find_fornecedor_by_substring_name", { nameSubstring: key }).then((response) => {

                setPessoa(response)
            }).catch((error) => {
                console.log(error)
            })
        }

    }
    const handleCreatePedido = (cliente) => {

        handleModal();
        setComponentModal(<CadastroPedidos cliente={cliente} />)

    }



    return (


        <>
            <div>
                <div className="main-screen">

                    <div className="left-menu">

                        <button
                            onClick={() => {
                                handleModal();
                                setComponentModal(<CadastroCliente />);
                            }}

                        >
                            <div><PersonAddAlt /></div>
                            <div className="label-button">Cadastrar Cliente</div>
                        </button>
                        <button
                            onClick={() => {
                                handleModal();
                                setComponentModal(<CadastroFornecedor />);
                            }}>
                            <div><Agriculture /></div>
                            <div className="label-button">Cadastrar Fornecedor</div>
                        </button>

                        <button>
                            <div><CalendarMonth /></div>
                            <div className="label-button">Pedidos Recorrentes</div>
                        </button>


                        <button
                            onClick={() => {
                                handleEntradaEstoque();
                            }}


                        >
                            <div><Warehouse /></div>
                            <div className="label-button">Entrada de Estoque</div>
                        </button>
                        <button>
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

                                {pessoa.length != 0 &&
                                    <div className="button-limpar">
                                        <Button
                                            onClick={() => setPessoa([])}
                                        >Limpar</Button>
                                    </div>
                                }
                                {


                                    pessoa.map((pessoa, index) => {
                                        return <CardClientes key={index} pessoa={pessoa} onCreatePedido={handleCreatePedido} />
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