import { useContext, useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { conf } from '../../configuration'
import { TownContext } from '../../context/TownContext'

export default function TimeSeriesSample (props) {
  const [barData, setBarData] = useState()
  const { town } = useContext(TownContext)
  const barriosList = []
  const barrios = conf[town].barrios
  barrios.forEach((barrio) => { barriosList.push(barrio.nombre) })

  useEffect(() => {
    fetch('./api/sample-data/time-series', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }).then(function (response) {
      return response.json()
    })
      .then(function (myJson) {
        setBarData(myJson.reverse())
      })
  }
  )

  return (
    <div>
    <ResponsiveContainer width="100%" height={300} id="chart">
      <BarChart
        data={barData}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {barrios.map(item => {
          return (<Bar dataKey={item.nombre} stackId="a" fill={item.color} key={item.nombre}>{item.nombre}</Bar>)
        })}
      </BarChart>

    </ResponsiveContainer>

    </div>
  )
}
