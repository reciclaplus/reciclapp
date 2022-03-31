import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SignIn from './gcloud/SignIn'
import GCloud from './gcloud/GCloud';
import OpenFile from './gcloud/OpenFile';
import UploadFile from './gcloud/UploadFile';
import Link from 'next/link';
import { TownContext } from '../context/TownContext';
import { FormControl, InputLabel, MenuItem, NativeSelect } from '@mui/material';
import Button from '@mui/material/Button';
import ScaleIcon from '@mui/icons-material/Scale';

import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';



const drawerWidth = 240;

function Layout({children, ...props}) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [GoogleAuth, setGoogleAuth] = React.useState();
  const {town, setTown} = React.useContext(TownContext)
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleTownChange = (event) => {
    setTown(event.target.value);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List  sx={{ml:2}}>
        <Link href="/list">
          <ListItem button key="Lista">
            <ListItemIcon>
              <ListAltIcon />
            </ListItemIcon>
            <ListItemText primary="Lista" />
          </ListItem>
        </Link>
        <Link href="/map">
        <ListItem button onClick={handleClick} key="Mapa">
          <ListItemIcon>
            <MyLocationIcon/>
          </ListItemIcon>
          <ListItemText primary="Mapa" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        </Link>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Link href="/downloadMap">
            <ListItem button key="Descargar Mapa">
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Descargar Mapa" />
            </ListItem>
          </Link>
        </Collapse>
        <Link href="/newPdr">
          <ListItem button key="Nuevo Punto">
            <ListItemIcon>
              <AddCircleOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Nuevo Punto" />
          </ListItem>
        </Link>
        <Link href="/pasarPuntos">
          <ListItem button key="Pasar Puntos">
            <ListItemIcon>
              <PlaylistAddCheckCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Pasar Puntos" />
          </ListItem>
        </Link>
        <Link href="/pesada">
          <ListItem button key="Pesada">
            <ListItemIcon>
              <ScaleIcon />
            </ListItemIcon>
            <ListItemText primary="Pesada" />
          </ListItem>
        </Link>
        <Link href="/stats">
          <ListItem button key="Estadísticas">
            <ListItemIcon>
              <AnalyticsIcon />
            </ListItemIcon>
            <ListItemText primary="Estadísticas" />
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
                id: 'uncontrolled-native',
              }}
              value={town}
              onChange={handleTownChange}
            >
              <option value={"sabanayegua"}>Sabana Yegua</option>
              <option value={"proyecto4"}>Proyecto 4</option>
              <option value={"sample"}>Ejemplo</option>
              
            </NativeSelect>
          </FormControl>
        </ListItem>
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: {xs: 'block', sm: 'flex'} }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
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
            <Button style={{"color": "white"}}>
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
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
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
  );
}

Layout.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default Layout;
