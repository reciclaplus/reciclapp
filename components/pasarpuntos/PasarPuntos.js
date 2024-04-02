import { Box, Button, FormControl, FormLabel } from '@mui/material'
import InputLabel from '@mui/material/InputLabel'
import NativeSelect from '@mui/material/NativeSelect'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { useContext, useEffect, useState } from 'react'
import { API_URL, conf } from '../../configuration'
import { StatsContext } from '../../context/StatsContext'
import { TownContext } from '../../context/TownContext'
import { getWeekNumber } from '../../utils/dates'
import CustomAlert from '../CustomAlert'
import RadioButtonsGroup from '../RadioButtonsGroup'

export default function PasarPuntos() {
  const [pdr, setPdr] = useState([])
  const { town } = useContext(TownContext)
  const { stats } = useContext(StatsContext)
  const [alertMessage, setAlertMessage] = useState(null)
  const currentDate = dayjs()

  const [comunidad, setComunidad] = useState('')
  const [barrio, setBarrio] = useState('')

  const [fecha, setFecha] = useState(currentDate)
  const [semana, setSemana] = useState(getWeekNumber(currentDate))
  const comunidades = []
  conf[town].comunidades.forEach((comunidad) => { comunidades.push(comunidad.nombre) })
  const barrios = []
  conf[town].barrios.forEach((barrio) => { barrios.push(barrio.nombre) })
  const [visiblePdr, setVisiblePdr] = useState([])
  const [payload, setPayload] = useState({})
  const [initialValues, setInitialValues] = useState({})

  useEffect(() => {
    const newPdr = fetch(`${API_URL}/pdr/get_all?id_token_param=${sessionStorage.id_token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.id_token
      }
    }).then((response) => (response.json())).then((data) => { setPdr(data) })
  }, [])

  useEffect(() => {
    setVisiblePdr([...pdr].filter(individualPdr => individualPdr.barrio === barrio))
  }, [barrio])

  useEffect(() => {
    fetch(`${API_URL}/recogida/get/${fecha.year()}/${fecha.week()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    }).then((response) => (response.json())).then((data) => {
      setInitialValues(data)
    })
  }, [fecha])

  function pasarPunto(id, value) {
    setPayload({ ...payload, [id]: { "date": fecha.day(1).format('DD/MM/YYYY'), "internal_id": id, "value": value } })
    console.log(payload)
  }

  function handleSubmit(event) {
    event.preventDefault()
    setAlertMessage(
      <CustomAlert
        message={`Se han pasado los puntos para la fecha ${fecha.format('DD/MM/YYYY')} de ${comunidad} - ${barrio}`}
        setAlertMessage={setAlertMessage}
        severity='info' />
    )
    fetch(`${API_URL}/recogida/set/${fecha.year()}/${fecha.week()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',

      },
      body: JSON.stringify(payload)
    }).then((response) => (response.json())).then((data) => { })
  }

  return (
    <Box sx={{ p: 2 }}>
      {alertMessage}
      <form onSubmit={handleSubmit} data-testid="pasar-puntos-form">
        <div>
          <FormControl role="form-field">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                label="Fecha"
                value={fecha}
                onChange={(newValue) => {
                  setFecha(newValue)
                  setPayload({})
                }}
              />
            </LocalizationProvider>
          </FormControl>
        </div>
        <br />
        <div>
          <FormControl role="form-field">
            <InputLabel>Comunidad</InputLabel>
            <NativeSelect
              inputProps={{
                name: 'comunidad',
                id: 'comunidad'
              }}
              id="comunidad-select"
              value={comunidad}
              onChange={(event) => {
                setComunidad(event.target.value)
                setPayload({})
              }}
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
          <FormControl role="form-field">
            <InputLabel>Barrio</InputLabel>
            <NativeSelect
              inputProps={{
                name: 'barrio',
                id: 'barrio'
              }}
              id="barrio-select"
              value={barrio}
              onChange={(event) => {
                setBarrio(event.target.value)
                setPayload({})
              }
              }
            >
              <option value=""></option>
              {
                comunidad != '' ?
                  conf[town].comunidades.find(obj => { return obj.nombre === comunidad }).barrios.map(item => {
                    return (<option value={item} key={item}>{item}</option>)
                  })
                  : <></>
              }
            </NativeSelect>
          </FormControl>
        </div>
        <br />
        <FormControl component="fieldset" role="form-field">
          {visiblePdr.map((element, index) => {
            const initialValue = initialValues[element.internal_id] ? initialValues[element.internal_id] : ''
            return (
              <div key={index}>
                <FormLabel sx={{ mt: 3 }} component="legend">{element.nombre} - {element.descripcion}</FormLabel>
                <RadioButtonsGroup onChange={pasarPunto} internal_id={element.internal_id} initialValue={initialValue} />
              </div>)
          }
          )}
        </FormControl>
        <br />
        <div>
          <Button sx={{ my: 3 }} color="secondary" variant="contained" type="submit">
            Pasar esos puntos
          </Button>
        </div>
      </form>
    </Box>
  )
}
