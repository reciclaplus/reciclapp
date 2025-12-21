import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { BarChart } from '@mui/x-charts/BarChart'
import { COLORS } from '../common/theme'

/**
 * Weight by Plastic Type Bar Chart
 */
export default function WeightByTypeChart({ data, loading }) {
    if (loading) {
        return <CircularProgress size={60} sx={{ color: COLORS.primary }} />
    }

    const plasticoduro = data.plasticoduro || 0
    const pet = data.pet || 0
    const galones = data.galones || 0

    if (plasticoduro === 0 && pet === 0 && galones === 0) {
        return (
            <Typography variant="body1" color="text.secondary">
                No hay datos disponibles
            </Typography>
        )
    }

    const xLabels = ['Plástico Duro', 'PET', 'Galones']

    return (
        <Box sx={{ width: '100%', height: 350 }}>
            <BarChart
                series={[
                    { data: [plasticoduro, pet, galones], label: 'Peso (lbs)', id: 'weight', color: COLORS.primary }
                ]}
                xAxis={[{ data: xLabels, scaleType: 'band' }]}
                yAxis={[{ label: 'Peso (lbs)' }]}
            />
        </Box>
    )
}
