import React, { memo, useContext, useEffect, useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { conf } from '../../configuration'
import { TownContext } from '../../context/TownContext'

const MyPieChart = memo(function MyPieChart (props) {
  const [data, setData] = useState([])
  const pdr = props.pdr
  const { town } = useContext(TownContext)

  const barrios = conf[town].barrios
  const barriosList = useMemo(() => {
    return barrios.map(barrio => barrio.nombre)
  }, [barrios])

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
    const result = []

    for (const barrio in barrios) {
      const data = barrios[barrio]
      result[data.nombre] = { barrio: data.nombre, value: 0, color: data.color }
    }

    pdr.forEach(data => {
      result[data.barrio].value += 1
    })
    const res = Object.values(result)

    setData(res)
  }, [pdr, barrios])

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
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
})

export default MyPieChart