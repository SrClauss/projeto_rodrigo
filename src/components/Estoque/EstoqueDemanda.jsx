export default function EstoqueDemanda({estoquedemanda}){
    if (estoquedemanda === 0){
        return(
            <>
            <div className="estoque">Estoque: {estoquedemanda}</div>
            </>
        )
    }
    if (estoquedemanda > 0 ){
        return(
            <div className="estoque estoque-demanda-positivo">Estoque: {estoquedemanda}</div>
        )
    }
    if (estoquedemanda < 0){
        return(
            <div className="estoque estoque-demanda-negativo">Demanda: {estoquedemanda}</div>
        )
    }
}