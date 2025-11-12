import dynamic from 'next/dynamic'
import { usePublicWeight } from '../../hooks/queries'

const BarChart = dynamic(
  () => import('@mui/x-charts/BarChart').then((mod) => mod.BarChart),
  { ssr: false }
)

export default function MonthlyWeight () {
  const weightQuery = usePublicWeight()
  const weight = weightQuery.status === 'success' ? weightQuery.data : []

  const xLabels = weight.map((item) => item.month_year)
  const seriesData = weight.map((item) => item.plasticoduro + item.pet + item.galones)

  return (
    <BarChart
      xAxis={[{ scaleType: 'band', data: xLabels }]}
      series={[{ data: seriesData, label: 'Libras mensuales', color: '#494791' }]}
      height={400}
    />
  )
}
