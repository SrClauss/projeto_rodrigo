
import React, { useEffect } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useState } from 'react';
export default function MultiSelectDiasSemanaMes({ label, onSubmitData }) {
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
                    <MenuItem value={11}>1º Domingo</MenuItem>
                    <MenuItem value={21}>2º Domingo</MenuItem>
                    <MenuItem value={31}>3º Domingo</MenuItem>
                    <MenuItem value={41}>4º Domingo</MenuItem>
                    <MenuItem value={12}>1ª Segunda-Feira</MenuItem>
                    <MenuItem value={22}>2ª Segunda-Feira</MenuItem>
                    <MenuItem value={32}>3ª Segunda-Feira</MenuItem>
                    <MenuItem value={42}>4ª Segunda-Feira</MenuItem>
                    <MenuItem value={13}>1ª Terça-Feira</MenuItem>
                    <MenuItem value={23}>2ª Terça-Feira</MenuItem>
                    <MenuItem value={33}>3ª Terça-Feira</MenuItem>
                    <MenuItem value={43}>4ª Terça-Feira</MenuItem>
                    <MenuItem value={14}>1ª Quarta-Feira</MenuItem>
                    <MenuItem value={24}>2ª Quarta-Feira</MenuItem>
                    <MenuItem value={34}>3ª Quarta-Feira</MenuItem>
                    <MenuItem value={44}>4ª Quarta-Feira</MenuItem>
                    <MenuItem value={15}>1ª Quinta-Feira</MenuItem>
                    <MenuItem value={25}>2ª Quinta-Feira</MenuItem>
                    <MenuItem value={35}>3ª Quinta-Feira</MenuItem>
                    <MenuItem value={45}>4ª Quinta-Feira</MenuItem>
                    <MenuItem value={16}>1ª Sexta-Feira</MenuItem>
                    <MenuItem value={26}>2ª Sexta-Feira</MenuItem>
                    <MenuItem value={36}>3ª Sexta-Feira</MenuItem>
                    <MenuItem value={46}>4ª Sexta-Feira</MenuItem>
                    <MenuItem value={17}>1º Sábado</MenuItem>
                    <MenuItem value={27}>2º Sábado</MenuItem>
                    <MenuItem value={37}>3º Sábado</MenuItem>
                    <MenuItem value={47}>4º Sábado</MenuItem>







                </Select>

            </FormControl>
            <Button variant='text' onClick={(e) => { setValues([]) }}>Limpar</Button>
        </div>
    )




}