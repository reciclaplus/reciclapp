import { Box, Button, FormControl, FormLabel } from '@mui/material'
import InputLabel from '@mui/material/InputLabel'
import NativeSelect from '@mui/material/NativeSelect'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import * as CustomParseFormat from 'dayjs/plugin/customParseFormat'
import * as WeekOfYear from 'dayjs/plugin/weekOfYear'
import { useContext, useEffect, useState } from 'react'
import { API_URL, conf } from '../../configuration'
import { TownContext } from '../../context/TownContext'
import { usePdr, useRecogidaGetWeek } from '../../hooks/queries'
import CustomAlert from '../CustomAlert'
import RadioButtonsGroup from '../RadioButtonsGroup'
dayjs.extend(CustomParseFormat)
dayjs.extend(WeekOfYear)

export default function PasarPuntos() {

  const queryClient = useQueryClient()
  const { town } = useContext(TownContext)
  const [alertMessage, setAlertMessage] = useState(null)
  const currentDate = dayjs()

  const [comunidad, setComunidad] = useState('')
  const [barrio, setBarrio] = useState('')

  const [fecha, setFecha] = useState(currentDate)
  const comunidades = []
  conf[town].comunidades.forEach((comunidad) => { comunidades.push(comunidad.nombre) })
  const barrios = []
  conf[town].barrios.forEach((barrio) => { barrios.push(barrio.nombre) })
  const [visiblePdr, setVisiblePdr] = useState([])
  const [payload, setPayload] = useState({})

  const pdrQuery = usePdr()
  const pdr = pdrQuery.status == 'success' ? pdrQuery.data : []

  useEffect(() => {
    setVisiblePdr([...pdr].filter(individualPdr => individualPdr.barrio === barrio))
  }, [barrio])

  const recogidaGetWeekQuery = useRecogidaGetWeek(fecha.year(), fecha.week())
  const initialValues = recogidaGetWeekQuery.status == 'success' ? recogidaGetWeekQuery.data : {}

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
        'Authorization': 'Bearer ' + localStorage.token,

      },
      body: JSON.stringify(payload)
    }).then((response) => (response.json())).then(() => queryClient.invalidateQueries('weeklyCollection'))
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
            const initialValue = initialValues[element.internal_id] ? initialValues[element.internal_id]['value'] : ''
            console.log(initialValue)
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
