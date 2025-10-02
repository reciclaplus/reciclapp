import { Assessment as AssessmentIcon, People as PeopleIcon, Place as PlaceIcon, Scale as ScaleIcon } from '@mui/icons-material'
import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { usePdr, useWeight } from '../../hooks/queries'
import { conf } from '../../configuration'

function StatCard({ title, value, subtitle, icon, color = 'primary' }) {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}.main`,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function GlobalStatistics() {
  const pdrQuery = usePdr()
  const weightQuery = useWeight()
  const [stats, setStats] = useState({
    totalPoints: 0,
    totalTowns: 0,
    totalNeighborhoods: 0,
    totalWeight: 0,
    activePoints: 0
  })

  useEffect(() => {
    if (pdrQuery.status === 'success' && pdrQuery.data) {
      const points = pdrQuery.data
      const activePoints = points.filter(p => p.activo === true || p.activo === 'true').length

      setStats(prev => ({
        ...prev,
        totalPoints: points.length,
        activePoints
      }))
    }
  }, [pdrQuery.status, pdrQuery.data])

  useEffect(() => {
    if (weightQuery.status === 'success' && weightQuery.data) {
      const weights = weightQuery.data
      const totalWeight = weights.reduce((sum, w) => sum + (w.peso || 0), 0)
      
      setStats(prev => ({
        ...prev,
        totalWeight: totalWeight.toFixed(2)
      }))
    }
  }, [weightQuery.status, weightQuery.data])

  useEffect(() => {
    const towns = Object.keys(conf)
    let totalNeighborhoods = 0

    towns.forEach(townKey => {
      const town = conf[townKey]
      if (town.barrios) {
        totalNeighborhoods += town.barrios.length
      }
    })

    setStats(prev => ({
      ...prev,
      totalTowns: towns.length,
      totalNeighborhoods
    }))
  }, [])

  return (
    <Box>
      <Typography variant="h5" gutterBottom mb={3}>
        Estadísticas Globales
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Puntos"
            value={stats.totalPoints}
            subtitle={`${stats.activePoints} activos`}
            icon={<PlaceIcon fontSize="large" />}
            color="primary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pueblos"
            value={stats.totalTowns}
            subtitle="Pueblos configurados"
            icon={<AssessmentIcon fontSize="large" />}
            color="secondary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Barrios"
            value={stats.totalNeighborhoods}
            subtitle="Total de barrios"
            icon={<PeopleIcon fontSize="large" />}
            color="success"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Peso Total"
            value={`${stats.totalWeight} lbs`}
            subtitle="Material recogido"
            icon={<ScaleIcon fontSize="large" />}
            color="warning"
          />
        </Grid>
      </Grid>

      <Box mt={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Resumen por Pueblo
            </Typography>
            <Grid container spacing={2} mt={1}>
              {Object.keys(conf).map(townKey => {
                const town = conf[townKey]
                const townPoints = pdrQuery.data?.filter(p => p.pueblo === townKey) || []
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={townKey}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {town.nombre}
                        </Typography>
                        <Box display="flex" justifyContent="space-between" mt={1}>
                          <Typography variant="body2" color="textSecondary">
                            Puntos:
                          </Typography>
                          <Typography variant="body2">
                            {townPoints.length}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" color="textSecondary">
                            Barrios:
                          </Typography>
                          <Typography variant="body2">
                            {town.barrios?.length || 0}
                          </Typography>
                        </Box>
                        {town.comunidades && (
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2" color="textSecondary">
                              Comunidades:
                            </Typography>
                            <Typography variant="body2">
                              {town.comunidades.length}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
