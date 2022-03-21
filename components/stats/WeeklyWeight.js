import React, { useEffect, useState, useContext } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { WeightContext } from '../../context/WeightContext';


export default function WeeklyWeight(props){

  const {weight, setWeight} = useContext(WeightContext)
  console.log(weight)
    return (
    <ResponsiveContainer width="100%" height={300} id="chart">
      <BarChart
        data={weight}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date"/>
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="pet" fill="#8884d8" />
          <Bar dataKey="galones" fill="#82ca9d" />

      </BarChart>
      
    </ResponsiveContainer>
  );
}  