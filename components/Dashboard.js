import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import MyPieChart from './stats/PieChart'
import RecentlyAdded from './stats/RecentlyAdded'
import TimeSeries from './stats/TimeSeries'
import WastePctg from './stats/WastePctg'
import WeeklyWeight from './stats/WeeklyWeight'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  elevation: 0

}))

export default function Dashboard () {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Item>
            <h2>Recogida semanal</h2>
            <TimeSeries/>
          </Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Item>
            <h2>Distribución de barrios</h2>
            <MyPieChart/>
          </Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Item>
            <h2>Libras recogidas por semana</h2>
            <WeeklyWeight/>
          </Item>
        </Grid>
        <Grid item xs={12} md={12}>
          <Item>
          <h2>Puntos Nuevos</h2>
            <RecentlyAdded />
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
