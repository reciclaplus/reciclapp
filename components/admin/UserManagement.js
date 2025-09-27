import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { API_URL } from '../../configuration'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserRole, setNewUserRole] = useState('user')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const usersData = await response.json()
      setUsers(usersData)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/users?email=${newUserEmail}&role=${newUserRole}`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to add user')
      }

      setOpenDialog(false)
      setNewUserEmail('')
      setNewUserRole('user')
      await fetchUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleUpdateUserRole = async (email, newRole) => {
    try {
      const response = await fetch(`${API_URL}/admin/users/${email}/role?role=${newRole}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to update user role')
      }

      await fetchUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteUser = async (email) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario ${email}?`)) {
      try {
        const response = await fetch(`${API_URL}/admin/users/${email}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to delete user')
        }

        await fetchUsers()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error'
      case 'user':
        return 'primary'
      default:
        return 'default'
    }
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
          Gestión de Usuarios
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Agregar Usuario
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Creado por</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.email}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={getRoleColor(user.role)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{user.created_by || '-'}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setEditingUser(user)
                      setNewUserRole(user.role)
                      setOpenDialog(true)
                    }}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteUser(user.email)}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Editar Usuario' : 'Agregar Usuario'}
        </DialogTitle>
        <DialogContent>
          {!editingUser && (
            <TextField
              fullWidth
              label="Email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              margin="normal"
              type="email"
              required
            />
          )}
          <FormControl fullWidth margin="normal">
            <InputLabel>Rol</InputLabel>
            <Select
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)}
            >
              <MenuItem value="user">Usuario</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenDialog(false)
            setEditingUser(null)
            setNewUserEmail('')
            setNewUserRole('user')
          }}>
            Cancelar
          </Button>
          <Button 
            onClick={editingUser 
              ? () => handleUpdateUserRole(editingUser.email, newUserRole)
              : handleAddUser
            }
            variant="contained"
          >
            {editingUser ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}