import { Button, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import './ProductSearch.css';
import { invoke } from '@tauri-apps/api';
import CardProdutos from '../CardProdutos/CardProdutos';


export default function ProductSearch({ onSubmitSearch, categorias }) {
    const [search, setSearch] = useState("");
    const [resultsVisible, setResultsVisible] = useState(false);
    const [results, setResults] = useState([]);

    useEffect(() => {
        console.log(results.length)
    }, [results])
    const handleSearch = (search) => {

        invoke("find_produto_by_substring_name", { nameSubstring: search }).then((response) => {

            setResults(response)
            setResultsVisible(true)
        }).catch((error) => {
            console.log(error)
        }
        )

    }
    const setLimparVisible = () => {
        if (results.length > 0) {
            return {
                display: 'flex',
                justifyContent: 'right',

            }
            
        }
        return{
            display: 'none'
        }
    }




    return (
        <div className='product'>
            <div style={setLimparVisible()}  >

                <Button onClick={() => {
                    setResults([])
                }}>Limpar</Button>
            </div>
            
            <div className='search'>
                <TextField
                    fullWidth
                    variant='outlined'
                    label="Pesquisar Produto"
                    className="input"
                    size='small'
                    placeholder="Pesquisar Produto"
                    inputProps={{ 'aria-label': 'search google maps' }}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {

                        if (e.key === "Enter") {
                            handleSearch(search)
                        }
                    }}
                />
                <IconButton
                    type="submit"
                    className="iconButton"
                    aria-label="search"
                    onClick={() => handleSearch(search)}
                >
                    <SearchIcon />
                </IconButton>
            </div>
            <div hidden={!resultsVisible} className='search-results'>
                {results.map((result, key) => {
                    return (

                        <>
                            <CardProdutos key={key} produto={result} categorias={categorias} onSelect={(e) => onSubmitSearch(e)} />

                        </>

                    )
                })}
            </div>

        </div>
    )
}