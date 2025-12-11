import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { BarChart } from '@mui/x-charts/BarChart'
import { PieChart } from '@mui/x-charts/PieChart'
import { usePublicComunidadesCount, usePublicPdr, usePublicSuccessfulRecogidas, usePublicWeightByType } from '../../hooks/queries'
import SingleStat from './SingleStat'

export default function PublicDashboard() {
    // Fetch data from hooks
    const pdrQuery = usePublicPdr()
    const weightQuery = usePublicWeightByType()
    const successfulQuery = usePublicSuccessfulRecogidas()
    const comunidadesQuery = usePublicComunidadesCount()

    const pdr = pdrQuery.status === 'success' ? pdrQuery.data : []
    const weight = weightQuery.status === 'success' ? weightQuery.data : { plasticoduro: 0, pet: 0, galones: 0 }
    const successful = successfulQuery.status === 'success' ? successfulQuery.data : { last_month: 0, last_year: 0 }
    const comunidadesCount = comunidadesQuery.status === 'success' ? comunidadesQuery.data.count : 0

    // Calculate PDR by category
    const pdrByCategoria = {
        casa: pdr.filter((punto) => punto.categoria === 'casa').length,
        negocio: pdr.filter((punto) => punto.categoria === 'negocio').length,
        escuela: pdr.filter((punto) => punto.categoria === 'escuela').length,
        otros: pdr.filter((punto) => punto.categoria !== 'casa' && punto.categoria !== 'negocio' && punto.categoria !== 'escuela').length
    }

    // Prepare data for charts
    const pdrChartData = [
        { id: 0, value: pdrByCategoria.casa, label: 'Particulares', color: '#494791' },
        { id: 1, value: pdrByCategoria.negocio, label: 'Negocios', color: '#f6ae2d' },
        { id: 2, value: pdrByCategoria.escuela, label: 'Centros educativos', color: '#4f772d' },
        { id: 3, value: pdrByCategoria.otros, label: 'Otros', color: '#008198' }
    ]

    const weightChartData = [
        { type: 'Plástico Duro', weight: weight.plasticoduro },
        { type: 'PET', weight: weight.pet },
        { type: 'Galones', weight: weight.galones }
    ]

    return (
        <Box sx={{ bgcolor: '#f4f4f6', minHeight: '100vh' }}>
            <AppBar position="static" sx={{ bgcolor: '#494791' }}>
                <Toolbar>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                        Recicla+ Dashboard Público
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Stats Section */}
                <Typography variant="h4" component="h2" color="primary" sx={{ mb: 3, fontWeight: 600 }}>
                    Estadísticas Generales
                </Typography>
                
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <SingleStat 
                                    stat={comunidadesCount} 
                                    text="Comunidades" 
                                    subtext="En operación" 
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <SingleStat 
                                    stat={pdr.length} 
                                    text="Puntos de Recogida" 
                                    subtext="Total en el sistema" 
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <SingleStat 
                                    stat={successful.last_month} 
                                    text="Recogidas Exitosas" 
                                    subtext="Último mes" 
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <SingleStat 
                                    stat={successful.last_year} 
                                    text="Recogidas Exitosas" 
                                    subtext="Último año" 
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Charts Section */}
                <Typography variant="h4" component="h2" color="primary" sx={{ mb: 3, mt: 4, fontWeight: 600 }}>
                    Distribución y Análisis
                </Typography>

                <Grid container spacing={3}>
                    {/* PDR by Category Pie Chart */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
                                    Puntos de Recogida por Categoría
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', height: 350 }}>
                                    <PieChart
                                        series={[
                                            {
                                                data: pdrChartData,
                                                highlightScope: { faded: 'global', highlighted: 'item' },
                                                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                            },
                                        ]}
                                        height={350}
                                        slotProps={{
                                            legend: {
                                                direction: 'row',
                                                position: { vertical: 'bottom', horizontal: 'middle' },
                                                padding: 0,
                                            },
                                        }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Weight by Plastic Type Bar Chart */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
                                    Peso Total por Tipo de Plástico (lb)
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', height: 350 }}>
                                    <BarChart
                                        xAxis={[{ 
                                            scaleType: 'band', 
                                            data: weightChartData.map(item => item.type),
                                        }]}
                                        series={[
                                            { 
                                                data: weightChartData.map(item => item.weight),
                                                label: 'Libras',
                                                color: '#494791'
                                            }
                                        ]}
                                        height={350}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Total Weight Summary */}
                    <Grid size={{ xs: 12 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
                                    Peso Total Recolectado
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Typography variant="h2" color="primary" sx={{ fontWeight: 700 }}>
                                        {weight.total ? weight.total.toLocaleString() : 0}
                                    </Typography>
                                    <Typography variant="h4" color="text.secondary" sx={{ ml: 2 }}>
                                        lb
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}
