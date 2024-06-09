import {
    createTheme, ThemeProvider
} from '@mui/material/styles'
import Head from 'next/head'
import PublicDashboard from '../components/public-dashboard/PublicDashboard'
import styles from '../styles/Home.module.css'

const theme = createTheme({
    typography: {
        fontFamily: [
            'Oswald',
        ].join(','),
    },
    palette: {
        primary: {
            // Purple and green play nicely together.
            main: '#EAAB32',
            contrastText: '#fff'
        },
        secondary: {
            // This is green.A700 as hex.
            main: '#269FDA'
        }
    }
})

export default function PublicDashboardPage() {
    return (
        <ThemeProvider theme={theme}>
            <div className={styles.container}>
                <Head>
                    <title>ReciclApp</title>
                    <meta name="public dashboard" content="public dashboard" />
                    <link rel="icon" type="image/png" href="/logo.png" />
                </Head>
                <PublicDashboard />
            </div>
        </ThemeProvider>
    )
}
