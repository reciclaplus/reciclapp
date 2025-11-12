import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { usePublicWeightTotals } from '../../hooks/queries'

const COLORS = ['#494791', '#4f772d', '#f6ae2d']

export default function WeightByType () {
  const weightQuery = usePublicWeightTotals()
  const weight = weightQuery.status === 'success' ? weightQuery.data : { plasticoduro: 0, galones: 0, pet: 0 }

  const data = [
    { name: 'Plástico Duro', value: weight.plasticoduro || 0 },
    { name: 'Galones', value: weight.galones || 0 },
    { name: 'PET', value: weight.pet || 0 }
  ]

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Typography variant="h6" align="center" color="#494791" sx={{ mb: 1 }}>
        Total de plástico recogido por tipo (lb)
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => `${entry.name}: ${entry.value} lb`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} lb`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  )
}
