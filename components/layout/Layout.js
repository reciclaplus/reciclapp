/* eslint-disable no-undef */
/* global gapi */
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
import { useContext, useState } from 'react'
import { TownContext } from '../../context/TownContext'
import OpenFile from '../gcloud/OpenFile'
import UploadFile from '../gcloud/UploadFile'

import Button from '@mui/material/Button'

import SignIn from '../gcloud/SignIn'
import { Navigation } from './Navigation'

const drawerWidth = 240

function Layout ({ children, ...props }) {
  
  const { window } = props
  const [mobileOpen, setMobileOpen] = useState(false)
  const [tokenClient, setTokenClient] = useState()
  const [accessToken, setAccessToken] = useState()
  const [GoogleAuth, setGoogleAuth] = useState()
  const { town, setTown } = useContext(TownContext)
  const [open, setOpen] = useState(false)
  
  const handleClick = () => {
    setOpen(!open)
  }

  const handleTownChange = (event) => {
    setTown(event.target.value)
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <Navigation handleClick={handleClick} open={open}></Navigation>

      <Divider />

      <List>
        <ListItem>
            <SignIn accessToken={accessToken} setAccessToken={setAccessToken} setgoogleauth={setGoogleAuth} tokenClient={tokenClient} setTokenClient={setTokenClient}/>
        </ListItem>
        <ListItem>
            <OpenFile accessToken={accessToken}/>
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
        aria-label="navigation"
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
    </>
  )
}


export default Layout
