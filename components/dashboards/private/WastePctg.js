import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { BarChart } from '@mui/x-charts/BarChart'
import dayjs from 'dayjs'
import { useContext } from 'react'
import { WeightContext } from '../../../context/WeightContext'
import ChartCard from '../common/ChartCard'
import { COLORS } from '../common/theme'

export default function WastePctg(props) {
    const { weight, loading } = useContext(WeightContext)

    const weightData = [...(weight || [])]
    weightData.sort(function (a, b) {
        const keyA = new Date(a.date)
        const keyB = new Date(b.date)
        if (keyA < keyB) return -1
        if (keyA > keyB) return 1
        return 0
    })

    const data = weightData.map(entry => {
        const totalPlastic = entry.pet + entry.galones + entry.plasticoduro
        const wastePctg = totalPlastic > 0 ? (entry.basura * 100 / totalPlastic) : 0
        return {
            ...entry,
            date: dayjs(entry.date).format('DD/MM/YYYY'),
            wastePctg: Number(wastePctg.toFixed(2))
        }
    }).slice(-10)

    return (
        <ChartCard title="Porcentaje de Basura">
            {loading
                ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                        <CircularProgress />
                    </Box>
                )
                : data.length === 0
                    ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                            <Typography color="text.secondary">No hay datos disponibles</Typography>
                        </Box>
                    )
                    : (
                        <BarChart
                            dataset={data}
                            xAxis={[{
                                dataKey: 'date',
                                scaleType: 'band',
                                tickLabelStyle: { angle: -45, textAnchor: 'end', fontSize: 10 }
                            }]}
                            yAxis={[{ label: '%' }]}
                            series={[{ dataKey: 'wastePctg', label: '% Basura', color: COLORS.accent }]}
                            height={300}
                            slotProps={{
                                legend: {
                                    hidden: true
                                }
                            }}
                            margin={{ left: 50, right: 20, top: 20, bottom: 60 }}
                        />
                    )}
        </ChartCard>
    )
}
