import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { PieChart } from '@mui/x-charts/PieChart'
import { useEffect, useMemo, useState } from 'react'
import { useTownContext } from '../../../context/TownContext'
import ChartCard from '../common/ChartCard'

export default function ByBarrioPieChart(props) {
    const [data, setData] = useState([])
    const pdr = props.pdr
    const loading = props.loading
    const { townConfig } = useTownContext()

    const barrios = useMemo(() =>
        townConfig?.comunidades?.flatMap(c => c.barrios || []) || []
        , [townConfig])

    useEffect(() => {
        if (!pdr || pdr.length === 0 || barrios.length === 0) {
            setData([])
            return
        }

        const result = {}
        barrios.forEach(barrio => {
            result[barrio.nombre] = { label: barrio.nombre, value: 0, color: barrio.color }
        })

        pdr.forEach(item => {
            if (result[item.barrio]) {
                result[item.barrio].value += 1
            }
        })

        const chartData = Object.values(result)
            .filter(item => item.value > 0)
            .map((item, index) => ({ ...item, id: index }))

        setData(chartData)
    }, [pdr, barrios])

    return (
        <ChartCard title="Puntos de Reciclaje por Barrio">
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
                        <PieChart
                            series={[{
                                data,
                                highlightScope: { fade: 'global', highlight: 'item' },
                                // arcLabel: (item) => `${item.label}: ${item.value}`,
                                arcLabelMinAngle: 20
                            }]}
                            height={300}
                        // hideLegend={true}
                        />
                    )}
        </ChartCard>
    )
}
