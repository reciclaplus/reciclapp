/* eslint-disable no-undef */
import MenuIcon from '@mui/icons-material/Menu'
import { FormControl, InputLabel, ListItem, ListItemButton, NativeSelect } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import PropTypes from 'prop-types'
import * as React from 'react'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import ListAltIcon from '@mui/icons-material/ListAlt'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import { TownContext } from '../context/TownContext'
import OpenFile from './gcloud/OpenFile'
import SignIn from './gcloud/SignIn'
import UploadFile from './gcloud/UploadFile'

import Button from '@material-ui/core/Button'
import ScaleIcon from '@mui/icons-material/Scale'

import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import StarBorder from '@mui/icons-material/StarBorder'
import Collapse from '@mui/material/Collapse'
import Script from 'next/script'
import { CLIENT_ID, GOOGLE_API_KEY } from './gcloud/google'

const drawerWidth = 240

function Layout ({ children, ...props }) {
  const { window } = props
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [GoogleAuth, setGoogleAuth] = React.useState()
  const { town, setTown } = React.useContext(TownContext)
  const [open, setOpen] = React.useState(false)

  const handleClick = () => {
    setOpen(!open)
  }

  const handleTownChange = (event) => {
    setTown(event.target.value)
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  function handleClientLoad () {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', initClient)
  }

  function initClient () {
    const SCOPE = 'https://www.googleapis.com/auth/devstorage.full_control'
    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    try {
      gapi.client.init({
        apiKey: GOOGLE_API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPE,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
      }).then(() => {
      // GoogleAuth = gapi.auth2.getAuthInstance();
        setGoogleAuth(gapi.auth2.getAuthInstance())
        console.log(GoogleAuth)
      }
      )
    } catch (e) {
      console.log(e)
    }
  }

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List sx={{ ml: 2 }}>
      <Link href="/list">
          <ListItem disablePadding>

            <ListItemButton key="Lista">
              <ListItemIcon>
                <ListAltIcon />
              </ListItemIcon>
              <ListItemText primary="Lista" />
            </ListItemButton>

          </ListItem>
          </Link>
        <Link href="/map">
        <ListItem disablePadding>
        <ListItemButton onClick={handleClick} key="Mapa">
          <ListItemIcon>
            <MyLocationIcon/>
          </ListItemIcon>
          <ListItemText primary="Mapa" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        </ListItem>
        </Link>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Link href="/downloadMap">
          <ListItem disablePadding>
            <ListItemButton key="Descargar Mapa">
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Descargar Mapa" />
            </ListItemButton>
            </ListItem>
          </Link>
        </Collapse>
        <Link href="/newPdr">
        <ListItem disablePadding>
          <ListItemButton key="Nuevo Punto">
            <ListItemIcon>
              <AddCircleOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Nuevo Punto" />
          </ListItemButton>
          </ListItem>
        </Link>
        <Link href="/pasarPuntos">
        <ListItem disablePadding>
          <ListItemButton key="Pasar Puntos">
            <ListItemIcon>
              <PlaylistAddCheckCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Pasar Puntos" />
          </ListItemButton>
          </ListItem>
        </Link>
        <Link href="/pesada">
        <ListItem disablePadding>
          <ListItemButton key="Pesada">
            <ListItemIcon>
              <ScaleIcon />
            </ListItemIcon>
            <ListItemText primary="Pesada" />
          </ListItemButton>
          </ListItem>
        </Link>
        <Link href="/stats">
        <ListItem disablePadding>
          <ListItemButton key="Estadísticas">
            <ListItemIcon>
              <AnalyticsIcon />
            </ListItemIcon>
            <ListItemText primary="Estadísticas" />
          </ListItemButton>
          </ListItem>
        </Link>
      </List>

      <Divider />

      <List>
        <ListItem>
            <SignIn googleauth={GoogleAuth} setgoogleauth={setGoogleAuth}/>
        </ListItem>
        <ListItem>
            <OpenFile googleauth={GoogleAuth}/>
        </ListItem>
        <ListItem>
            <UploadFile googleauth={GoogleAuth}/>
        </ListItem>
        <Divider />
        <ListItem>
            <FormControl variant="standard">
            <InputLabel id="demo-simple-select-standard-label">Pueblo</InputLabel>
            <NativeSelect
              inputProps={{
                name: 'town',
                id: 'uncontrolled-native'
              }}
              value={town}
              onChange={handleTownChange}
            >
              <option value={'sabanayegua'}>Sabana Yegua</option>
              <option value={'proyecto4'}>Proyecto 4</option>
              <option value={'sample'}>Ejemplo</option>

            </NativeSelect>
          </FormControl>
        </ListItem>
      </List>
    </div>
  )

  const container = window !== undefined ? () => window().document.body : undefined

  return (
    <>
    <Box sx={{ display: { xs: 'block', sm: 'flex' } }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Link href="/">
            <Button style={{ color: '#FFF' }}>
              <Typography variant="h6" noWrap component="div">
                Recicla+
              </Typography>
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
          <Toolbar/>

        {children}
      </Box>
    </Box>
    <Script src='https://apis.google.com/js/api.js' onLoad={handleClientLoad}></Script>
    <Script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></Script>
    </>
  )
}

Layout.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func
}

export default Layout
