import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function SingleStat({ stat, text, subtext }) {
    return (

        <Box >
            <Typography variant="h3" align='center' color='#494791' sx={{ display: 'block', overflow: 'auto' }}>
                {stat}
            </Typography>


            <Typography variant="h5" align='center' color='#494791' sx={{ display: 'block', overflow: 'auto' }}>
                {text}
            </Typography>
            <Typography variant="subtitle1" align='center' color='#8F9147' >
                {subtext}
            </Typography>
        </Box>


    );
}