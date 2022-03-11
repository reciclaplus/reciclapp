import React, { useEffect, useState, useContext } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {getWeekNumber} from '../PasarPuntos';
import {getDateOfWeek} from '../Table'
import { PdrContext } from '../../context/PdrContext';
import { TownContext } from '../../context/TownContext';
import { conf } from '../../configuration';

export default function BarChart2(props){

  const [barData, setBarData] = useState()
  const { pdr, setPdr } = useContext(PdrContext);
  const {town, setTown} = useContext(TownContext)

  var barriosList = []
  const barrios = conf[town].barrios
  
  barrios.forEach((barrio) => { barriosList.push(barrio.nombre) })

  useEffect(() => {
    var result = []
    var currentDate = new Date()
    console.log(currentDate)
    console.log(barriosList)
    for (var i = 0; i < 52; i++) {
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
                console.log(barriosList[i])
                
              }
              result.push(res[week])
              console.log(res[week])
            }
            if(data.recogida.some(weeks => weeks.year === year && weeks.week === week && weeks.wasCollected==="si")){
              res[week][data.barrio] += 1;
              
            }
          
          return res;
        },{})
        
        
      }    
      setBarData(result.reverse())
  },[])

    return (
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
  );
}  