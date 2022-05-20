import React, { useEffect, useState, useContext } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {getWeekNumber} from '../../utils/dates';
import { getDateOfWeek } from '../../utils/dates';
import { PdrContext } from '../../context/PdrContext';
import { TownContext } from '../../context/TownContext';
import { conf } from '../../configuration';
// import SelectWeeks from './SelectWeeks'
import { Box, ThemeProvider } from '@mui/system';
import { Grid, Button } from "@material-ui/core";
// import CustomTooltip from './CustomTooltip';

export default function TimeSeriesSample(props){

  const [barData, setBarData] = useState()
  const { pdr, setPdr } = useContext(PdrContext);
  const {town, setTown} = useContext(TownContext)
  const [nWeeks, setNWeeks] = useState(52)
  var barriosList = []
  const barrios = conf[town].barrios
  barrios.forEach((barrio) => { barriosList.push(barrio.nombre) })
  
  useEffect(()=>{
    fetch('./api/sample-data/time-series',{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }).then(function(response){
      return response.json();
    })
    .then(function(myJson) {
      setBarData(myJson.reverse())
    })
  }
    )
  

    return (
      <div>
        <Grid container justify="flex-end">
        {/* <SelectWeeks nWeeks={nWeeks} setNWeeks={setNWeeks}></SelectWeeks> */}
    </Grid>
    <ResponsiveContainer width="100%" height={300} id="chart">
      <BarChart
        data={barData}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {barrios.map(item => {
                return (<Bar dataKey={item.nombre} stackId="a" fill={item.color} key={item.nombre}>{item.nombre}</Bar>);
              })}
      </BarChart>
      
    </ResponsiveContainer>
    
    </div>
  );
}  