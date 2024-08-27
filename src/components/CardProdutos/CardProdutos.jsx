import { Divider } from "@mui/material"
import './CardProdutos.css'

export default function CardProdutos({ categorias, produto, onSelect }) {

    const getNomeCategoria = (produto) => {

        return categorias.find(categoria => categoria._id.$oid === produto.categoria_id.$oid).nome
    }
    return (
        <div className="card-produto" tabIndex={0}
            onClick={() => onSelect(produto)}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    onSelect(produto)
                }
            }}
        >

            <div className="card-content">
                <div className="left-col">{produto.nome}</div>
                <div className="center-col">{produto._id.$oid}</div>
                <div className="right-col">{getNomeCategoria(produto)}</div>
            </div>


        </div>
    )
}