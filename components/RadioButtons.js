import { green, red, yellow } from '@mui/material/colors'
import Radio from '@mui/material/Radio'
import React from 'react'

const GreenRadio = ({sx, ...props}) => <Radio sx={{
  color: green[400],
  '&.Mui-checked': {
    color: green[600],
  },
...sx}} {...props}/>

const RedRadio = ({sx, ...props}) => <Radio sx={{
  color: red[800],
  '&.Mui-checked': {
    color: red[600],
  },
...sx}} {...props}/>

const YellowRadio = ({sx, ...props}) => <Radio sx={{
  color: yellow[400],
  '&.Mui-checked': {
    color: yellow[600],
  },
...sx}} {...props}/>

export { RedRadio, YellowRadio, GreenRadio }

