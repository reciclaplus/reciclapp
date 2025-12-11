import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

/**
 * ChartCard - Wrapper for chart components with consistent styling
 */
export default function ChartCard({ title, children, height = 400 }) {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 0 }}>
                    {title}
                </Typography>
                <Box sx={{ minHeight: height, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible' }}>
                    {children}
                </Box>
            </CardContent>
        </Card>
    )
}
