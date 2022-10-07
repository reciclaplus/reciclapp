import { Button, FormControl, FormLabel } from '@mui/material'
import InputLabel from '@mui/material/InputLabel'
import NativeSelect from '@mui/material/NativeSelect'
import moment from 'moment'
import { useContext, useEffect, useState } from 'react'
import { conf } from '../../configuration'
import { PdrContext } from '../../context/PdrContext'
import { StatsContext } from '../../context/StatsContext'
import { TownContext } from '../../context/TownContext'
import { getMonday, getWeekNumber } from '../../utils/dates'
import CustomAlert from '../CustomAlert'
import RadioButtonsGroup from '../RadioButtonsGroup'
import DatePicker from './DatePicker'
export default function PasarPuntos () {
  const { pdr } = useContext(PdrContext)
  const { town } = useContext(TownContext)
  const { stats } = useContext(StatsContext)
  const [alertMessage, setAlertMessage] = useState(null)
  const currentDate = new Date()

  const [barrio, setBarrio] = useState('')

  const [fecha, setFecha] = useState(currentDate)
  const [semana, setSemana] = useState(getWeekNumber(currentDate))
  const barrios = []
  conf[town].barrios.forEach((barrio) => { barrios.push(barrio.nombre) })
  const [todaysPdr, setTodaysPdr] = useState([])

  useEffect(() => {
    setTodaysPdr([...pdr].filter(individualPdr => individualPdr.barrio === barrio))
  }, [barrio])

  function pasarPunto (barrio, id, year, week, value) {
    todaysPdr.forEach((el) => {
      let alreadyChanged = false
      if (el.id === id) {
        el.recogida.forEach((diaDeRecogida) => {
          if (diaDeRecogida.year === year && diaDeRecogida.week === week) {
            diaDeRecogida.wasCollected = value
            alreadyChanged = true
          }
        })

        if (!alreadyChanged) {
          el.recogida.push({ date: moment(getMonday(fecha)).format('DD/MM/YYYY'), year, week, wasCollected: value })
          alreadyChanged = true
        }
      }
    })
  }

  function datePickerDate (event) {
    const dateString = event.target.value
    const d = new Date(+dateString.substring(0, 4), +dateString.substring(5, 7) - 1, +dateString.substring(8, 10))

    return d
  }

  // eslint-disable-next-line no-unused-vars
  function storeStats () {
    const categories = conf[town].categories.map((cat) => { return cat.value })

    categories.forEach(categoria => {
      const catPdr = todaysPdr.filter(individualPdr => individualPdr.categoria === categoria)
      const totalPdr = catPdr.length
      const affirmativePdr = catPdr.map(individualPdr => {
        const recogida = individualPdr.recogida.find(recogida => recogida.week === semana && recogida.year === fecha.getFullYear())
        if (recogida) {
          return recogida.wasCollected === 'si'
        } else {
          return false
        }
      }).filter(Boolean).length

      const previousResult = stats.recogidaSemanal.find(element => element.barrio === barrio && element.date === moment(getMonday(fecha)).format('DD/MM/YYYY') && element.categoria === categoria)
      if (previousResult) {
        previousResult.totalPdr = totalPdr
        previousResult.affirmativePdr = affirmativePdr
      } else {
        (
          stats.recogidaSemanal.push({
            barrio,
            date: moment(getMonday(fecha)).format('DD/MM/YYYY'),
            categoria,
            totalPdr,
            affirmativePdr
          })
        )
      }
    }
    )
  }

  function handleSubmit (event) {
    event.preventDefault()
    setAlertMessage(
      <CustomAlert
        message='Recuerda guardar los cambios'
        setAlertMessage={setAlertMessage}
        severity='info'/>
    )
    storeStats()
    return false
  }

  return (
    <div>
      {alertMessage}
        <form onSubmit={handleSubmit} data-testid="pasar-puntos-form">
            <FormControl role="form-field">
              <DatePicker defaultDate={fecha} onChange={(event) => { setSemana(getWeekNumber(datePickerDate(event))); setFecha(datePickerDate(event)) }}/>
            </FormControl>
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
                    onChange={(event) => setBarrio(event.target.value)}
                    >
                      <option value=""></option>
                      {barrios.map(item => {
                        return (<option value={item} key={item}>{item}</option>)
                      })}
                    </NativeSelect>
                </FormControl>
                </div>
        <br/>
        <FormControl component="fieldset" role="form-field">
            {todaysPdr.map((element, index) => {
              const recogida = element.recogida.filter(weeks => weeks.year === fecha.getFullYear() && weeks.week === semana)
              const initialValue = recogida.length > 0 ? recogida[0].wasCollected : ''

              return (
                <div key={index}>
                    <FormLabel sx={{ mt: 3 }} component="legend">{element.nombre} - {element.descripcion}</FormLabel>
                    <RadioButtonsGroup onChange={pasarPunto} barrio={element.barrio} id={element.id} year={fecha.getFullYear()} week={semana} initialValue={initialValue}/>
                </div>)
            }

            )}
        </FormControl>
        <br/>
      <div>
      <Button sx={{ my: 3 }} color="secondary" variant="contained" type="submit">
        Pasar esos puntos
      </Button>
      </div>
    </form>
  </div>
  )
}
