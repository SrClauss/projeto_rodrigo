import React, { useState } from 'react'

export default function CadastroPedidos({ onSetComponentModal, initialData = {} }) {

    const [data, setData] = useState({ ...initialData, itens: initialData.itens || [] })
    return (
        <>
        <div className="title">Cadastro de Pedidos</div>
        </>

    )

}