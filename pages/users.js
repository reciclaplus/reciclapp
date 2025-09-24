import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { NoAccess, PermissionGuard } from '../components/common/PermissionGuard'
import Layout from '../components/layout/Layout'
import { API_URL } from '../configuration'

const ROLES = [
  { key: 'read', label: 'Lectura' },
  { key: 'write', label: 'Escritura' },
  { key: 'admin', label: 'Administrador' }
]

const getRoleColor = (role) => {
  switch (role) {
    case 'admin': return 'error'
    case 'write': return 'warning'
    case 'read': return 'default'
    default: return 'default'
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'read'
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

  // Only use dialog for creating a new user
  const handleOpenDialog = () => {
    setEditingUser(null)
    setFormData({
      email: '',
      name: '',
      role: 'read'
    })
    setDialogOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.token
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchUsers()
        handleCloseDialog()
      }
    } catch (error) {
      console.error('Error saving user:', error)
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingUser(null)
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
          await fetchUsers() // Now this works correctly!
        }
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  const columns = [
    { field: 'email', headerName: 'Email', flex: 1 }, // Not editable
    { field: 'name', headerName: 'Nombre', flex: 1, editable: true },
    {
      field: 'role',
      headerName: 'Rol',
      flex: 1,
      editable: true,
      type: 'singleSelect',
      valueOptions: ROLES.map(r => r.key),
      renderCell: (params) => (
        <Chip
          label={ROLES.find(r => r.key === params.value)?.label || params.value}
          color={getRoleColor(params.value)}
          size="small"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton onClick={() => handleDelete(params.row.email)}>
          <DeleteIcon />
        </IconButton>
      )
    }
  ]

  // Handler for inline edits
  const processRowUpdate = async (newRow, oldRow) => {
    try {
      // Only allow editing name and role
      const response = await fetch(`${API_URL}/users/${newRow.email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.token
        },
        body: JSON.stringify({
          name: newRow.name,
          role: newRow.role
        })
      })
      if (!response.ok) throw new Error('Error updating user')
      await fetchUsers()
      return newRow
    } catch (error) {
      console.error(error)
      return oldRow
    }
  }

  return (
    <PermissionGuard role="admin" fallback={<NoAccess />}>
      <Layout>
        <Box p={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4">Gestión de Usuarios</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
            >
              Nuevo Usuario
            </Button>
          </Box>

          <Card>
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={users.map(u => ({ ...u, id: u.email }))}
                columns={columns}
                loading={loading}
                disableRowSelectionOnClick
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                processRowUpdate={processRowUpdate}
                experimentalFeatures={{ newEditingApi: true }}
              />
            </Box>
          </Card>

          {/* Dialog only for new user */}
          <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <form onSubmit={handleSubmit}>
              <DialogTitle>Nuevo Usuario</DialogTitle>
              <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} pt={1}>
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
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancelar</Button>
                <Button type="submit" variant="contained">
                  Crear
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </Box>
      </Layout>
    </PermissionGuard>
  )
}