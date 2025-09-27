import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import { API_URL } from '../../configuration'
import { conf } from '../../configuration'

export default function TownManagement() {
  const [towns, setTowns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingTown, setEditingTown] = useState(null)
  const [townName, setTownName] = useState('')
  const [townConfig, setTownConfig] = useState('')

  useEffect(() => {
    fetchTowns()
  }, [])

  const fetchTowns = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/admin/towns`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch towns')
      }

      const townsData = await response.json()
      
      // Also include predefined towns from configuration
      const predefinedTowns = Object.keys(conf).map(key => ({
        id: key,
        name: conf[key].nombre,
        config: conf[key],
        isPredefined: true
      }))
      
      setTowns([...predefinedTowns, ...townsData])
      setError(null)
    } catch (err) {
      // If API call fails, show only predefined towns
      const predefinedTowns = Object.keys(conf).map(key => ({
        id: key,
        name: conf[key].nombre,
        config: conf[key],
        isPredefined: true
      }))
      setTowns(predefinedTowns)
      setError('No se pudieron cargar los pueblos personalizados')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTown = async () => {
    try {
      let configObject
      try {
        configObject = JSON.parse(townConfig)
      } catch (e) {
        setError('Configuración JSON inválida')
        return
      }

      const response = await fetch(`${API_URL}/admin/towns/${editingTown?.id || townName}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: townName,
          config: configObject
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save town')
      }

      setOpenDialog(false)
      setEditingTown(null)
      setTownName('')
      setTownConfig('')
      await fetchTowns()
    } catch (err) {
      setError(err.message)
    }
  }

  const openEditDialog = (town) => {
    setEditingTown(town)
    setTownName(town.name)
    setTownConfig(JSON.stringify(town.config, null, 2))
    setOpenDialog(true)
  }

  const openAddDialog = () => {
    setEditingTown(null)
    setTownName('')
    setTownConfig(JSON.stringify({
      nombre: '',
      file: '',
      map_center: { lat: 0, lng: 0 },
      categories: [],
      comunidades: [],
      barrios: []
    }, null, 2))
    setOpenDialog(true)
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Gestión de Pueblos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAddDialog}
        >
          Agregar Pueblo
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {towns.map((town) => (
          <Grid item xs={12} md={6} lg={4} key={town.id}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <LocationCityIcon color="primary" />
                  <Typography variant="h6" component="h3">
                    {town.name}
                  </Typography>
                  {town.isPredefined && (
                    <Chip label="Predefinido" size="small" color="info" />
                  )}
                </Box>
                
                <Typography color="textSecondary" gutterBottom>
                  ID: {town.id}
                </Typography>
                
                {town.config?.comunidades && (
                  <Typography variant="body2" gutterBottom>
                    Comunidades: {town.config.comunidades.length}
                  </Typography>
                )}
                
                {town.config?.barrios && (
                  <Typography variant="body2" gutterBottom>
                    Barrios: {town.config.barrios.length}
                  </Typography>
                )}
                
                {town.config?.categories && (
                  <Typography variant="body2" gutterBottom>
                    Categorías: {town.config.categories.length}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => openEditDialog(town)}
                >
                  {town.isPredefined ? 'Ver' : 'Editar'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit/Add Town Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          {editingTown ? `Editar ${editingTown.name}` : 'Agregar Pueblo'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre del Pueblo"
            value={townName}
            onChange={(e) => setTownName(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Configuración (JSON)"
            value={townConfig}
            onChange={(e) => setTownConfig(e.target.value)}
            margin="normal"
            multiline
            rows={12}
            required
            helperText="Configuración en formato JSON con campos como nombre, file, map_center, categories, comunidades, barrios"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenDialog(false)
            setEditingTown(null)
            setTownName('')
            setTownConfig('')
          }}>
            Cancelar
          </Button>
          {!editingTown?.isPredefined && (
            <Button 
              onClick={handleSaveTown}
              variant="contained"
            >
              {editingTown ? 'Actualizar' : 'Agregar'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}