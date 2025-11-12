import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { usePublicWeight } from '../../hooks/queries'

export default function MonthlyWeight () {
  const weightQuery = usePublicWeight()
  const weight = weightQuery.status === 'success' ? weightQuery.data : []

  const data = weight.map((item) => ({
    month_year: item.month_year,
    'Libras mensuales': item.plasticoduro + item.pet + item.galones
  }))

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month_year" angle={-45} textAnchor="end" height={100} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Libras mensuales" fill="#494791" />
      </BarChart>
    </ResponsiveContainer>
  )
}
