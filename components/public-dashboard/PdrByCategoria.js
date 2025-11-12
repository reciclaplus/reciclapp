import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { usePublicPdrByCategoria } from '../../hooks/queries'

export default function PdrByCategoria () {
  const categoriaQuery = usePublicPdrByCategoria()
  const categorias = categoriaQuery.status === 'success' ? categoriaQuery.data : {}

  const categoriaLabels = {
    casa: 'Particulares',
    negocio: 'Negocios',
    escuela: 'Centros educativos',
    otros: 'Otros'
  }

  return (
    <Box>
      <Typography variant="h6" align="center" color="#494791" sx={{ mb: 2 }}>
        Puntos de recogida por categoría
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(categorias).map(([categoria, count]) => (
          <Grid item xs={6} key={categoria}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="#494791">
                {count}
              </Typography>
              <Typography variant="body1" color="#8F9147">
                {categoriaLabels[categoria] || categoria}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
