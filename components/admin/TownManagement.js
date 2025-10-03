import { Add as AddIcon, Close as CloseIcon, Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
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
} from '@mui/material';
import { useEffect, useState } from 'react';
import { API_URL } from '../../configuration';


function EditableArray({ label, items, onChange, getLabel, onAdd, onEdit, onDelete }) {
  return (
    <Box mb={2}>
      <Typography variant="subtitle2">{label}</Typography>
      <List dense>
        {items.map((item, idx) => (
          <ListItem key={idx} secondaryAction={
            <>
              <IconButton edge="end" onClick={() => onEdit(idx)}><EditIcon fontSize="small" /></IconButton>
              <IconButton edge="end" onClick={() => onDelete(idx)}><DeleteIcon fontSize="small" /></IconButton>
            </>
          }>
            <ListItemText primary={getLabel(item)} />
          </ListItem>
        ))}
      </List>
      <Button startIcon={<AddIcon />} onClick={onAdd} size="small">Añadir</Button>
    </Box>
  )
}

export default function TownManagement() {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedTown, setSelectedTown] = useState(null)
  const [editTownData, setEditTownData] = useState(null)
  const [editField, setEditField] = useState(null)
  const [editFieldIdx, setEditFieldIdx] = useState(null)
  const [editFieldValue, setEditFieldValue] = useState(null)
  const [addField, setAddField] = useState(null)
  const [addFieldValue, setAddFieldValue] = useState(null)
  const [towns, setTowns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchTowns() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_URL}/towns`)
        if (!res.ok) throw new Error('Error fetching towns')
        const data = await res.json()
        setTowns(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchTowns()
  }, [])

  const handleEditTown = (town) => {
    setSelectedTown(town)
    setEditTownData(JSON.parse(JSON.stringify(town))) // deep copy
    setEditDialogOpen(true)
  }

  // --- Edit dialog handlers ---
  const handleEditField = (field, idx) => {
    setEditField(field)
    setEditFieldIdx(idx)
    setEditFieldValue(editTownData[field][idx])
  }
  const handleEditFieldValueChange = (value) => {
    setEditFieldValue(value)
  }
  const handleEditFieldSave = () => {
    setEditTownData(prev => {
      const updated = { ...prev }
      updated[editField][editFieldIdx] = editFieldValue
      return updated
    })
    setEditField(null)
    setEditFieldIdx(null)
    setEditFieldValue(null)
  }
  const handleEditFieldCancel = () => {
    setEditField(null)
    setEditFieldIdx(null)
    setEditFieldValue(null)
  }
  const handleAddField = (field, emptyValue) => {
    setEditField(field)
    setEditFieldIdx((editTownData?.[field]?.length || 0))
    setEditFieldValue(emptyValue)
  }
  const handleDeleteField = (field, idx) => {
    setEditTownData(prev => {
      const updated = { ...prev }
      updated[field] = [...(updated[field] || [])]
      updated[field].splice(idx, 1)
      return updated
    })
  }
  const handleEditTownChange = (field, value) => {
    setEditTownData(prev => ({ ...prev, [field]: value }))
  }
  const handleEditMapCenter = (latOrLng, value) => {
    setEditTownData(prev => ({
      ...prev,
      map_center: { ...prev.map_center, [latOrLng]: value }
    }))
  }
  const handleEditDialogClose = () => {
    setEditDialogOpen(false)
    setEditTownData(null)
    setEditField(null)
    setEditFieldIdx(null)
  }
  const handleEditDialogSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`${API_URL}/towns/${selectedTown.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editTownData)
      })
      if (!res.ok) throw new Error('Error al guardar los cambios')
      // update local state
      setTowns(towns => towns.map(t => t.id === selectedTown.id ? editTownData : t))
      handleEditDialogClose()
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Gestión de Pueblos y Barrios</Typography>
      </Box>

      {loading && <Typography>Cargando pueblos...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && (
        <Grid container spacing={3}>
          {towns.map((town, idx) => (
            <Grid item xs={12} md={6} key={town.nombre || idx}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">{town.nombre}</Typography>
                    <Box>
                      <Chip label={town.file || town.nombre} size="small" />
                      <IconButton onClick={() => handleEditTown(town)} size="small" sx={{ ml: 1 }}><EditIcon /></IconButton>
                    </Box>
                  </Box>
                  {/* Edit Town Dialog */}
                  <Dialog open={editDialogOpen} onClose={handleEditDialogClose} maxWidth="md" fullWidth>
                    <DialogTitle>
                      Editar Pueblo
                      <IconButton onClick={handleEditDialogClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                        <CloseIcon />
                      </IconButton>
                    </DialogTitle>
                    <DialogContent>
                      {editTownData && (
                        <Box>
                          <TextField
                            label="Nombre"
                            value={editTownData.nombre || ''}
                            onChange={e => handleEditTownChange('nombre', e.target.value)}
                            fullWidth
                            margin="normal"
                          />
                          <TextField
                            label="Archivo"
                            value={editTownData.file || ''}
                            onChange={e => handleEditTownChange('file', e.target.value)}
                            fullWidth
                            margin="normal"
                          />
                          <Box display="flex" gap={2} mb={2}>
                            <TextField
                              label="Latitud"
                              type="number"
                              value={editTownData.map_center?.lat || ''}
                              onChange={e => handleEditMapCenter('lat', parseFloat(e.target.value))}
                              margin="normal"
                            />
                            <TextField
                              label="Longitud"
                              type="number"
                              value={editTownData.map_center?.lng || ''}
                              onChange={e => handleEditMapCenter('lng', parseFloat(e.target.value))}
                              margin="normal"
                            />
                          </Box>
                          {/* Categories */}
                          <EditableArray
                            label="Categorías"
                            items={editTownData.categories || []}
                            getLabel={cat => cat.label}
                            onAdd={() => handleAddField('categories', { value: '', label: '' })}
                            onEdit={idx => handleEditField('categories', idx)}
                            onDelete={idx => handleDeleteField('categories', idx)}
                          />
                          {/* Barrios */}
                          <EditableArray
                            label="Barrios"
                            items={editTownData.barrios || []}
                            getLabel={barrio => barrio.nombre}
                            onAdd={() => handleAddField('barrios', { nombre: '', color: '', center: '' })}
                            onEdit={idx => handleEditField('barrios', idx)}
                            onDelete={idx => handleDeleteField('barrios', idx)}
                          />
                          {/* Comunidades */}
                          <EditableArray
                            label="Comunidades"
                            items={editTownData.comunidades || []}
                            getLabel={comunidad => comunidad.nombre}
                            onAdd={() => handleAddField('comunidades', { nombre: '', center: '', barrios: [] })}
                            onEdit={idx => handleEditField('comunidades', idx)}
                            onDelete={idx => handleDeleteField('comunidades', idx)}
                          />
                        </Box>
                      )}
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleEditDialogClose} startIcon={<CloseIcon />}>Cancelar</Button>
                      <Button onClick={handleEditDialogSave} startIcon={<SaveIcon />} disabled={saving} variant="contained" color="primary">Guardar</Button>
                    </DialogActions>
                  </Dialog>
                  {/* Edit Array Item Dialog (simple version) */}
                  <Dialog open={!!editField} onClose={handleEditFieldCancel}>
                    <DialogTitle>Editar</DialogTitle>
                    <DialogContent>
                      {editField && editFieldValue && (() => {
                        if (editField === 'categories') {
                          return <>
                            <TextField label="Value" value={editFieldValue.value} onChange={e => handleEditFieldValueChange({ ...editFieldValue, value: e.target.value })} fullWidth margin="normal" />
                            <TextField label="Label" value={editFieldValue.label} onChange={e => handleEditFieldValueChange({ ...editFieldValue, label: e.target.value })} fullWidth margin="normal" />
                          </>
                        }
                        if (editField === 'barrios') {
                          return <>
                            <TextField label="Nombre" value={editFieldValue.nombre} onChange={e => handleEditFieldValueChange({ ...editFieldValue, nombre: e.target.value })} fullWidth margin="normal" />
                            <TextField label="Color" value={editFieldValue.color} onChange={e => handleEditFieldValueChange({ ...editFieldValue, color: e.target.value })} fullWidth margin="normal" />
                            <TextField label="Center" value={editFieldValue.center} onChange={e => handleEditFieldValueChange({ ...editFieldValue, center: e.target.value })} fullWidth margin="normal" />
                          </>
                        }
                        if (editField === 'comunidades') {
                          return <>
                            <TextField label="Nombre" value={editFieldValue.nombre} onChange={e => handleEditFieldValueChange({ ...editFieldValue, nombre: e.target.value })} fullWidth margin="normal" />
                            <TextField label="Center" value={editFieldValue.center} onChange={e => handleEditFieldValueChange({ ...editFieldValue, center: e.target.value })} fullWidth margin="normal" />
                            <TextField label="Barrios (separados por coma)" value={editFieldValue.barrios?.join(', ') || ''} onChange={e => handleEditFieldValueChange({ ...editFieldValue, barrios: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} fullWidth margin="normal" />
                          </>
                        }
                        return null
                      })()}
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleEditFieldCancel}>Cancelar</Button>
                      <Button onClick={handleEditFieldSave} variant="contained">Guardar</Button>
                    </DialogActions>
                  </Dialog>

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
      )}

      {!loading && !error && towns.length === 0 && (
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