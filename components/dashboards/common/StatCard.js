import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { COLORS } from './theme'

/**
 * StatCard - Displays a single statistic with title and subtitle
 */
export default function StatCard({ value, title, subtitle, loading }) {
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                {loading ? (
                    <CircularProgress size={40} sx={{ color: COLORS.primary }} />
                ) : (
                    <Typography
                        variant="h3"
                        component="div"
                        sx={{ color: COLORS.primary, fontWeight: 700, mb: 1 }}
                    >
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </Typography>
                )}
                <Typography variant="h6" sx={{ color: COLORS.primary, fontWeight: 600 }}>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="body2" sx={{ color: COLORS.secondary, mt: 0.5 }}>
                        {subtitle}
                    </Typography>
                )}
            </CardContent>
        </Card>
    )
}
