import { useContext, useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getDateOfWeek, getWeekNumber } from '../../utils/dates'

import Grid from '@mui/material/Grid'
import { conf } from '../../configuration'
import { PdrContext } from '../../context/PdrContext'
import { TownContext } from '../../context/TownContext'
import CustomTooltip from './CustomTooltip'
import SelectCategoria from './SelectCategoria'
import SelectWeeks from './SelectWeeks'

export default function TimeSeries (props) {
  const [barData, setBarData] = useState()
  const { pdr } = useContext(PdrContext)
  const { town } = useContext(TownContext)
  const [categoria, setCategoria] = useState('all')
  const [nWeeks, setNWeeks] = useState(52)
  const barriosList = []
  const barrios = conf[town].barrios

  barrios.forEach((barrio) => { barriosList.push(barrio.nombre) })

  useEffect(() => {
    const result = []
    const currentDate = new Date()
    for (let i = 0; i < Number(nWeeks); i++) {
      const date = currentDate - i * 7 * 24 * 60 * 60 * 1000
      const week = getWeekNumber(date)
      const year = new Date(date).getFullYear()

      pdr.reduce(function (res, data) {
        if (!res[week]) {
          res[week] = {
            week,
            year,
            date: getDateOfWeek(week, year).toLocaleDateString()
          }

          for (let i = 0; i < barriosList.length; i++) {
            res[week][barriosList[i]] = 0
          }
          result.push(res[week])
        }
        if ((data.categoria === categoria || categoria === 'all') && data.recogida.some(weeks => weeks.year === year && weeks.week === week && weeks.wasCollected === 'si')) {
          res[week][data.barrio] += 1
        }

        return res
      }, {})
    }
    setBarData(result.reverse())
  }, [nWeeks, categoria])

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
