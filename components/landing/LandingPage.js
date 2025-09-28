import { Button, CardMedia } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useGoogleLogin } from '@react-oauth/google';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { API_URL } from '../../configuration';

export default function LandingPage() {
    const router = useRouter()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (localStorage.getItem("id_token")) {
            router.push('/list')
        }
    }, [router])

    const login = useGoogleLogin({
        onSuccess: codeResponse => {
            fetch(`${API_URL}/auth?code=${codeResponse.code}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': 'Bearer ' + codeResponse.code,
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    localStorage.setItem("token", data["token"])
                    localStorage.setItem("id_token", data["id_token"])
                    localStorage.setItem("refresh_token", data["refresh_token"])
                    localStorage.setItem("expiry", data["expiry"])
                })
                .then(() => queryClient.invalidateQueries())
                .then(() => {
                    router.push('/list')
                })
        },
        flow: 'auth-code',
    })

    return (
        <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
            {/* Optimized background image using Next.js Image */}
            <Image
                src="/landing.jpg"
                alt="Landing background"
                fill
                style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                }}
                priority
                sizes="100vw"
            />
            
            {/* Content overlay */}
            <Box sx={{ 
                position: 'relative', 
                zIndex: 1, 
                height: '100%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.3)' // Slight overlay for better text contrast
            }}>

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
                                        <Image
                                            src="/logo.png"
                                            alt="Logo"
                                            width={40}
                                            height={40}
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Image
                                            src="/logo_npf_no_bg.png"
                                            alt="NPF Logo"
                                            width={60}
                                            height={60}
                                            style={{ objectFit: 'contain' }}
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