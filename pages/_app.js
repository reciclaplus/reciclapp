import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider
} from '@mui/material/styles'
import { useState } from 'react'
import { GOOGLE_API_KEY } from '../components/gcloud/google'
import { PdrContext } from '../context/PdrContext'
import { TownContext } from '../context/TownContext'
import { WeightContext } from '../context/WeightContext'
import '../styles/globals.css'

function MyApp ({ Component, pageProps }) {
  const [pdr, setPdr] = useState([])
  const contextValue = { pdr, setPdr }
  const [town, setTown] = useState('sabanayegua')
  const townContextValue = { town, setTown }
  const [weight, setWeight] = useState([])
  const weightContextValue = { weight, setWeight }

  let theme = createTheme()
  theme = responsiveFontSizes(theme)

  return (
    <TownContext.Provider value={townContextValue}>
    <PdrContext.Provider value={contextValue}>
      <WeightContext.Provider value={weightContextValue}>
      <ThemeProvider theme={theme}>
      <Component {...pageProps} />
      <script async defer src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}`}></script>
      </ThemeProvider>
      </WeightContext.Provider>
    </PdrContext.Provider>
    </TownContext.Provider>
  )
}

export default MyApp
