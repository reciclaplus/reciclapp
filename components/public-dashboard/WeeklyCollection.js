import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { usePublicWeeklyCollection } from '../../hooks/queries'

export default function WeeklyCollection () {
  const weeklyChartQuery = usePublicWeeklyCollection(104)
  const barData = weeklyChartQuery.status === 'success' ? weeklyChartQuery.data : []

  const data = barData.map((item) => ({
    date: item.date,
    'Número de puntos de recogida': Object.values(item).filter((val) => val.value === 'si').length
  })).reverse()

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" angle={-45} textAnchor="end" height={100} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Número de puntos de recogida" fill="#494791" />
      </BarChart>
    </ResponsiveContainer>
  )
}
