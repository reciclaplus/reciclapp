import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

/**
 * ChartCard - Wrapper for chart components with consistent styling
 * @param {string} title - Card title
 * @param {React.ReactNode} toolbar - Optional toolbar/filter content between title and chart
 * @param {React.ReactNode} children - Chart content
 * @param {number} height - Minimum height for chart area (default: 400)
 */
export default function ChartCard({ title, toolbar, children, height = 400 }) {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', mb: toolbar ? 0 : 2 }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                        {title}
                    </Typography>
                    {toolbar && (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {toolbar}
                        </Box>
                    )}
                </Box>
                <Box sx={{ minHeight: height, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'visible' }}>
                    {children}
                </Box>
            </CardContent>
        </Card>
    )
}
