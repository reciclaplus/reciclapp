import { useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Tooltip } from '@mui/material';
import { API_URL } from '../../configuration';

export default function AddWeightForm() {
  const [plasticType, setPlasticType] = useState('');
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');

  const handlePlasticTypeChange = (event) => {
    setPlasticType(event.target.value);
  };

  const handleWeightChange = (event) => {
    setWeight(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!plasticType || !weight) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      setError('Por favor, ingrese un peso válido.');
      return;
    }

    const newWeightEntry = {
      plasticType,
      weight: weightValue.toFixed(1),
      date: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API_URL}/weight`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWeightEntry),
      });

      if (!response.ok) {
        throw new Error('Error al subir la nueva entrada de peso.');
      }

      setPlasticType('');
      setWeight('');
      setError('');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="plastic-type-label">Tipo de Plástico</InputLabel>
        <Select
          labelId="plastic-type-label"
          value={plasticType}
          onChange={handlePlasticTypeChange}
        >
          <MenuItem value="pet">PET</MenuItem>
          <MenuItem value="galones">Galones</MenuItem>
          <MenuItem value="plastico-duro">Plástico Duro</MenuItem>
        </Select>
      </FormControl>
      <Tooltip title="Ingrese el peso en libras con un decimal">
        <TextField
          fullWidth
          label="Peso (lb)"
          value={weight}
          onChange={handleWeightChange}
          placeholder="Ejemplo: 12.5"
          error={!!error}
          helperText={error}
          inputProps={{ inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]?' }}
          sx={{ mb: 2 }}
        />
      </Tooltip>
      <Button type="submit" variant="contained" color="primary">
        Añadir Paca
      </Button>
    </Box>
  );
}
