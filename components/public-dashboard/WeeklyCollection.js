import dynamic from 'next/dynamic'
import { usePublicWeeklyCollection } from '../../hooks/queries'

const BarChart = dynamic(
  () => import('@mui/x-charts/BarChart').then((mod) => mod.BarChart),
  { ssr: false }
)

export default function WeeklyCollection () {
  const weeklyChartQuery = usePublicWeeklyCollection(104)
  const barData = weeklyChartQuery.status === 'success' ? weeklyChartQuery.data : []

  const xLabels = barData.map((item) => item.date).reverse()
  const seriesData = barData.map((item) => Object.values(item).filter((val) => val.value === 'si').length).reverse()

  return (
    <BarChart
      xAxis={[{ scaleType: 'band', data: xLabels }]}
      series={[{ data: seriesData, label: 'Número de puntos de recogida', color: '#494791' }]}
      height={400}
    />
  )
}
