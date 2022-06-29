import React, { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function WeeklyWeightSample (props) {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch('./api/sample-data/weekly-weight', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }).then(function (response) {
      return response.json()
    })
      .then(function (myJson) {
        setData(myJson.reverse())
      })
  }
  )
  return (
    <ResponsiveContainer width="100%" height={300} id="chart">
      <BarChart
        data={data}
      >
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
