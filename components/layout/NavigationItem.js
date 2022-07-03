/* eslint-disable no-undef */
import { ListItem, ListItemButton } from '@mui/material'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import Link from 'next/link'

export default function NavigationItem (props) {
  return (
        <Link href={props.href}>
        <ListItem disablePadding>
          <ListItemButton key={props.name}>
            <ListItemIcon>
              {props.icon}
            </ListItemIcon>
            <ListItemText primary={props.name} />
          </ListItemButton>
          </ListItem>
        </Link>
  )
}
