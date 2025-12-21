import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { usePdr } from '../../../hooks/queries'
import { COLORS } from '../common/theme'
import ByBarrioPieChart from './ByBarrioPieChart'
import RecentlyAdded from './RecentlyAdded'
import TimeSeries from './TimeSeries'
import WastePctg from './WastePctg'
import WeeklyWeight from './WeeklyWeight'

export default function Dashboard() {
    const pdrQuery = usePdr()
    const pdr = pdrQuery.status === 'success' ? pdrQuery.data : []
    const pdrLoading = pdrQuery.status === 'pending'

    return (
        <Box sx={{ backgroundColor: COLORS.background, minHeight: '100vh' }}>

            <Container maxWidth="xl" sx={{ py: 4 }}>

                <Grid container spacing={3}>
                    {/* Time Series Chart - Full Width */}
                    <Grid size={12}>
                        <TimeSeries />
                    </Grid>

                    {/* Pie Chart and Weekly Weight - Side by Side */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <ByBarrioPieChart pdr={pdr} loading={pdrLoading} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <WeeklyWeight />
                    </Grid>

                    {/* Recently Added - Full Width */}
                    <Grid size={12}>
                        <RecentlyAdded pdr={pdr} loading={pdrLoading} />
                    </Grid>

                    {/* Waste Percentage - Half Width */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <WastePctg />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}
