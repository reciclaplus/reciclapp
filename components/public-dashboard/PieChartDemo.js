import dynamic from 'next/dynamic'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const PieChart = dynamic(
  () => import('@mui/x-charts/PieChart').then((mod) => mod.PieChart),
  { ssr: false }
)

export default function PieChartDemo (props) {
  const pdr = props.pdr
  
  const data = [
    { id: 0, value: pdr.filter((punto) => punto.categoria === 'casa').length, label: 'Particulares' },
    { id: 1, value: pdr.filter((punto) => punto.categoria === 'negocio').length, label: 'Negocios' },
    { id: 2, value: pdr.filter((punto) => punto.categoria === 'escuela').length, label: 'Centros educativos' },
    { id: 3, value: pdr.filter((punto) => punto.categoria !== 'casa' && punto.categoria !== 'negocio' && punto.categoria !== 'escuela').length, label: 'Otros' }
  ]

  const colors = ['#494791', '#4f772d', '#f6ae2d', '#008198']

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Typography variant="h6" align="center" color="#494791" sx={{ mb: 1 }}>
        Distribución de puntos de recogida
      </Typography>
      <PieChart
        series={[
          {
            data,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' }
          }
        ]}
        colors={colors}
        height={300}
      />
    </Box>
  )
}
