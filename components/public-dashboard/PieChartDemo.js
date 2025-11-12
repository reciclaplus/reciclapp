import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const COLORS = ['#494791', '#4f772d', '#f6ae2d', '#008198']

export default function PieChartDemo (props) {
  const pdr = props.pdr
  
  const data = [
    { name: 'Particulares', value: pdr.filter((punto) => punto.categoria === 'casa').length },
    { name: 'Negocios', value: pdr.filter((punto) => punto.categoria === 'negocio').length },
    { name: 'Centros educativos', value: pdr.filter((punto) => punto.categoria === 'escuela').length },
    { name: 'Otros', value: pdr.filter((punto) => punto.categoria !== 'casa' && punto.categoria !== 'negocio' && punto.categoria !== 'escuela').length }
  ]

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Typography variant="h6" align="center" color="#494791" sx={{ mb: 1 }}>
        Distribución de puntos de recogida
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => `${entry.name}: ${entry.value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  )
}
