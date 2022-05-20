import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TimeSeriesSample from './TimeSeriesSample';
import BarriosDistributionSample from './BarriosDistributionSample'
import WeeklyWeightSample from './WeeklyWeightSample'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  elevation: 0
  
}));

export default function DashboardSample() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Item>
            <h2>Recogida semanal</h2>
            <TimeSeriesSample />
          </Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Item>
            <h2>Distribución de barrios</h2>
            <BarriosDistributionSample />
          </Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Item>
            <h2>Libras recogidas por semana</h2>
            <WeeklyWeightSample/>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
