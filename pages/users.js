import { useState, useEffect } from 'react'
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
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import Layout from '../components/layout/Layout'
import { PermissionGuard } from '../components/common/PermissionGuard'
import { API_URL } from '../configuration'

const PERMISSIONS = [
  { key: 'read_pdr', label: 'Leer PDR' },
  { key: 'write_pdr', label: 'Escribir PDR' },
  { key: 'delete_pdr', label: 'Eliminar PDR' },
  { key: 'read_recogida', label: 'Leer Recogida' },
  { key: 'write_recogida', label: 'Escribir Recogida' },
  { key: 'read_weight', label: 'Leer Peso' },
  { key: 'write_weight', label: 'Escribir Peso' },
  { key: 'manage_users', label: 'Gestionar Usuarios' }
]

const ROLES = [
  { key: 'viewer', label: 'Visualizador' },
  { key: 'editor', label: 'Editor' },
  { key: 'admin', label: 'Administrador' }
]

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'viewer',
    permissions: []
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.token
        }
      })
      if (response.ok) {
        const userData = await response.json()
        setUsers(userData)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingUser 
        ? `${API_URL}/users/${editingUser.email}`
        : `${API_URL}/users`
      
      const method = editingUser ? 'PUT' : 'POST'
      const body = editingUser 
        ? { role: formData.role, permissions: formData.permissions }
        : formData

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.token
        },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        await fetchUsers()
        handleCloseDialog()
      }
    } catch (error) {
      console.error('Error saving user:', error)
    }
  }

  const handleDelete = async (userEmail) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        const response = await fetch(`${API_URL}/users/${userEmail}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + localStorage.token
          }
        })
        
        if (response.ok) {
          await fetchUsers()
        }
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions || []
      })
    } else {
      setEditingUser(null)
      setFormData({
        email: '',
        name: '',
        role: 'viewer',
        permissions: []
      })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingUser(null)
  }

  const handlePermissionChange = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error'
      case 'editor': return 'warning'
      case 'viewer': return 'default'
      default: return 'default'
    }
  }

  return (
    <PermissionGuard permission="manage_users" fallback={
      <Layout>
        <Box p={3}>
          <Typography variant="h4">Acceso Denegado</Typography>
          <Typography>No tienes permisos para gestionar usuarios.</Typography>
        </Box>
      </Layout>
    }>
      <Layout>
        <Box p={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4">Gestión de Usuarios</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Nuevo Usuario
            </Button>
          </Box>

          <Card>
            <CardContent>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Rol</TableCell>
                      <TableCell>Permisos</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.email}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>
                          <Chip 
                            label={ROLES.find(r => r.key === user.role)?.label || user.role}
                            color={getRoleColor(user.role)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" flexWrap="wrap" gap={0.5}>
                            {(user.permissions || []).map(permission => (
                              <Chip
                                key={permission}
                                label={PERMISSIONS.find(p => p.key === permission)?.label || permission}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleOpenDialog(user)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(user.email)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <form onSubmit={handleSubmit}>
              <DialogTitle>
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </DialogTitle>
              <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} pt={1}>
                  {!editingUser && (
                    <>
                      <TextField
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        fullWidth
                      />
                      <TextField
                        label="Nombre"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                        fullWidth
                      />
                    </>
                  )}
                  
                  <FormControl fullWidth>
                    <InputLabel>Rol</InputLabel>
                    <Select
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      label="Rol"
                    >
                      {ROLES.map(role => (
                        <MenuItem key={role.key} value={role.key}>
                          {role.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Typography variant="h6">Permisos</Typography>
                  <FormGroup>
                    {PERMISSIONS.map(permission => (
                      <FormControlLabel
                        key={permission.key}
                        control={
                          <Checkbox
                            checked={formData.permissions.includes(permission.key)}
                            onChange={() => handlePermissionChange(permission.key)}
                          />
                        }
                        label={permission.label}
                      />
                    ))}
                  </FormGroup>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancelar</Button>
                <Button type="submit" variant="contained">
                  {editingUser ? 'Actualizar' : 'Crear'}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </Box>
      </Layout>
    </PermissionGuard>
  )
}