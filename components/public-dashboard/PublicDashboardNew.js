import RecyclingIcon from '@mui/icons-material/Recycling'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { BarChart } from '@mui/x-charts/BarChart'
import { PieChart } from '@mui/x-charts/PieChart'
import {
    usePublicComunidadesCount,
    usePublicPdr,
    usePublicSuccessfulRecogidas,
    usePublicWeightByType
} from '../../hooks/queries'

// Brand colors
const COLORS = {
    primary: '#494791',
    secondary: '#8F9147',
    accent: '#f6ae2d',
    success: '#4f772d',
    info: '#008198',
    background: '#f4f4f6',
    white: '#ffffff'
}

// Chart color palette
const CHART_COLORS = [COLORS.primary, COLORS.accent, COLORS.success, COLORS.info]

/**
 * StatCard - Displays a single statistic with title and subtitle
 */
function StatCard({ value, title, subtitle, loading }) {
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                {loading ? (
                    <CircularProgress size={40} sx={{ color: COLORS.primary }} />
                ) : (
                    <Typography
                        variant="h3"
                        component="div"
                        sx={{ color: COLORS.primary, fontWeight: 700, mb: 1 }}
                    >
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </Typography>
                )}
                <Typography variant="h6" sx={{ color: COLORS.primary, fontWeight: 600 }}>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="body2" sx={{ color: COLORS.secondary, mt: 0.5 }}>
                        {subtitle}
                    </Typography>
                )}
            </CardContent>
        </Card>
    )
}

/**
 * ChartCard - Wrapper for chart components with consistent styling
 */
function ChartCard({ title, children, height = 400 }) {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 0 }}>
                    {title}
                </Typography>
                <Box sx={{ minHeight: height, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible' }}>
                    {children}
                </Box>
            </CardContent>
        </Card>
    )
}

/**
 * Header component with app bar
 */
function DashboardHeader() {
    return (
        <AppBar position="static" sx={{ bgcolor: COLORS.primary }}>
            <Toolbar>
                <RecyclingIcon sx={{ mr: 2, fontSize: 32 }} />
                <Typography variant="h5" component="h1" sx={{ flexGrow: 1, fontWeight: 600 }}>
                    Recicla+ Dashboard Público
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

/**
 * PDR Categories Pie Chart
 */
function PdrCategoriesChart({ data, loading }) {
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

/**
 * Weight by Plastic Type Bar Chart
 */
function WeightByTypeChart({ data, loading }) {
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

    return (
        <BarChart
            xAxis={[{ data: ['Peso Recolectado'] }]}
            series={[
                { data: [plasticoduro], label: 'Plástico Duro', color: COLORS.primary },
                { data: [pet], label: 'PET', color: COLORS.accent },
                { data: [galones], label: 'Galones', color: COLORS.success }
            ]}
            width={500}
            height={300}
        />
    )
}

/**
 * Section Header
 */
function SectionHeader({ children }) {
    return (
        <Typography
            variant="h4"
            component="h2"
            sx={{
                color: COLORS.primary,
                fontWeight: 600,
                mb: 3,
                mt: 4
            }}
        >
            {children}
        </Typography>
    )
}

/**
 * Main Public Dashboard Component
 */
export default function PublicDashboardNew() {
    // Fetch all public data
    const pdrQuery = usePublicPdr()
    const weightQuery = usePublicWeightByType()
    const successfulQuery = usePublicSuccessfulRecogidas()
    const comunidadesQuery = usePublicComunidadesCount()

    // Extract data with defaults
    const pdr = pdrQuery.data ?? []
    const weight = weightQuery.data ?? { plasticoduro: 0, pet: 0, galones: 0, total: 0 }
    console.log('Weight Data:', weight)
    const successful = successfulQuery.data ?? { last_month: 0, last_year: 0, total: 0 }
    const comunidadesCount = comunidadesQuery.data?.count ?? 0

    // Calculate PDR distribution by category
    const pdrByCategoria = {
        casa: pdr.filter((punto) => punto.categoria === 'casa').length,
        negocio: pdr.filter((punto) => punto.categoria === 'negocio').length,
        escuela: pdr.filter((punto) => punto.categoria === 'escuela').length,
        otros: pdr.filter((punto) =>
            punto.categoria !== 'casa' &&
            punto.categoria !== 'negocio' &&
            punto.categoria !== 'escuela'
        ).length
    }

    // Loading states
    const isLoadingStats = pdrQuery.isLoading || successfulQuery.isLoading || comunidadesQuery.isLoading
    const isLoadingCharts = pdrQuery.isLoading || weightQuery.isLoading

    return (
        <Box sx={{ bgcolor: COLORS.background, minHeight: '100vh' }}>
            <DashboardHeader />

            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Statistics Section */}
                <SectionHeader>Estadísticas Generales</SectionHeader>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            value={pdr.length}
                            title="Puntos de Recogida"
                            subtitle="Total en el sistema"
                            loading={pdrQuery.isLoading}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            value={weight.total}
                            title="Libras Recogidas"
                            subtitle="Total"
                            loading={weightQuery.isLoading}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            value={successful.total}
                            title="Recogidas Exitosas"
                            subtitle="Total"
                            loading={successfulQuery.isLoading}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            value={successful.last_year}
                            title="Recogidas Exitosas"
                            subtitle="Último año"
                            loading={successfulQuery.isLoading}
                        />
                    </Grid>
                </Grid>

                {/* Charts Section */}
                <SectionHeader>Distribución y Análisis</SectionHeader>

                <Grid container spacing={3}>
                    {/* PDR Distribution Pie Chart */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <ChartCard title="Puntos de Recogida por Categoría">
                            <PdrCategoriesChart
                                data={pdrByCategoria}
                                loading={pdrQuery.isLoading}
                            />
                        </ChartCard>
                    </Grid>

                    {/* Weight by Type Bar Chart */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <ChartCard title="Peso por Tipo de Plástico (lb)">
                            <WeightByTypeChart
                                data={weight}
                                loading={weightQuery.isLoading}
                            />
                        </ChartCard>
                    </Grid>

                </Grid>

                {/* Footer */}
                <Box sx={{ mt: 6, textAlign: 'center', pb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} Recicla+ - Nature Power Foundation
                    </Typography>
                </Box>
            </Container>
        </Box>
    )
}
