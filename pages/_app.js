import '../styles/globals.css'
import { useState, useEffect } from 'react'
import { PdrContext } from '../context/PdrContext';
import { TownContext } from '../context/TownContext';
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@mui/material/styles';
import { GOOGLE_API_KEY } from '../components/gcloud/google';

function MyApp({ Component, pageProps }) {
  const [pdr, setPdr] = useState([]);
  const contextValue = { pdr, setPdr };
  const [town, setTown] = useState("sabanayegua");
  const townContextValue = { town, setTown };

  let theme = createTheme();
  theme = responsiveFontSizes(theme);

  return (
    <TownContext.Provider value={townContextValue}>
    <PdrContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
      <Component {...pageProps} />
      
      <script async defer src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}`}></script>
      </ThemeProvider>
    </PdrContext.Provider>
    </TownContext.Provider>
  )
  
}

export default MyApp
