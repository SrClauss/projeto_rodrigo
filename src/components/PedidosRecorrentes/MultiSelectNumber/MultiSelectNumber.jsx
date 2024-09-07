
import React, { useEffect } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useState } from 'react';
export default function MultiSelectNumber({ label, minValue, maxValues, onSubmitData }) {
    const [values, setValues] = useState([]);

    useEffect(() => {
        onSubmitData(values)


    }, values)

    const handleChange = (event) => {
        setValues(event.target.value);
    };

    return (
        <div className='two-columns'>
            <FormControl fullWidth>
                <InputLabel>{label}</InputLabel>
                <Select
                    multiple
                    value={values}
                    onChange={handleChange}
                    label={label}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                '& .Mui-selected': {
                                    backgroundColor: '#d1ffd0', // Cor de fundo para itens selecionados
                                },
                                '& .Mui-selected:hover': {
                                    backgroundColor: '#d1ffd0', // Cor de fundo para itens selecionados ao passar o mouse
                                },
                            },
                        },
                    }}
                >
                    {Array.from({ length: maxValues }, (_, i) => i + minValue).map((value) => (
                        <MenuItem key={value} value={value}>
                            {value}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button variant='text' onClick={() => setValues([])}>Limpar</Button>
        </div>
    )

}