import { FormControlLabel, RadioGroup } from '@mui/material';
import Radio from '@mui/material/Radio';
import React from 'react';
import { GreenRadio, RedRadio, YellowRadio } from './RadioButtons';


export default function RadioButtonsGroup(props) {
  const [selectedValue, setSelectedValue] = React.useState(props.initialValue);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    props.onChange(props.barrio, props.id, props.year, props.week, event.target.value)
  };

  return (
    
    <RadioGroup onChange={handleChange}>
      <FormControlLabel
          value="si"
          control={<GreenRadio
            checked={selectedValue === 'si'}
            value="si"
            name="pasar-puntos-radio-button-si"
            inputProps={{ 'aria-label': 'si' }}
          >
          </GreenRadio>}
          label="Sí"
        />
        <FormControlLabel
          value="no"
          control={<RedRadio
            checked={selectedValue === 'no'}
            value="no"
            name="pasar-puntos-radio-button-no"
            inputProps={{ 'aria-label': 'no' }}
          />}
          label="No"
        />
      <FormControlLabel
          value="cerrado"
          control={<Radio
            checked={selectedValue === 'cerrado'}
            value="cerrado"
            color="default"
            name="pasar-puntos-radio-button-cerrado"
            inputProps={{ 'aria-label': 'cerrado' }}
          />}
          label="Cerrado"
        />
        <FormControlLabel
          value="nada"
          control={<YellowRadio
            checked={selectedValue === "nada"}
            value="nada"
            name="pasar-puntos-radio-button-nada"
            inputProps={{ 'aria-label': null }}
          />}
          label="No disponible"
        />
      
      </RadioGroup>
  );
}