import { useContext, useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import Grid from '@mui/material/Grid'
import moment from 'moment'
import { conf } from '../../configuration'
import { StatsContext } from '../../context/StatsContext'
import { TownContext } from '../../context/TownContext'
import CustomTooltip from './CustomTooltip'
import SelectCategoria from './SelectCategoria'
import SelectWeeks from './SelectWeeks'

export default function TimeSeries (props) {
  const [barData, setBarData] = useState()
  const { town } = useContext(TownContext)
  const { stats } = useContext(StatsContext)
  const [categoria, setCategoria] = useState('all')
  const [nWeeks, setNWeeks] = useState(52)
  const barriosList = []
  const barrios = conf[town].barrios
  barrios.forEach((barrio) => { barriosList.push(barrio.nombre) })

  useEffect(() => {
    const today = moment().format('DD/MM/YYYY')
    const start = moment().subtract(nWeeks * 7, 'days').format('DD/MM/YYYY')

    fetch(`https://api-dot-norse-voice-343214.uc.r.appspot.com/time-series-data?categoria=${categoria}&start=${start}&end=${today}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(stats.recogidaSemanal)
    }).then(function (response) {
      return response.json()
    })
      .then(function (myJson) {
        setBarData(myJson)
      })
  }, [categoria, nWeeks])

  return (
      <div>
        <Grid container justifyContent="flex-end">
          <SelectCategoria categoria={categoria} setCategoria={setCategoria}></SelectCategoria>
          <SelectWeeks nWeeks={nWeeks} setNWeeks={setNWeeks}></SelectWeeks>
        </Grid>
        <ResponsiveContainer width="100%" height={300} id="chart">
          <BarChart
            data={barData}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip/>} />
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
