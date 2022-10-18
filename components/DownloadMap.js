
import { Button, FormControl, InputLabel, NativeSelect } from '@mui/material'

import { useContext, useState } from 'react'
import { conf } from '../configuration'
import { PdrContext } from '../context/PdrContext'
import { TownContext } from '../context/TownContext'
import { createMapURL, download } from './StaticMap'

export default function DownloadMap (props) {
  const { pdr } = useContext(PdrContext)
  const { town } = useContext(TownContext)

  const barrios = []
  conf[town].barrios.forEach((barrio) => { barrios.push(barrio.nombre) })

  const [barrio, setBarrio] = useState('')

  function handleSubmit (event) {
    event.preventDefault()
    let center = ''
    console.log(center)
    conf[town].barrios.forEach(item => {
      if (item.nombre === barrio) {
        center = item.center
      }
    })
    download(createMapURL(pdr, barrio, center))
    return false
  }
  return (
        <form onSubmit={handleSubmit}>
            <div>
                <FormControl>
                    <InputLabel>Barrio</InputLabel>
                    <NativeSelect
                    inputProps={{
                      name: 'barrio',
                      id: 'barrio'
                    }}
                    id="barrio-select"
                    value={barrio}
                    onChange={(event) => setBarrio(event.target.value)}
                    >
                    <option value=""></option>
                    {barrios.map(item => {
                      return (<option value={item} key={item}>{item}</option>)
                    })}
                    </NativeSelect>
                </FormControl>
                </div>
                <br/>
                <div>
                <Button variant="contained" color="primary" type="submit">
                    Descargar mapa
                </Button>
            </div>
        </form>
  )
}
