import dynamic from 'next/dynamic'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { usePublicWeightTotals } from '../../hooks/queries'

const PieChart = dynamic(
  () => import('@mui/x-charts/PieChart').then((mod) => mod.PieChart),
  { ssr: false }
)

export default function WeightByType () {
  const weightQuery = usePublicWeightTotals()
  const weight = weightQuery.status === 'success' ? weightQuery.data : { plasticoduro: 0, galones: 0, pet: 0 }

  const data = [
    { id: 0, value: weight.plasticoduro || 0, label: 'Plástico Duro' },
    { id: 1, value: weight.galones || 0, label: 'Galones' },
    { id: 2, value: weight.pet || 0, label: 'PET' }
  ]

  const colors = ['#494791', '#4f772d', '#f6ae2d']

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Typography variant="h6" align="center" color="#494791" sx={{ mb: 1 }}>
        Total de plástico recogido por tipo (lb)
      </Typography>
      <PieChart
        series={[
          {
            data,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            valueFormatter: (item) => `${item.value} lb`
          }
        ]}
        colors={colors}
        height={300}
      />
    </Box>
  )
}
