import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { BarChart } from '@mui/x-charts/BarChart'
import dayjs from 'dayjs'
import * as CustomParseFormat from 'dayjs/plugin/customParseFormat'
import { useWeight } from '../../../hooks/queries'
import ChartCard from '../common/ChartCard'
import { CHART_COLORS } from '../common/theme'
dayjs.extend(CustomParseFormat)

export default function WeeklyWeight(props) {
    const weightQuery = useWeight()
    const isLoading = weightQuery.status === 'pending'
    const weight = weightQuery.status === 'success' ? weightQuery.data : []

    const weightData = [...weight]
    weightData.sort(function (a, b) {
        const keyA = dayjs(a.date, 'DD/MM/YYYY')
        const keyB = dayjs(b.date, 'DD/MM/YYYY')
        if (keyA < keyB) return -1
        if (keyA > keyB) return 1
        return 0
    })

    const data = weightData.slice(-10)

    // Extract arrays for each type
    const petData = data.map(item => item.pet || 0)
    const galonesData = data.map(item => item.galones || 0)
    const plasticoduroData = data.map(item => item.plasticoduro || 0)
    const basuraData = data.map(item => item.basura || 0)
    const xLabels = data.map(item => item.date)

    return (
        <ChartCard title="Peso Semanal por Tipo">
            {isLoading
                ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                        <CircularProgress />
                    </Box>
                )
                : data.length === 0
                    ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                            <Typography color="text.secondary">No hay datos disponibles</Typography>
                        </Box>
                    )
                    : (
                        <Box sx={{ width: '100%', height: 400 }}>
                            <BarChart
                                series={[
                                    { data: petData, label: 'PET', id: 'pet', color: CHART_COLORS[0] },
                                    { data: galonesData, label: 'Galones', id: 'galones', color: CHART_COLORS[1] },
                                    { data: plasticoduroData, label: 'Plástico Duro', id: 'plasticoduro', color: CHART_COLORS[2] },
                                    { data: basuraData, label: 'Basura', id: 'basura', color: CHART_COLORS[3] }
                                ]}
                                xAxis={[{ data: xLabels, scaleType: 'band' }]}
                                yAxis={[{ label: 'Peso (lbs)' }]}
                            />
                        </Box>
                    )}
        </ChartCard>
    )
}
