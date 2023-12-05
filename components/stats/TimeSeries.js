import { useContext, useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import Grid from '@mui/material/Grid'
import moment from 'moment'
import { API_URL, conf } from '../../configuration'
import { StatsContext } from '../../context/StatsContext'
import { TownContext } from '../../context/TownContext'
import CustomTooltip from './CustomTooltip'
import Filter from './Filter'

export default function TimeSeries(props) {
  const [barData, setBarData] = useState()
  const { town } = useContext(TownContext)
  const { stats } = useContext(StatsContext)
  const [categoria, setCategoria] = useState('all')
  const [nWeeks, setNWeeks] = useState(52)
  const [barrio, setBarrio] = useState('all')
  const categories = conf[town].categories
  const barriosList = []
  const barrios = conf[town].barrios
  barrios.forEach((barrio) => { barriosList.push(barrio.nombre) })

  useEffect(() => {
    const today = moment().format('DD/MM/YYYY')
    const start = nWeeks == 'all' ? '08/02/2021' : moment().subtract(nWeeks * 7, 'days').format('DD/MM/YYYY')

    fetch(`${API_URL}/time-series-data?categoria=${categoria}&barrio=${barrio}&start=${start}&end=${today}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(stats.recogidaSemanal)
    }).then((response) => response.json())
      .then(function (myJson) {
        setBarData(myJson)
      })
  }, [categoria, nWeeks, barrio])

  return (
    <div>
      <Grid container justifyContent="flex-end">

        <Filter
          currentValue={nWeeks}
          setCurrentValue={setNWeeks}
          filterName='Plazo'
          values={[{ value: 1, label: 'Última semana' }, { value: 4, label: 'Último mes' }, { value: 12, label: 'Últimos 3 meses' }, { value: 52, label: 'Último año' }, { value: 78, label: 'Último año y medio' }, { value: 'all', label: 'Todo' }]}></Filter>
        <Filter
          currentValue={categoria}
          setCurrentValue={setCategoria}
          filterName='Categoria'
          values={[...categories, { value: 'all', label: 'Todo' }]}></Filter>
        <Filter
          currentValue={barrio}
          setCurrentValue={setBarrio}
          filterName='Barrio'
          values={[...barrios.map(b => { return { value: b.nombre, label: b.nombre } }), { value: 'all', label: 'Todo' }]}></Filter>

      </Grid>
      <ResponsiveContainer width="100%" height={300} id="chart">
        <BarChart
          data={barData}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {barrios.map(item => {
            return (<Bar dataKey={item.nombre} stackId="a" fill={item.color} key={item.nombre}>{item.nombre}</Bar>)
          })}
          <Bar dataKey="total" hide={true} stackId="b" key="Total">Total</Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
