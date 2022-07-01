import React, { useEffect, useState, useContext } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { TownContext } from '../../context/TownContext'
import { conf } from '../../configuration'

export default function BarriosDistributionSample (props) {
  const [data, setData] = useState([])
  const { town } = useContext(TownContext)

  const barrios = conf[town].barrios
  const barriosList = []
  barrios.forEach((barrio) => { barriosList.push(barrio.nombre) })

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
        <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${barriosList[index]} ${(percent * 100).toFixed(0)}%`}
        </text>
    )
  }

  useEffect(() => {
    fetch('./api/sample-data/barrios-distribution', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }).then(function (response) {
      return response.json()
    })
      .then(function (myJson) {
        setData(myJson)
      })
  }, [])

  return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            fill="#8884d8"
            dataKey="value"
          >
            {barrios.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color}/>
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
  )
}
