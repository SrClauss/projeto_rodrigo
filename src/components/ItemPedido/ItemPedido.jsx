import { Spa } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search'
import './ItemPedido.css';
import { IconButton, Paper, InputBase, FormControl, Select, MenuItem } from '@mui/material';
import { useState } from 'react';
import ProductSearch from '../GeneralSearch/ProductSearch';


export default function ItemPedido({ onRemove, onAdd }) {
    const [search, setSearch] = useState("");
    return (
        <div>
            <div>
                <ProductSearch onSubmitSearch={(search) => console.log(search)} />

                
            </div>




        </div>
    )
}


/*
  pub id: ObjectId,
    pub item_produto_id: ObjectId,
    pub quantidade: i32,
    pub desconto: f64

*/