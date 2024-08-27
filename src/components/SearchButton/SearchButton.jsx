import { Select, FormControl, MenuItem, InputLabel, Paper, IconButton, InputBase } from '@mui/material';
import { useState } from 'react';
import Person2 from '@mui/icons-material/Person2';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchButton({ onSubmitSearch, onSetCategory }) {

  const [criterio, setCriterio] = useState("Cliente");
  const [search, setSearch] = useState("");

  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "100%" }}
    >
      <IconButton sx={{ p: '10px' }} aria-label="menu">
        <Person2 color='primary' />
      </IconButton>
      <InputBase
        color='primary'
        sx={{ ml: 1, flex: 1 }}
        placeholder={`Pesquisar por ${criterio}`}
        inputProps={{ 'aria-label': 'search google maps' }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter'){ onSubmitSearch(search) }}}      />
      <IconButton onClick={()=>onSubmitSearch(search)} type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon  color='primary'/>
      </IconButton>
      <FormControl>
        <Select
          defaultValue={"Cliente"}
          size='small'
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={criterio}
          onChange={(e) => {setCriterio(e.target.value)
                            onSetCategory(e.target.value)
          }}
        >
          <MenuItem value={"Cliente"}>Cliente</MenuItem>
          <MenuItem value={"Fornecedor"}>Fornecedor</MenuItem>
        </Select>
      </FormControl>
    </Paper>
  );
}