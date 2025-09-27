import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PeopleIcon from '@mui/icons-material/People'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import RestoreIcon from '@mui/icons-material/Restore'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { API_URL } from '../../configuration'

export default function GlobalStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchGlobalStats()
  }, [])

  const fetchGlobalStats = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/admin/stats/global`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch global stats')
      }

      const statsData = await response.json()
      setStats(statsData)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <Card elevation={2}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="h2" color={`${color}.main`}>
              {value?.toLocaleString() || '-'}
            </Typography>
          </Box>
          <Box color={`${color}.main`}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Estadísticas Globales
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {stats && (
        <>
          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total PDRs"
                value={stats.total_pdrs}
                icon={<LocationOnIcon fontSize="large" />}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Recogidas"
                value={stats.total_recogidas}
                icon={<RestoreIcon fontSize="large" />}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Usuarios"
                value={stats.total_users}
                icon={<PeopleIcon fontSize="large" />}
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Pueblos"
                value={stats.total_towns}
                icon={<LocationCityIcon fontSize="large" />}
                color="warning"
              />
            </Grid>
          </Grid>

          {/* Recent Activity */}
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <TrendingUpIcon color="primary" />
                <Typography variant="h6" component="h3">
                  Actividad Reciente
                </Typography>
              </Box>

              {stats.recent_activity && stats.recent_activity.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Semana</TableCell>
                        <TableCell>Pueblo</TableCell>
                        <TableCell>Barrio</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Peso (kg)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.recent_activity.map((activity, index) => (
                        <TableRow key={activity.id || index}>
                          <TableCell>{activity.week}</TableCell>
                          <TableCell>{activity.pueblo || '-'}</TableCell>
                          <TableCell>{activity.barrio || '-'}</TableCell>
                          <TableCell>
                            {activity.tipo_recogida && (
                              <Chip 
                                label={activity.tipo_recogida} 
                                size="small" 
                                color="primary" 
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            {activity.peso_total_kg 
                              ? `${activity.peso_total_kg} kg`
                              : '-'
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="textSecondary">
                  No hay actividad reciente disponible
                </Typography>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  )
}