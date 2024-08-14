import { AdminPanelSettingsSharp, Agriculture, CalendarMonth, ExitToAppSharp, InfoSharp, PersonAdd, PersonAddAlt, SettingsSuggest, ShoppingBasket, Store } from "@mui/icons-material";
import "./MainScreen.css";
import Modal from "../../modals/Modal";
import { useState } from "react";
import CadastroCliente from "../../modals/CadastroCliente";
import SearchButton from "../../components/SearchButton/SearchButton";
import { NavigationContext } from "../../NavigationContext";
import React from "react";

export default function MainScreen({ privilege}) {
    const [showModal, setShowModal] = useState(false);
    const [componentModal, setComponentModal] = useState(null);
    const { setActiveScreen } = React.useContext(NavigationContext);
    const handleModal = () => {
        setShowModal(true);
        setComponentModal(componentModal);



    }

    const handleConfigScreen = () => {

        setActiveScreen("AdminScreen");

    }



    return (


        <>
            <div>
                <div className="main-screen">
                    <div className="content">

                        <div className="barra-pesquisa">
                        <SearchButton/>
           

                        </div>
                    </div>
                    <Modal show={showModal} onClose={() => setShowModal(false)} component={componentModal} />
                    <div className="right-menu">
                 
                        <button
                            onClick={() => {
                                handleModal();
                                setComponentModal(<CadastroCliente />);
                            }}

                        >
                            <div><PersonAddAlt /></div>
                            <div className="label-button">Cadastrar Cliente</div>
                        </button>
                        <button>
                            <div><Agriculture /></div>
                            <div className="label-button">Cadastrar Fornecedor</div>
                        </button>
                        <button>
                            <div><Store /></div>
                            <div className="label-button">Pedidos</div>
                        </button>
                        <button>
                            <div><CalendarMonth /></div>
                            <div className="label-button">Pedidos Recorrentes</div>
                        </button>

                        <button>
                            <div><ExitToAppSharp /></div>
                            <div className="label-button">Sair</div>
                        </button>
                        <button>
                            <div><InfoSharp /></div>
                            <div className="label-button">Sobre</div>
                        </button>
                        <button onClick={handleConfigScreen} >
                            <div><AdminPanelSettingsSharp/></div>
                            <div className="label-button" >Configurações</div>
                        </button>

                    </div>
                </div>


            </div>
        </>
    )
}