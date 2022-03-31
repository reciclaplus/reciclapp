import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import NativeSelect from '@mui/material/NativeSelect';

export default function SelectWeeks(props) {

  const handleChange = (event) => {
    props.setNWeeks(event.target.value);
  };

  return (
    
    <FormControl>
      <InputLabel>Plazo</InputLabel>
      <NativeSelect
      inputProps={{
        name: 'plazo',
        id: 'plazo-native-simple',
      }}
        id="demo-simple-select"
        value={props.nWeeks}
        onChange={handleChange}
      >
          <option value={1}> Última Semana </option>
          <option value={4}> Último mes </option>
          <option value={12}> Últimos 3 meses </option>
          <option value={52}> Último año </option>
          <option value={78}> Último año y medio </option>
        
      </NativeSelect>
    </FormControl>
          
    );
}
