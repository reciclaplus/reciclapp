import { Button, FormControl, FormLabel } from "@material-ui/core";
import { useState, useContext } from "react";
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import { makeStyles } from '@material-ui/core/styles';
import {download, createMapURL} from "./StaticMap"
import { PdrContext } from '../context/PdrContext';
import { TownContext } from '../context/TownContext';
import { conf } from '../configuration';

const useStyles = makeStyles((theme) => ({

    content: {
      paddingTop: theme.spacing(2),
      paddingLeft: theme.spacing(2)
    },

  
  }));



export default function DownloadMap(props){

    const classes = useStyles()
    const { pdr, setPdr } = useContext(PdrContext);
    const {town, setTown} = useContext(TownContext)

    var barrios = []  
    conf[town].barrios.forEach((barrio) => { barrios.push(barrio.nombre) })

    const [barrio, setBarrio] = useState("")
    

    function handleSubmit(event) {
        event.preventDefault();
        var center = ""
        console.log(center)
        conf[town].barrios.map(item => {
            if (item.nombre === barrio){
                center = item.center
            }
            
          })
          console.log(center)
          download(createMapURL(pdr, barrio, center))
        return false;
        // 
    }
    return (
        <form onSubmit={handleSubmit} className={classes.content}>
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
                <div>
                <Button variant="contained" color="primary" type="submit">
                    Descargar mapa
                </Button>
            </div>
        </form>
    )

}