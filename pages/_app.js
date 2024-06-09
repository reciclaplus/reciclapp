import {
  createTheme, ThemeProvider
} from '@mui/material/styles'
import { GoogleOAuthProvider } from '@react-oauth/google'
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import Head from 'next/head'
import { useState } from 'react'
import { GOOGLE_API_KEY } from '../components/gcloud/google'
import { PdrContext } from '../context/PdrContext'
import { StatsContext } from '../context/StatsContext'
import { TownContext } from '../context/TownContext'
import { WeightContext } from '../context/WeightContext'
import '../styles/globals.css'
// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
    },
  },
})

const theme = createTheme({
  typography: {
    fontFamily: [
      // 'Oswald',
    ].join(','),
  },
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: '#47916E',
      contrastText: '#fff'
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#B43C88'
    }
  }
})

function MyApp({ Component, pageProps }) {
  const [pdr, setPdr] = useState([])
  const contextValue = { pdr, setPdr }
  const [town, setTown] = useState('sabanayegua')
  const townContextValue = { town, setTown }
  const [weight, setWeight] = useState([])
  const weightContextValue = { weight, setWeight }
  const [stats, setStats] = useState([])
  const statsContextValue = { stats, setStats }

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId="744932747687-7v0siduke54vc60617ibt1m3gpmp207a.apps.googleusercontent.com">
        <ThemeProvider theme={theme}>
          <TownContext.Provider value={townContextValue}>
            <PdrContext.Provider value={contextValue}>
              <WeightContext.Provider value={weightContextValue}>
                <StatsContext.Provider value={statsContextValue}>
                  <Head>
                    <title>ReciclApp</title>
                    <meta name="description" content="Listado de familias" />
                    <link rel="icon" type="image/png" href="/logo.png" />
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap" rel="stylesheet" />
                  </Head>
                  <Component {...pageProps} />
                  <script async defer src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}`}></script>
                </StatsContext.Provider>
              </WeightContext.Provider>
            </PdrContext.Provider>
          </TownContext.Provider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  )
}

export default MyApp
