import { Button, CardMedia } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { API_URL } from '../../configuration';

export default function LandingPage() {
    const router = useRouter()

    useEffect(() => {

        if (sessionStorage.getItem("id_token")) {
            router.push('/list')
        }
    })

    const login = useGoogleLogin({
        onSuccess: codeResponse => {
            fetch(`${API_URL}/auth?code=${codeResponse.code}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    sessionStorage.setItem("token", data[0])
                    sessionStorage.setItem("id_token", data[1])
                    console.log('Redirecting')
                    router.push('/list')
                })
        },
        flow: 'auth-code',
    })

    return (
        <div style={{ backgroundImage: `url(/landing.jpg)`, height: '100vh', width: '100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
            <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                <Grid container justify="center" alignItems="center" direction="column">
                    <Grid item xs={12}>
                        <Card variant='outlined' sx={{ borderWidth: 3, borderColor: 'secondary.main', borderRadius: 4, backgroundColor: '#F5F5F5' }}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    ReciclApp
                                </Typography>
                                <Typography variant="body2">
                                    La aplicación web del proyecto Recicla+,
                                    <br />
                                    de Nature Power Foundation.
                                </Typography>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item>
                                        <CardMedia
                                            component="img"
                                            height="40"
                                            image="/logo.png"
                                            sx={{ objectFit: "contain" }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <CardMedia
                                            component="img"
                                            height="60"
                                            image="/logo_npf_no_bg.png"
                                            sx={{ objectFit: "contain" }}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                            <CardActions>
                                <Button color='secondary' variant='contained' onClick={() => login()} sx={{ borderRadius: 2 }}>Conéctate</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>

            </Box>
        </div >
    );
}