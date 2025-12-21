import RecyclingIcon from '@mui/icons-material/Recycling'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { COLORS } from './theme'

/**
 * Header component with app bar for dashboards
 * @param {string} title - Dashboard title (default: 'Recicla+ Dashboard')
 */
export default function DashboardHeader({ title = 'Recicla+ Dashboard' }) {
    return (
        <AppBar position="static" sx={{ bgcolor: COLORS.primary }}>
            <Toolbar>
                <RecyclingIcon sx={{ mr: 2, fontSize: 32 }} />
                <Typography variant="h5" component="h1" sx={{ flexGrow: 1, fontWeight: 600 }}>
                    {title}
                </Typography>
            </Toolbar>
        </AppBar>
    )
}
