import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { conf } from '../../configuration'
import { usePublicPdr, usePublicSuccessfulRecogidas } from '../../hooks/queries'
import { GOOGLE_API_KEY } from '../gcloud/google'
import MonthlyWeight from './MonthlyWeight'
import PdrByCategoria from './PdrByCategoria'
import PieChartDemo from './PieChartDemo'
import SingleStat from './SingleStat'
import TotalWeightByType from './TotalWeightByType'
import WeeklyCollection from './WeeklyCollection'

export const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.primary.main,
    elevation: 0,
    height: '100%'

}))

export default function PublicDashboard() {

    const comunidades = conf['sabanayegua']['comunidades']

    var url = 'https://maps.googleapis.com/maps/api/staticmap?center=18.4606607,-70.8405734&zoom=7&size=300x100&scale=2&maptype=roadmap'
    comunidades.forEach((marker) => {
        url = url.concat(`&markers=size:small%7Ccolor:red%7Clabel:${marker.nombre}%7C${marker.center}`)
    })
    url = url.concat(`&key=${GOOGLE_API_KEY}`)

    const pdrQuery = usePublicPdr()
    const pdr = pdrQuery.status == 'success' ? pdrQuery.data : []

    const recogidaStatsQuery = usePublicSuccessfulRecogidas()
    const recogidaStats = recogidaStatsQuery.status === 'success' ? recogidaStatsQuery.data : { last_month: 0, last_year: 0 }

    return (
        <Box sx={{ bgcolor: '#f4f4f6' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Recicla+
                    </Typography>
                </Toolbar>
            </AppBar>

            <Grid container spacing={2} p={1} alignItems="stretch" direction="row">

                <Grid item xs={12}>
                    <Typography variant="h5" component="h2" color='primary' sx={{ mt: 2 }}>
                        Alcance
                    </Typography>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Item>
                        <SingleStat stat={comunidades.length} text='comunidades' subtext='En la provincia de Azua y San Juan' />
                    </Item>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Item>
                        <SingleStat stat={pdr.length} text='puntos de recogida' subtext='entre particulares, escuelas, negocios y otros' />
                    </Item>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Item>
                        <SingleStat stat={recogidaStats.last_month} text='recogidas exitosas' subtext='último mes' />
                    </Item>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Item>
                        <SingleStat stat={recogidaStats.last_year} text='recogidas exitosas' subtext='último año' />
                    </Item>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Item>
                        <PdrByCategoria />
                    </Item>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Item>
                        <PieChartDemo pdr={pdr} />
                    </Item>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Item>
                        <img src={url} height='100%' width='100%' />
                    </Item>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Item>
                        <TotalWeightByType />
                    </Item>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h5" component="h2" color='primary' sx={{ mt: 2 }}>
                        Recogida semanal
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Item>
                        <WeeklyCollection />
                    </Item>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h5" component="h2" color='primary' sx={{ mt: 2 }}>
                        Plástico recogido (lb)
                    </Typography>
                </Grid>

                <Grid item xs={12}>

                    <Item>
                        <MonthlyWeight />
                    </Item>
                </Grid>

            </Grid>
        </Box >
    )
}
