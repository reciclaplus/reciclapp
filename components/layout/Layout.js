/* eslint-disable no-undef */
import MenuIcon from '@mui/icons-material/Menu'
import { FormControl, InputLabel, ListItem, NativeSelect } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import PropTypes from 'prop-types'
import * as React from 'react'
import { TownContext } from '../../context/TownContext'
import OpenFile from '../gcloud/OpenFile'
import SignIn from '../gcloud/SignIn'
import UploadFile from '../gcloud/UploadFile'

import Button from '@mui/material/Button'

import Script from 'next/script'
import { CLIENT_ID, GOOGLE_API_KEY } from '../gcloud/google'
import { Navigation } from './Navigation'

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
      <Navigation handleClick={handleClick} open={open}></Navigation>

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
              <option value={'sabanayegua_cardboard'}>Sabana Yegua - Cartón</option>
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
