import RecyclingIcon from '@mui/icons-material/Recycling'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { COLORS } from './theme'

/**
 * Header component with app bar for public dashboard
 */
export default function DashboardHeader() {
    return (
        <AppBar position="static" sx={{ bgcolor: COLORS.primary }}>
            <Toolbar>
                <RecyclingIcon sx={{ mr: 2, fontSize: 32 }} />
                <Typography variant="h5" component="h1" sx={{ flexGrow: 1, fontWeight: 600 }}>
                    Recicla+ Dashboard Público
                </Typography>
            </Toolbar>
        </AppBar>
    )
}
