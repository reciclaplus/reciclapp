import { useState, useEffect } from 'react';
import { Box, TextField, InputAdornment, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_URL } from '../../configuration';

export default function WeightLog() {
  const [entries, setEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch(`${API_URL}/weight`);
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedEntries = [...entries].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredEntries = sortedEntries.filter((entry) =>
    entry.plasticType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.weight.toString().includes(searchQuery) ||
    new Date(entry.date).toLocaleDateString().includes(searchQuery)
  );

  const handleEdit = (id) => {
    // Implement edit functionality
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/weight/${id}`, {
        method: 'DELETE',
      });
      fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <TextField
        fullWidth
        placeholder="Buscar..."
        value={searchQuery}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'date'}
                  direction={sortConfig.direction}
                  onClick={() => handleSort('date')}
                >
                  Fecha
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'plasticType'}
                  direction={sortConfig.direction}
                  onClick={() => handleSort('plasticType')}
                >
                  Tipo de Plástico
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'weight'}
                  direction={sortConfig.direction}
                  onClick={() => handleSort('weight')}
                >
                  Peso (lb)
                </TableSortLabel>
              </TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                <TableCell>{entry.plasticType}</TableCell>
                <TableCell>{entry.weight}</TableCell>
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => handleEdit(entry.id)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => handleDelete(entry.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
