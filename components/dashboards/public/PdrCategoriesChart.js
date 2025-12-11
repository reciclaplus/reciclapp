import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { PieChart } from '@mui/x-charts/PieChart'
import { COLORS } from '../common/theme'

/**
 * PDR Categories Pie Chart
 */
export default function PdrCategoriesChart({ data, loading }) {
    if (loading) {
        return <CircularProgress size={60} sx={{ color: COLORS.primary }} />
    }

    const chartData = [
        { id: 0, value: data.casa, label: 'Particulares', color: COLORS.primary },
        { id: 1, value: data.negocio, label: 'Negocios', color: COLORS.accent },
        { id: 2, value: data.escuela, label: 'Centros Educativos', color: COLORS.success },
        { id: 3, value: data.otros, label: 'Otros', color: COLORS.info }
    ].filter(item => item.value > 0)

    if (chartData.length === 0) {
        return (
            <Typography variant="body1" color="text.secondary">
                No hay datos disponibles
            </Typography>
        )
    }

    return (
        <PieChart
            series={[
                {
                    data: chartData,
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    arcLabel: (item) => `${item.value}`,
                    arcLabelMinAngle: 20,
                }
            ]}
            height={350}
            width={500}
            slotProps={{
                legend: {
                    direction: 'row',
                    position: { vertical: 'bottom', horizontal: 'middle' },
                    padding: 0,
                    itemMarkWidth: 12,
                    itemMarkHeight: 12,
                    markGap: 5,
                    itemGap: 15,
                }
            }}
        />
    )
}
