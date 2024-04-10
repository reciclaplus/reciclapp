import dayjs from 'dayjs';
import * as CustomParseFormat from 'dayjs/plugin/customParseFormat';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { API_URL } from '../../configuration';
dayjs.extend(CustomParseFormat)

export default function WeeklyWeight(props) {
  const [weight, setWeight] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/recogida/weight/get`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': 'Bearer ' + localStorage.token
      }
    }).then((response) => (response.json())).then((data) => { setWeight(data) })
  }, [])

  const weightData = [...weight]
  weightData.sort(function (a, b) {
    const keyA = dayjs(a.date, 'DD/MM/YYYY')
    const keyB = dayjs(b.date, 'DD/MM/YYYY')
    // Compare the 2 dates
    if (keyA < keyB) return -1
    if (keyA > keyB) return 1
    return 0
  })

  const data = weightData.map(entry => {
    return { ...entry, date: entry.date }
  }).slice(-10)

  return (
    <ResponsiveContainer width="100%" height={300} id="chart">
      <BarChart data={data} >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
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
