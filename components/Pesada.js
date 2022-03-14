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
import { getWeekNumber } from "./PasarPuntos";

const useStyles = makeStyles((theme) => ({

    radioButtonGroup: {
        marginBottom: theme.spacing(3)
    }
  
  }));


export default function Pesada(){

    const {town, setTown} = useContext(TownContext)
    const {weight, setWeight} = useContext(WeightContext)

    const classes = useStyles();
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

    function handleSubmit(event) {
        event.preventDefault();
        window.confirm("Recuerda guardar todos los cambios")
        
        var newWeight = weight
        newWeight.push({"year": fecha.getFullYear(), "week": getWeekNumber(fecha), "material": material, "peso": Number(peso)})
        setWeight(newWeight)
        
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