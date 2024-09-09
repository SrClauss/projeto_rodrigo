import { Button, IconButton, TextField } from "@mui/material"
import './CardUpdatePrecos.css'
import { InputAdornment } from "@mui/material"
import { useEffect, useState } from "react"
import { DeleteForever } from "@mui/icons-material"
const couve = {
  "_id": {
    "$oid": "66dc5d79b7a26c425307a860"
  },
  "nome": "Couve",
  "categoria_id": {
    "$oid": "66dc5968b7a26c425307a854"
  },
  "preco_compra": 2,
  "preco_venda": 3,
  "unidade": "KG",
  "estoque_demanda": 0
}


export default function CardUpdatePrecos({ produto = couve, onUpdatePreco, onDeleteProduto }) {

  const [precoCompra, setPrecoCompra] = useState(produto.preco_compra);
  const [precoVenda, setPrecoVenda] = useState(produto.preco_venda);

  useEffect(() => {
    onUpdatePreco({
      id: produto._id.$oid,
      preco_compra: precoCompra,
      preco_venda: precoVenda
    })}, [precoCompra, precoVenda])
  
  return (
    <>
      <div className="card-container">
        <div className="id">
          <div>{produto._id.$oid}</div>
        </div>
        <div className="flex-row">
          <div className="nome-produto">{produto.nome}</div>

          <div className="controles">

            <TextField
              size="small"
              type="number"
              label="Preço de Compra"
              value={precoCompra}
              InputProps={
                {
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>
                }
              }
              onChange={(e) => setPrecoCompra(e.target.value)} />
            <TextField

              type="number"
              size="small"
              label="Preço de Venda"
              value={precoVenda}
              onChange={(e) => setPrecoVenda(e.target.value)}
              InputProps={
                {
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>
                }
              }
            />
            <IconButton onClick = {() => handleDeleteProduto(produto._id.$oid)} >
              <DeleteForever sx={
                {
                  color: 'red',
                  fontSize: 30
                }
              } />
            </IconButton>
          </div>
        </div>
      </div>


    </>
  )
}

