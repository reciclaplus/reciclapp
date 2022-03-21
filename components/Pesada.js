import { Button, FormControl, FormLabel } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';
import { makeStyles } from '@mui/styles';
import { useState, useContext } from "react";
import { PdrContext } from '../context/PdrContext';
import { WeightContext } from "../context/WeightContext";
import { TownContext } from "../context/TownContext";
import DatePicker from "./DatePicker";
import { conf } from "../configuration";
import { TextField } from "@mui/material";
import { getMonday } from "../utils/dates"


export default function Pesada(){

    const {weight, setWeight} = useContext(WeightContext)

    const currentDate = new Date();

    const [material, setMaterial] = useState("")
    const [fecha, setFecha] = useState(currentDate)
    const [peso, setPeso] = useState(0)

    var materiales = ["pet", "galones", "plastico duro", "carton"]
    
    function datePickerDate(event) {
        var dateString = event.target.value
        var d = new Date(+dateString.substring(0,4), +dateString.substring(5,7)-1, +dateString.substring(8,10))        
        return d
    }

    function dateExists(obj){
        return obj.date == getMonday(fecha).toLocaleDateString()
    }

    function handleSubmit(event) {
        event.preventDefault();
        
        if (weight.some(dateExists)){
            for (let i = 0; i < weight.length; i++) {
                if (weight[i].date == getMonday(fecha).toLocaleDateString()) {
                    weight[i][material] += Number(peso)
                }
            }
        }
        else{
            var newWeight = {"dateStr": getMonday(fecha).toLocaleDateString(), "date": getMonday(fecha), pet: 0, galones: 0, plasticoduro: 0, carton: 0}
            newWeight[material] += Number(peso)
            weight.push(newWeight)
        }
        
        return false;
    }

    return (
        <form onSubmit={handleSubmit}>
            <DatePicker defaultDate={fecha} onChange={(event) => {setFecha(datePickerDate(event))}}/>
            <div>
                <FormControl sx={{my:1}}>
                    <InputLabel>Material</InputLabel>
                    <NativeSelect
                    inputProps={{
                    name: 'material',
                    id: 'material',
                    }}
                    id="material-select"
                    value={material}
                    onChange={(event) => setMaterial(event.target.value)}
                    >
                    <option value=""></option>
                    {materiales.map(item => {
                        return (<option value={item} key={item}>{item}</option>);
                    })}
                    </NativeSelect>
                </FormControl>
            </div>
        <br/>
        <TextField
                id="peso"
                label="Peso (lb)"
                type="number"
                name="peso"
                sx={{my:1}}
                onChange={(event) => setPeso(event.target.value)}>                
            
        </TextField>
        <br/>
      <div>
      <Button variant="contained" color="primary" type="submit">
        Añadir
      </Button>
      </div>
        </form>
    )
}