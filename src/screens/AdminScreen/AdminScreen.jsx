import { AdminPanelSettingsSharp, Agriculture, ArrowBack, BackHandRounded, CalendarMonth, Category, ExitToAppSharp, Fastfood, InfoSharp, PersonAdd, PersonAddAlt, PersonAddAlt1TwoTone, ProductionQuantityLimits, ProductionQuantityLimitsSharp, SettingsSuggest, ShoppingBasket, Spa, Store, VerifiedUserSharp } from "@mui/icons-material";
import "../MainScreen/MainScreen.css";
import Modal from "../../modals/Modal";
import { useEffect, useState } from "react";
import CadastroCliente from "../../modals/CadastroCliente";
import { NavigationContext } from "../../NavigationContext";
import React from "react";
import CadastroCategoria from "../../modals/CadastroCategoria";
import CadastroProdutos from "../../modals/CadastroProdutos";
import AutoCompleteCliente from "../../components/AutoCompletePessoa/AutoCompleteCliente";

export default function AdminScreen({ privilege }) {

    const { setActiveScreen } = React.useContext(NavigationContext);
    const [showModal, setShowModal] = useState(false);
    const [componentModal, setComponentModal] = useState(null);
    const [tabOrders , setTabOrders] = useState([1,2,3,4]);
    useEffect(() => {
        console.log(tabOrders)
    }, [tabOrders])
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
                            tabIndex={tabOrders[0]}
                            onClick={() => {
                                handleModal();
                                setComponentModal(<CadastroCategoria />);
                            }}

                        >
                            <div><Category /></div>
                            <div className="label-button">Cadastrar Categoria</div>
                        </button>
                        <button
                            tabIndex={tabOrders[1]}
                            
                            
                        >
                            
                            <div><PersonAddAlt1TwoTone /></div>
                            <div className="label-button">Cadastrar Usuário</div>
                        </button>

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
                        <button
                            tabIndex={tabOrders[2]}
                            onClick={() => {
                                handleModal();
                                setComponentModal(<CadastroProdutos onSetTabOrders={setTabOrders} />);
                                setTabOrders([-1,-1,-1,-1]);
                            }}
                        >
                            <div><Spa /></div>
                            <div className="label-button">Cadastrar Produtos</div>
                        </button>
                        <button
                        tabIndex={tabOrders[3]}
                        onClick={handleMainScreen}>
                            <div><ArrowBack /></div>
                            <div className="label-button">Voltar</div>
                        </button>


                    </div>
              <Modal show={showModal} onClose={() => setShowModal(false)} component={componentModal} />
                   


                </div>


            </div>
        </>
    )
}