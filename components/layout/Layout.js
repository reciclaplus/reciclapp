/* eslint-disable no-undef */
/* global gapi */
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { FormControl, InputLabel, ListItem, NativeSelect } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import * as CustomParseFormat from 'dayjs/plugin/customParseFormat';
import * as UTC from 'dayjs/plugin/utc';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { API_URL } from '../../configuration';
import { TownContext } from '../../context/TownContext';
import { useCurrentUser } from '../../hooks/queries';
import SignInButton from '../gcloud/SignInButton';
import { Navigation } from './Navigation';
dayjs.extend(CustomParseFormat)
dayjs.extend(UTC)

const drawerWidth = 240

function Layout({ children, ...props }) {

  const { window } = props
  const [mobileOpen, setMobileOpen] = useState(false)
  const [town, setTown] = useContext(TownContext)
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const currentUserQuery = useCurrentUser()
  const user = currentUserQuery.status == 'success' ? currentUserQuery.data['name'] : null
  const picture = currentUserQuery.status == 'success' ? currentUserQuery.data['picture'] : null

  useEffect(() => {

    if (localStorage.refresh_token) {
      const expiry_date = dayjs(localStorage.expiry, 'YYYY-MM-DD HH:mm:ss')
      if (expiry_date.isBefore(dayjs().utc().format('YYYY-MM-DD HH:mm:ss'))) {

        fetch(`${API_URL}/refresh-token`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + localStorage.refresh_token
          }
        }).then(function (response) { return response.json() }
        ).then((data) => {

          localStorage.setItem("token", data["token"])
          localStorage.setItem("id_token", data["id_token"])
          localStorage.setItem("refresh_token", data["refresh_token"])
          localStorage.setItem("expiry", data["expiry"])

        }).then(() => currentUserQuery.refetch())
          .then(() => queryClient.invalidateQueries())

      }
    }

  })

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
          <SignInButton user={user} picture={picture} />
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
              <option value={'sample'}>Ejemplo</option>
            </NativeSelect>
          </FormControl>
        </ListItem>
      </List>
    </div>
  )

  const container = window !== undefined ? () => window().document.body : undefined

  return (

    <Box sx={{ display: { xs: 'block', sm: 'flex' }, height: '100%' }}>
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Recicla+
          </Typography>
          <Link href="/info">
            <IconButton aria-label="info" color="inherit">
              <InfoOutlinedIcon />
            </IconButton>
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
        sx={{ height: '100vh', width: { sm: `calc(100% - ${drawerWidth}px)` }, display: 'flex', flexDirection: 'column' }}
      >
        <Toolbar />

        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
          {children}
        </Box>
      </Box>
    </Box>

  )
}


export default Layout
