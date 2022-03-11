import { Button, FormControl, FormLabel } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';
import { makeStyles } from '@mui/styles';
import { useState, useContext } from "react";
import { PdrContext } from '../context/PdrContext';
import { TownContext } from "../context/TownContext";
import DatePicker from "./DatePicker";
import RadioButtonsGroup from "./RadioButtonsGroup";
import { conf } from "../configuration";

const useStyles = makeStyles((theme) => ({

    radioButtonGroup: {
        marginBottom: theme.spacing(3)
    }
  
  }));

export function getWeekNumber(d) {

// Copy date so don't modify original
d = new Date(+d);

d.setHours(0, 0, 0, 0);
// Set to nearest Thursday: current date + 4 - current day number
// Make Sunday's day number 7
d.setDate(d.getDate() + 4 - (d.getDay() || 7));
// Get first day of year
var yearStart = new Date(d.getFullYear(), 0, 1);
// Calculate full weeks to nearest Thursday
var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
// Return array of year and week number

return weekNo;
}

export default function PasarPuntos(){

    const { pdr, setPdr } = useContext(PdrContext);
    const {town, setTown} = useContext(TownContext)

    const classes = useStyles();
    const currentDate = new Date();

    const [barrio, setBarrio] = useState("")
    const [fecha, setFecha] = useState(currentDate)
    const [semana, setSemana] = useState(getWeekNumber(currentDate))
    const recogida = pdr
    var barrios = []
    conf[town].barrios.forEach((barrio) => { barrios.push(barrio.nombre) })
    
    
      function pasarPunto(barrio, id, year, week, value) {
        recogida.forEach((el)=>{
            let alreadyChanged = false
            if (el.barrio === barrio && el.id === id) {
                el.recogida.forEach((diaDeRecogida) => {
                    if (diaDeRecogida.year === year && diaDeRecogida.week === week) {
                        diaDeRecogida.wasCollected = value
                        alreadyChanged = true
                        console.log("changing existing value")
                        console.log(alreadyChanged)
                    }
                })
                    
                if (!alreadyChanged) {
                    console.log("adding new value")
                    el.recogida.push({"year":year, "week": week, "wasCollected": value})
                    alreadyChanged = true
                }                
            }
            })
      }


      function datePickerDate(event) {
          var dateString = event.target.value
          var d = new Date(+dateString.substring(0,4), +dateString.substring(5,7)-1, +dateString.substring(8,10))
          
          return d
      }

      function handleSubmit(event) {
        event.preventDefault();
        window.confirm("Recuerda guardar todos los cambios")
        setPdr(recogida)
        console.log(recogida)
        return false;
      }

    return (
        <form onSubmit={handleSubmit}>
            <DatePicker defaultDate={fecha} onChange={(event) => {setSemana(getWeekNumber(datePickerDate(event))); setFecha(datePickerDate(event))}}/>
            <div>
                <FormControl>
                    <InputLabel>Barrio</InputLabel>
                    <NativeSelect
                    inputProps={{
                    name: 'barrio',
                    id: 'barrio',
                    }}
                    id="barrio-select"
                    value={barrio}
                    onChange={(event) => setBarrio(event.target.value)}
                    >
                    <option value=""></option>
                    {barrios.map(item => {
                        return (<option value={item} key={item}>{item}</option>);
                    })}
                    </NativeSelect>
                </FormControl>
            </div>
        <br/>
        <FormControl component="fieldset">
            {pdr.map((element, index) => 
            { 
                if (element.barrio === barrio){
                return (
                <div key={index} className={classes.radioButtonGroup}>
                    <FormLabel component="legend">{element.nombre} - {element.descripcion}</FormLabel>
                    <RadioButtonsGroup onChange={pasarPunto} barrio={element.barrio} id={element.id} year={fecha.getFullYear()} week={semana} />
                </div>)
                }
                else{
                    return <div></div>
                }
            }

            )}
        </FormControl>
        <br/>
      <div>
      <Button variant="contained" color="primary" type="submit">
        Pasar esos puntos
      </Button>
      </div>
        </form>
    )
}