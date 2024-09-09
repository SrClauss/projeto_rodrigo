
import {
    FormControlLabel,
    FormControl,
    TextField,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Button
} from '@mui/material';
import { useState } from 'react';
import './PedidosRecorrentes.css';
import { useEffect } from 'react';
import MultiSelectNumber from './MultiSelectNumber/MultiSelectNumber';
import MultiSelectDiasSemanaMes from './MultiSelectDiasSemanaMes/MultiSelectDiasSemanaMes';

export default function PedidosRecorrentes({onSubmitData}) {
    const [value, setValue] = useState('');
    const [weekDay, setWeekDay] = useState([]);
    const [monthDay, setMonthDay] = useState('');
    const [interval, setInterval] = useState('');
    const [weekMonth, setWeekMonth] = useState('');
    useEffect(() => {
        onSubmitData({
            
            value,
            weekDay,
            monthDay,
            interval,
            weekMonth})


    }, [value, weekDay, monthDay, interval, weekMonth])

    return (
        <div className='center-root'>

            <div className="root-recorrente">
                <InputLabel className="label-recorrente">Tipo de Recorrencia</InputLabel>
                <RadioGroup
                    className="radio-recorrente" row
                    aria-label="position"
                    name="position"
                    defaultValue="top"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                >
                    <div className='two-columns'>
                        <FormControlLabel value="semanal" control={<Radio />} label="Semanal" />
                        <FormControlLabel value="mensal" control={<Radio />} label="Mensal" />
                        <FormControlLabel value="porIntervalo" control={<Radio />} label="Por Período" />
                        <FormControlLabel value="semanalMensal" control={<Radio />} label="Semanal/Mensal" />
                    </div>
                </RadioGroup>



                {
                    value == 'semanal' &&
                    <FormControl fullWidth>
                    <div className='two-columns'>
                    <InputLabel>Dia da Semana</InputLabel>
                
                        <Select
                            fullWidth
                            label="Dia da Semana"
                            value={weekDay}
                            onChange={(e) => setWeekDay(e.target.value)}
                            multiple
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

                            <MenuItem value={1}>Domingo</MenuItem>
                            <MenuItem value={2}>Segunda</MenuItem>
                            <MenuItem value={3}>Terça</MenuItem>
                            <MenuItem value={4}>Quarta</MenuItem>
                            <MenuItem value={5}>Quinta</MenuItem>
                            <MenuItem value={6}>Sexta</MenuItem>
                            <MenuItem value={7}>Sábado</MenuItem>
                        </Select>
                        <Button variant='text' onClick={() => setWeekDay([])}>Limpar</Button>
                        </div>
                    </FormControl>
                }
                {
                    value == 'mensal' &&
                    <MultiSelectNumber label="Dia do Mês" minValue={1} maxValues={31}  onSubmitData={setMonthDay} />
                }
                {
                    value == 'porIntervalo' &&

                    <FormControl fullWidth>
                       
                        <TextField label="Intervalo de dias" type="number" value={interval} onChange={(e)=>{setInterval([e.target.value])}} />
                    </FormControl>
                }


                {value == 'semanalMensal' &&

                    <FormControl fullWidth>
                        <MultiSelectDiasSemanaMes label="Recorrencias Semanais Mensais" onSubmitData={setWeekMonth} />
                    </FormControl>

                }


            </div>
        </div>
    )
}