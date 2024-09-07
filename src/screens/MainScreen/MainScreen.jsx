import { AdminPanelSettingsSharp, Agriculture, CalendarMonth, ExitToAppSharp, InfoSharp, PersonAdd, PersonAddAlt, SettingsSuggest, ShoppingBasket, Store, Warehouse, WarehouseOutlined } from "@mui/icons-material";
import "./MainScreen.css";
import { useEffect, useState } from "react";
import SearchButton from "../../components/SearchButton/SearchButton";
import { NavigationContext } from "../../NavigationContext";
import React from "react";
import CardClientes from "../../components/CardClientes/CardClientes";
import { Button, Card } from "@mui/material";
import { invoke } from "@tauri-apps/api";

export default function MainScreen({ privilege }) {

    const { setActiveScreen } = React.useContext(NavigationContext);
    const [criterio, setCriterio] = useState("Cliente");
    const [pessoas, setPessoas] = useState([])
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

            }).catch((error) => {
                console.log(error)
            })
        }


        if (criterio === "Fornecedor") {
            invoke("find_fornecedor_by_substring_name", { nameSubstring: key }).then((response) => {

                setPessoas(response)
            }).catch((error) => {
                console.log(error)
            })
        }

    }
    const handleCreatePedido = (cliente) => {

      setPessoas([cliente])
    }



    return (


        <>
            <div>
                <div className="main-screen">

                    <div className="left-menu">

            
                     

                        <button
                            onClick={() => {
                                handleSaidaEstoque();
                                
                            }}
                        
                        >
                        
                            <div><WarehouseOutlined /></div>
                            <div className="label-button">Saída de Estoque</div>
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


                                    pessoas.map((pessoa, index) => {
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