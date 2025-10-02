/* eslint-disable no-undef */
import { ListItem, ListItemButton } from '@mui/material'
import List from '@mui/material/List'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import ListAltIcon from '@mui/icons-material/ListAlt'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import PeopleIcon from '@mui/icons-material/People'
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle'
import Link from 'next/link'

import ScaleIcon from '@mui/icons-material/Scale'

import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import StarBorder from '@mui/icons-material/StarBorder'
import Collapse from '@mui/material/Collapse'
import { PermissionGuard } from '../common/PermissionGuard'
import NavigationItem from './NavigationItem'

export function Navigation(props) {
  return (
    <List sx={{ m: 1, ml: 2 }} disablePadding={true}>

      <PermissionGuard role="read">
        <NavigationItem href="/list" name="Lista" icon={<ListAltIcon />} />
      </PermissionGuard>

      <PermissionGuard role="read">
        <Link href="/map">
          <ListItem disablePadding>
            <ListItemButton sx={{ p: 0 }} onClick={props.handleClick} key="Mapa">
              <ListItemIcon>
                <MyLocationIcon />
              </ListItemIcon>
              <ListItemText primary="Mapa" />
              {props.open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
        </Link>
        <Collapse in={props.open} timeout="auto" unmountOnExit>
          <Link href="/downloadMap">
            <ListItem disablePadding>
              <ListItemButton sx={{ p: 0 }} key="Descargar Mapa">
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText primary="Descargar Mapa" />
              </ListItemButton>
            </ListItem>
          </Link>
        </Collapse>
      </PermissionGuard>

      <PermissionGuard role="write">
        <NavigationItem href="/newPdr" name="Nuevo Punto" icon={<AddCircleOutlineIcon />} />
      </PermissionGuard>

      <PermissionGuard role="write">
        <NavigationItem href="/pasarPuntos" name="Pasar Puntos" icon={<PlaylistAddCheckCircleIcon />} />
      </PermissionGuard>

      <PermissionGuard role="write">
        <NavigationItem href="/pesada" name="Pesada" icon={<ScaleIcon />} />
      </PermissionGuard>

      <PermissionGuard role="read">
        <NavigationItem href="/stats" name="Estadísticas" icon={<AnalyticsIcon />} />
      </PermissionGuard>

      <PermissionGuard role="admin">
        <NavigationItem href="/admin" name="Panel Admin" icon={<AdminPanelSettingsIcon />} />
      </PermissionGuard>

    </List>
  )
}
