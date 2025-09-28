import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import dynamic from 'next/dynamic'
import { usePdr } from '../../hooks/queries'

// Dynamic imports for heavy chart components to reduce initial bundle size
const MyPieChart = dynamic(() => import('./PieChart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false
})

const TimeSeries = dynamic(() => import('./TimeSeries'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false
})

const WeeklyWeight = dynamic(() => import('./WeeklyWeight'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false
})

const WastePctg = dynamic(() => import('./WastePctg'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false
})

const RecentlyAdded = dynamic(() => import('./RecentlyAdded'), {
  loading: () => <div>Loading...</div>
})

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  elevation: 0

}))

export default function Dashboard() {

  const pdrQuery = usePdr()
  const pdr = pdrQuery.status == 'success' ? pdrQuery.data : []

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Item>
            <h2>Recogida semanal</h2>
            <TimeSeries />
          </Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Item>
            <h2>Distribución de barrios</h2>
            <MyPieChart pdr={pdr} />
          </Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Item>
            <h2>Libras recogidas por semana</h2>
            <WeeklyWeight />
          </Item>
        </Grid>
        <Grid item xs={12} md={12}>
          <Item>
            <h2>Puntos Nuevos</h2>
            <RecentlyAdded pdr={pdr} />
          </Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Item>
            <h2>Porcentaje de baura</h2>
            <WastePctg />
          </Item>
        </Grid>
      </Grid>
    </Box>
  )
}
