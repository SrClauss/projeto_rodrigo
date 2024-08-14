import { Select, FormControl, MenuItem, InputLabel, Paper, IconButton, InputBase } from '@mui/material';
import { useState } from 'react';
import Person2 from '@mui/icons-material/Person2';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchButton({ onSubmitSearch }) {

  const [criterio, setCriterio] = useState("Cliente");

  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "auto" }}
    >
      <IconButton sx={{ p: '10px' }} aria-label="menu">
        <Person2 />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={`Pesquisar por ${criterio}`}
        inputProps={{ 'aria-label': 'search google maps' }}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <FormControl>
        <Select
          defaultValue={"Cliente"}
          size='small'
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={criterio}
          onChange={(e) => setCriterio(e.target.value)} // Corrigido para onChange
        >
          <MenuItem value={"Cliente"}>Cliente</MenuItem>
          <MenuItem value={"Usuario"}>Usuario</MenuItem>
          <MenuItem value={"Fornecedor"}>Fornecedor</MenuItem>
          <MenuItem value={"Produto"}>Produto</MenuItem>
        </Select>
      </FormControl>
    </Paper>
  );
}