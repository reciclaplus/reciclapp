import moment from 'moment'
import React, { useContext } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { WeightContext } from '../../context/WeightContext'

export default function WeeklyWeight (props) {
  const { weight } = useContext(WeightContext)

  weight.sort(function (a, b) {
    const keyA = new Date(a.date)
    const keyB = new Date(b.date)
    // Compare the 2 dates
    if (keyA < keyB) return -1
    if (keyA > keyB) return 1
    return 0
  })

  const data = weight.map(entry => {
    return { ...entry, date: moment(entry.date).format('DD/MM/YYYY') }
  }).slice(0, 10)

  return (
    <ResponsiveContainer width="100%" height={300} id="chart">
      <BarChart data={data} >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date"/>
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="pet" fill="#8884d8" />
          <Bar dataKey="galones" fill="#82ca9d" />
          <Bar dataKey="plasticoduro" fill="#FFC898" />
          <Bar dataKey="basura" fill="#FF5C58" />
      </BarChart>
    </ResponsiveContainer>
  )
}
