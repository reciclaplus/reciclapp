import React, { useEffect, useState, useContext } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {getWeekNumber} from '../../utils/dates';
import { getDateOfWeek } from '../../utils/dates';
import { PdrContext } from '../../context/PdrContext';
import { TownContext } from '../../context/TownContext';
import { conf } from '../../configuration';
import SelectWeeks from './SelectWeeks'
import { Box, ThemeProvider } from '@mui/system';
import { Grid, Button } from "@material-ui/core";
import CustomTooltip from './CustomTooltip';

export default function TimeSeries(props){

  const [barData, setBarData] = useState()
  const { pdr, setPdr } = useContext(PdrContext);
  const {town, setTown} = useContext(TownContext)
  const [nWeeks, setNWeeks] = useState(52)
  var barriosList = []
  const barrios = conf[town].barrios

  barrios.forEach((barrio) => { barriosList.push(barrio.nombre) })
  
  useEffect(() => {
    var result = []
    var currentDate = new Date()
    for (var i = 0; i < Number(nWeeks); i++) {
        var date = currentDate - i*7*24*60*60*1000
        var week = getWeekNumber(date)
        var year = new Date(date).getFullYear()

        pdr.reduce(function(res, data) {
            
            if (!res[week]) {
              res[week] = {
                "week": week, 
                "year": year,
                "date": getDateOfWeek(week, year).toLocaleDateString(),
                };

              for (let i = 0; i < barriosList.length; i++) {
                res[week][barriosList[i]] = 0;
              }

              result.push(res[week])
            }
            
            if(data.recogida.some(weeks => weeks.year === year && weeks.week === week && weeks.wasCollected==="si")){
              res[week][data.barrio] += 1;
              
            }
          
          return res;
        },{})
        
        
      } 
      setBarData(result.reverse())
  }, [nWeeks])

  function renderTooltip(payload){
    console.log(payload)
    return payload
  }

    return (
      <div>
        <Grid container justify="flex-end">
        <SelectWeeks nWeeks={nWeeks} setNWeeks={setNWeeks}></SelectWeeks>
    </Grid>
    <ResponsiveContainer width="100%" height={300} id="chart">
      <BarChart
        data={barData}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip content={<CustomTooltip/>} />
        <Legend />
        {barrios.map(item => {
                return (<Bar dataKey={item.nombre} stackId="a" fill={item.color} key={item.nombre}>{item.nombre}</Bar>);
              })}
        <Bar dataKey="total" hide={true} stackId="b" key="Total">Total</Bar>
      </BarChart>
      
    </ResponsiveContainer>
    
    </div>
  );
}  