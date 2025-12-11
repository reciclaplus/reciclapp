import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import {
    usePublicPdr,
    usePublicSuccessfulRecogidas,
    usePublicWeightByType
} from '../../../hooks/queries'
import ChartCard from '../common/ChartCard'
import DashboardHeader from '../common/DashboardHeader'
import SectionHeader from '../common/SectionHeader'
import StatCard from '../common/StatCard'
import { COLORS } from '../common/theme'
import PdrCategoriesChart from './PdrCategoriesChart'
import WeightByTypeChart from './WeightByTypeChart'


/**
 * Main Public Dashboard Component
 */
export default function PublicDashboard() {
    // Fetch all public data
    const pdrQuery = usePublicPdr()
    const weightQuery = usePublicWeightByType()
    const successfulQuery = usePublicSuccessfulRecogidas()

    // Extract data with defaults
    const pdr = pdrQuery.data ?? []
    const weight = weightQuery.data ?? { plasticoduro: 0, pet: 0, galones: 0, total: 0 }
    const successful = successfulQuery.data ?? { last_month: 0, last_year: 0, total: 0 }

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
