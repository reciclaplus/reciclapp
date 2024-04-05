import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { API_URL } from '../../configuration'
import MyPieChart from './PieChart'
import RecentlyAdded from './RecentlyAdded'
import TimeSeries from './TimeSeries'
import WastePctg from './WastePctg'
import WeeklyWeight from './WeeklyWeight'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  elevation: 0

}))

export default function Dashboard() {

  const [pdr, setPdr] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/pdr/get_all?id_token_param=${sessionStorage.id_token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.id_token
      }
    }).then((response) => (response.json())).then((data) => { setPdr(data) })
  }
    , [])

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
