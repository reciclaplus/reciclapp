import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography
} from '@mui/material'
import { useState } from 'react'
import { conf } from '../../configuration'

export default function TownManagement() {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedTown, setSelectedTown] = useState(null)
  const [selectedBarrio, setSelectedBarrio] = useState(null)
  const [barrioDialogOpen, setBarrioDialogOpen] = useState(false)

  const towns = Object.keys(conf).map(key => ({
    id: key,
    ...conf[key]
  }))

  const handleEditTown = (town) => {
    setSelectedTown(town)
    setEditDialogOpen(true)
  }

  const handleAddBarrio = (town) => {
    setSelectedTown(town)
    setSelectedBarrio(null)
    setBarrioDialogOpen(true)
  }

  const handleEditBarrio = (town, barrio) => {
    setSelectedTown(town)
    setSelectedBarrio(barrio)
    setBarrioDialogOpen(true)
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Gestión de Pueblos y Barrios</Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Nota: Esta es una vista de solo lectura de la configuración actual. 
        Para modificar pueblos y barrios, edite el archivo <code>configuration.js</code>
      </Typography>

      <Grid container spacing={3}>
        {towns.map((town) => (
          <Grid item xs={12} md={6} key={town.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">{town.nombre}</Typography>
                  <Chip label={town.id} size="small" />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Centro del Mapa:</strong> {town.map_center ? 
                    `${town.map_center.lat}, ${town.map_center.lng}` : 
                    'No especificado'}
                </Typography>

                {town.comunidades && (
                  <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Comunidades ({town.comunidades.length})
                    </Typography>
                    <List dense>
                      {town.comunidades.slice(0, 3).map((comunidad, idx) => (
                        <ListItem key={idx}>
                          <ListItemText 
                            primary={comunidad.nombre}
                            secondary={`${comunidad.barrios.length} barrios`}
                          />
                        </ListItem>
                      ))}
                      {town.comunidades.length > 3 && (
                        <ListItem>
                          <ListItemText 
                            secondary={`... y ${town.comunidades.length - 3} más`}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Box>
                )}

                {town.barrios && (
                  <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Barrios ({town.barrios.length})
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {town.barrios.slice(0, 5).map((barrio, idx) => (
                        <Chip
                          key={idx}
                          label={barrio.nombre}
                          size="small"
                          sx={{ 
                            backgroundColor: barrio.color, 
                            color: '#fff',
                            '& .MuiChip-label': {
                              textShadow: '0 0 2px rgba(0,0,0,0.8)'
                            }
                          }}
                        />
                      ))}
                      {town.barrios.length > 5 && (
                        <Chip
                          label={`+${town.barrios.length - 5} más`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>
                )}

                {town.categories && (
                  <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Categorías
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {town.categories.map((cat, idx) => (
                        <Chip
                          key={idx}
                          label={cat.label}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {towns.length === 0 && (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center">
              No hay pueblos configurados
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
