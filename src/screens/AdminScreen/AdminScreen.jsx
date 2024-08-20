import { AdminPanelSettingsSharp, Agriculture, ArrowBack, BackHandRounded, CalendarMonth, Category, ExitToAppSharp, Fastfood, InfoSharp, PersonAdd, PersonAddAlt, PersonAddAlt1TwoTone, ProductionQuantityLimits, ProductionQuantityLimitsSharp, SettingsSuggest, ShoppingBasket, Spa, Store, VerifiedUserSharp } from "@mui/icons-material";
import "../MainScreen/MainScreen.css";
import Modal from "../../modals/Modal";
import { useState } from "react";
import CadastroCliente from "../../modals/CadastroCliente";
import { NavigationContext } from "../../NavigationContext";
import React from "react";
import CadastroCategoria from "../../modals/CadastroCategoria";
import CadastroProdutos from "../../modals/CadastroProdutos";

export default function AdminScreen({ privilege }) {

    const { setActiveScreen } = React.useContext(NavigationContext);
    const [showModal, setShowModal] = useState(false);
    const [componentModal, setComponentModal] = useState(null);

    const handleModal = () => {
        setShowModal(true);
        setComponentModal(componentModal);




    }
    const handleMainScreen = () => {

        setActiveScreen("MainScreen");

    }
    return (


        <>
            <div>
                <div className="main-screen">
                        
                    <div className="left-menu">
                        <button
                            onClick={() => {
                                handleModal();
                                setComponentModal(<CadastroCategoria />);
                            }}

                        >
                            <div><Category /></div>
                            <div className="label-button">Cadastrar Categoria</div>
                        </button>
                        <button>
                            <div><PersonAddAlt1TwoTone /></div>
                            <div className="label-button">Cadastrar Usuário</div>
                        </button>
                        <button
                            onClick={() => {
                                handleModal();
                                setComponentModal(<CadastroProdutos />);
                            }}
                        >
                            <div><Spa /></div>
                            <div className="label-button">Cadastrar Produtos</div>
                        </button>
                        <button onClick={handleMainScreen}>
                            <div><ArrowBack /></div>
                            <div className="label-button">Voltar</div>
                        </button>


                    </div>
                    <Modal show={showModal} onClose={() => setShowModal(false)} component={componentModal} />
                    <div className="content">

                        <div className="barra-pesquisa">



                        </div>
                    </div>


                </div>


            </div>
        </>
    )
}