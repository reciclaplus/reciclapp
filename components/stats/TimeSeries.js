import React, { useEffect, useState, useContext } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getWeekNumber, getDateOfWeek } from '../../utils/dates'

import { PdrContext } from '../../context/PdrContext'
import { TownContext } from '../../context/TownContext'
import { conf } from '../../configuration'
import SelectWeeks from './SelectWeeks'
import SelectCategoria from './SelectCategoria'
import { Grid } from '@material-ui/core'
import CustomTooltip from './CustomTooltip'

export default function TimeSeries (props) {
  const [barData, setBarData] = useState()
  const { pdr } = useContext(PdrContext)
  const { town } = useContext(TownContext)
  const [nWeeks, setNWeeks] = useState(52)
  const [categoria, setCategoria] = useState('casa')
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
  }, [nWeeks, categoria, pdr, barriosList])

  return (
      <div>
        <Grid container justify="flex-end">
        <SelectWeeks nWeeks={nWeeks} setNWeeks={setNWeeks}></SelectWeeks>
        <SelectCategoria categoria={categoria} setCategoria={setCategoria}></SelectCategoria>
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
