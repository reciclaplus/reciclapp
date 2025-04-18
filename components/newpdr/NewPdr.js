import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputLabel from '@mui/material/InputLabel'
import NativeSelect from '@mui/material/NativeSelect'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import { useQueryClient } from '@tanstack/react-query'
import moment from 'moment'
import { useContext, useState } from 'react'
import { API_URL, conf } from '../../configuration'
import { TownContext } from '../../context/TownContext'
import { usePdr } from '../../hooks/queries'
import { pdrExists, setNewInternalId } from '../../utils/pdr-management'
import CustomAlert from '../CustomAlert'
import { MapsWrapper } from '../map/MapsWrapper'
import NewPdrMap from './NewPdrMap'

export default function NewPdr(props) {
  const { town } = useContext(TownContext)
  const categories = conf[town].categories
  const [state, setState] = useState({
    zafacon: false,
    barrio: '',
    comunidad: '',
    nombre: '',
    descripcion: '',
    id: '',
    categoria: ''
  })

  const [alertMessage, setAlertMessage] = useState(null)
  const [newMarker, setNewMarker] = useState('')
  const barrios = []
  conf[town].barrios.forEach((barrio) => { barrios.push(barrio.nombre) })
  const comunidades = []
  conf[town].comunidades.forEach((comunidad) => { comunidades.push(comunidad.nombre) })
  const queryClient = useQueryClient()

  const pdrQuery = usePdr()
  const pdr = pdrQuery.status == 'success' ? pdrQuery.data : []

  function setNewId(barrio) {
    const allIds = []
    pdr.map((e) => {
      if (e.barrio === barrio) {
        return allIds.push(+e.id)
      } else { return allIds }
    })

    if (allIds.length > 0) {
      return (Math.max(...allIds) + 1)
    }

    return 1
  }

  function handleInputChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    setState({ ...state, [name]: value })
    if (name === 'barrio') {
      setState({ ...state, id: setNewId(value), barrio: value })
    }
    if (name === 'id') {
      pdrExists(state.barrio, value, pdr)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (pdrExists(state.barrio, state.id, pdr)) {
      // alert('Id incorrecto')

      return
    }

    const new_pdr = {
      internal_id: setNewInternalId(pdr),
      nombre: state.nombre,
      lat: newMarker.getPosition().lat(),
      lng: newMarker.getPosition().lng(),
      barrio: state.barrio,
      comunidad: state.comunidad,
      id: (state.id > 0) ? state.id : setNewId(state.barrio),
      descripcion: state.descripcion,
      categoria: state.categoria,
      date_added: moment().format('DD/MM/YYYY')
    }

    fetch(`${API_URL}/pdr/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.token
      },
      body: JSON.stringify(new_pdr)
    })

    setState({
      zafacon: false,
      comunidad: '',
      barrio: '',
      nombre: '',
      descripcion: '',
      id: '',
      categoria: ''
    })

    setNewMarker('')

    setAlertMessage(
      <CustomAlert
        message={`Nuevo punto: ${state.nombre} en ${state.barrio}`}
        setAlertMessage={setAlertMessage}
        severity='info' />
    )
    queryClient.invalidateQueries('pdr')
    return false
  }

  return (
    <Box sx={{ p: 2 }}>
      {alertMessage}
      <form onSubmit={handleSubmit}>
        <div>

          <TextField color='secondary' required={true} id="nombre" label="Nombre" name="nombre" onChange={handleInputChange} value={state.nombre} />

        </div>
        <br />
        <div>
          <TextField color='secondary' id="descripcion" label="Descripción" name="descripcion" onChange={handleInputChange} value={state.descripcion} />
        </div>
        <br />

        <div>
          <FormControl color='secondary' required={true}>
            <InputLabel>Comunidad</InputLabel>
            <NativeSelect
              inputProps={{
                name: 'comunidad',
                id: 'age-native-simple'
              }}
              id="demo-simple-select"
              value={state.comunidad}
              onChange={handleInputChange}
            >
              <option value=""></option>
              {comunidades.map(item => {
                return (<option value={item} key={item}>{item}</option>)
              })}
            </NativeSelect>
          </FormControl>
        </div>
        <br />

        <div>
          <FormControl color='secondary' required={true}>
            <InputLabel>Barrio</InputLabel>
            <NativeSelect
              inputProps={{
                name: 'barrio',
                id: 'age-native-simple'
              }}
              id="demo-simple-select"
              value={state.barrio}
              onChange={handleInputChange}
            >
              <option value=""></option>
              {
                state.comunidad != '' ?
                  conf[town].comunidades.find(obj => { return obj.nombre === state.comunidad }).barrios.map(item => {
                    return (<option value={item} key={item}>{item}</option>)
                  })
                  : <></>
              }
            </NativeSelect>
          </FormControl>
        </div>
        <br />

        <div>
          <TextField
            color='secondary'
            required={true}
            id="id"
            label="Id"
            type="number"
            name="id"
            InputLabelProps={{
              shrink: true
            }}
            onChange={handleInputChange}
            value={state.id}
            error={pdrExists(state.barrio, state.id, pdr)}
            helperText={pdrExists(state.barrio, state.id, pdr) ? `Esta id ya existe en ${state.barrio}` : ''}
          />
        </div>
        <br />
        <FormControl required={true} color='secondary'>
          <InputLabel>Categoría</InputLabel>
          <NativeSelect
            inputProps={{
              name: 'categoria',
              id: 'categoria'
            }}
            id="categoria"
            value={state.categoria}
            onChange={handleInputChange}
          >

            <option value=""></option>
            {
              categories.map(cat => {
                return <option value={cat.value} key={cat.value}>{cat.label}</option>
              })
            }

          </NativeSelect>
        </FormControl>
        <br />
        <div>
          <FormControlLabel
            required={false}
            control={
              <Switch
                checked={state.zafacon}
                onChange={handleInputChange}
                name="zafacon"
              />
            }
            label="Tiene zafacón?"
          />
        </div>
        <br />
        <div>
          <TextField
            color='secondary'
            required={true}
            id="outlined-name"
            name="ubicacion"
            label="Ubicación"
            value={(newMarker !== '') ? 'OK' : ''}
            onChange={handleInputChange}
            helperText="Selecciona la ubicación en el mapa"
          />
        </div>
        <div>
          <MapsWrapper>
            <NewPdrMap containerStyle={{ width: '100%', height: '60%' }} setNewMarker={setNewMarker} comunidad={state.comunidad} newMarker={newMarker} pdr={pdr} />
          </MapsWrapper>
        </div>
        <br />
        <div>
          <Button variant="contained" type="submit" color="secondary" sx={{ marginBottom: '20px' }}>
            Añadir punto
          </Button>
        </div>
      </form>
    </Box>
  )
}
