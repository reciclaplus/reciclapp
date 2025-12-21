import Typography from '@mui/material/Typography'
import { COLORS } from './theme'

/**
 * SectionHeader - Consistent section title styling
 */
export default function SectionHeader({ children }) {
    return (
        <Typography
            variant="h4"
            component="h2"
            sx={{
                color: COLORS.primary,
                fontWeight: 600,
                mb: 3,
                mt: 4
            }}
        >
            {children}
        </Typography>
    )
}
