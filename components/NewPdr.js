import React, { useState, useContext } from 'react';
// import SYmap from './SYmap';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Switch from '@mui/material/Switch';
import NativeSelect from '@mui/material/NativeSelect';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import NewPdrMap from './NewPdrMap';
import { TownContext } from '../context/TownContext';
import { PdrContext } from '../context/PdrContext';
import { conf } from '../configuration';
import { pdrExists } from '../utils/pdr-management'

export default function NewPdr(props) {
  
  const {town, setTown} = useContext(TownContext)
  const { pdr, setPdr } = useContext(PdrContext);

  const [state, setState] = useState({
    zafacon: false,
    barrio: "",
    nombre: "",
    descripcion:"",
    id: ""
  })

  const [newMarker, setNewMarker] = useState("")
  var barrios = []  
  conf[town].barrios.forEach((barrio) => { barrios.push(barrio.nombre) })


  function setNewId(barrio) {
    var allIds = []
    pdr.map((e) => {
      if (e.barrio === barrio) {
        return allIds.push(+e.id)
      }
      else{return allIds}
    })

    if (allIds.length > 0) {
      return (Math.max(...allIds) + 1)
    }
    
    return 1
  }

  function handleInputChange(event) {
    
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    setState({...state, [name]: value})
    if (name == "barrio"){
      setState({...state, ["id"]: setNewId(value), ["barrio"]: value})
    }
    if (name == "id"){
      pdrExists(state.barrio, value, pdr)
    }

  }

  function handleSubmit(event) {

    event.preventDefault();
    
    if (pdrExists(state.barrio, state.id, pdr)){
      alert("Id incorrecto")
      return
    }

    var newPdrs = pdr
    newPdrs.push({"nombre": state.nombre, "lat": newMarker.getPosition().lat(), "lng": newMarker.getPosition().lng(), "barrio": state.barrio, "zafacon": state.zafacon, "id": (state.id > 0) ? state.id : setNewId(state.barrio), "descripcion": state.descripcion, "recogida": []})
    setPdr(newPdrs)

    setState({
      zafacon: false,
      barrio: "",
      nombre: "",
      descripcion:"",
      id: ""
    })

    setNewMarker("")
    alert(`Nuevo punto: ${state.nombre} en ${state.barrio}` );
    return false;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
      
      <TextField required={true} id="nombre" label="Nombre" name="nombre" onChange={handleInputChange} value={state.nombre}/>
      
      </div>
      <br/>
      <div>
        <TextField id="descripcion" label="Descripción" name="descripcion" onChange={handleInputChange} value={state.descripcion}/>
      </div>
      <br/>
      <div>
      <FormControl required={true}>
        <InputLabel>Barrio</InputLabel>
        <NativeSelect
        inputProps={{
          name: 'barrio',
          id: 'age-native-simple',
        }}
          id="demo-simple-select"
          value={state.barrio}
          onChange={handleInputChange}
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
      <TextField
          required={true}
          id="id"
          label="Id"
          type="number"
          name="id"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleInputChange}
          value={state.id}
          error={pdrExists(state.barrio, state.id, pdr)}
          helperText={pdrExists(state.barrio, state.id, pdr) ? `Esta id ya existe en ${state.barrio}` : ""}
        />
      </div>
      <br/>
      <div>
      <FormControlLabel
        required={true}
        control={
          <Switch
            checked={state.zafacon}
            onChange={handleInputChange}
            name="zafacon"
            color="primary"
          />
        }
        label="Tiene zafacón?"
      />
      </div>
      <br/>
      <div>
      <TextField
        required={true}
        id="outlined-name"
        name="ubicacion"
        label="Ubicación"
        value={(newMarker !== "") ? 'OK' : ''}
        onChange={handleInputChange}
        helperText="Selecciona la ubicación en el mapa"
      />
      </div>
      <div>
        
        <NewPdrMap containerStyle={{width:'100%', height:'60%'}} setNewMarker={setNewMarker}/>
      
      </div>
      <br/>
      <div>
      <Button variant="contained" color="primary" type="submit" style={{"marginBottom": '20px'}}>
        Añadir punto
      </Button>
      </div>
    </form>
  );
}