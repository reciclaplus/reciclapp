import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { BarChart } from '@mui/x-charts/BarChart'
import { useState } from 'react'
import { useTownContext } from '../../../context/TownContext'
import { useWeeklyCollection } from '../../../hooks/queries'
import ChartCard from '../common/ChartCard'
import Filter from '../common/Filter'

export default function TimeSeries(props) {
    const { townConfig } = useTownContext()
    const [categoria, setCategoria] = useState('all')
    const [nWeeks, setNWeeks] = useState(12)
    const [barrio, setBarrio] = useState('all')
    const categories = townConfig?.categories || []
    const barrios = townConfig?.comunidades?.flatMap(c => c.barrios || []) || []

    const weeklyChartQuery = useWeeklyCollection(nWeeks, categoria, barrio)
    const isLoading = weeklyChartQuery.status === 'pending'
    const barData = weeklyChartQuery.status === 'success' ? weeklyChartQuery.data : []

    const series = barrios.map(item => ({
        dataKey: item.nombre,
        label: item.nombre,
        color: item.color,
        stack: 'total'
    }))

    const toolbar = (
        <>
            <Filter
                currentValue={nWeeks}
                setCurrentValue={setNWeeks}
                filterName="Plazo"
                values={[
                    { value: 1, label: 'Última semana' },
                    { value: 4, label: 'Último mes' },
                    { value: 12, label: 'Últimos 3 meses' },
                    { value: 52, label: 'Último año' },
                    { value: 104, label: 'Últimos 2 años' }
                ]}
            />
            <Filter
                currentValue={categoria}
                setCurrentValue={setCategoria}
                filterName="Categoria"
                values={[...categories, { value: 'all', label: 'Todo' }]}
            />
            <Filter
                currentValue={barrio}
                setCurrentValue={setBarrio}
                filterName="Barrio"
                values={[
                    ...barrios.map(b => ({ value: b.nombre, label: b.nombre })),
                    { value: 'all', label: 'Todo' }
                ]}
            />
        </>
    )

    return (
        <ChartCard title="Recolección Semanal" toolbar={toolbar}>
            {isLoading
                ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                        <CircularProgress />
                    </Box>
                )
                : barData.length === 0
                    ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                            <Typography color="text.secondary">No hay datos disponibles</Typography>
                        </Box>
                    )
                    : (
                        <Box sx={{ width: '100%', overflowX: 'auto' }}>
                            <BarChart
                                dataset={barData}
                                xAxis={[{
                                    dataKey: 'date',
                                    scaleType: 'band'
                                }]}
                                yAxis={[{ label: 'Peso (lbs)' }]}
                                series={series}
                                height={400}

                            // margin={{ left: 60, right: 20, top: 40, bottom: 100 }}
                            />
                        </Box>
                    )}
        </ChartCard>
    )
}
