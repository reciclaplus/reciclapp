
import { Button, FormControl, InputLabel, NativeSelect } from '@mui/material'

import { useContext, useState } from 'react'
import { PdrContext } from '../../context/PdrContext'
import { useTownContext } from '../../context/TownContext'
import { createMapURL, download } from './StaticMap'

export default function DownloadMap(props) {
  const { pdr } = useContext(PdrContext)
  const { townConfig } = useTownContext()

  const barrios = townConfig?.comunidades?.flatMap(c => c.barrios?.map(b => b.nombre) || []) || [];

  const [barrio, setBarrio] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    let center = ''
    console.log(center)
    // Find the barrio center from townConfig
    townConfig?.comunidades?.forEach(comunidad => {
      const foundBarrio = comunidad.barrios?.find(b => b.nombre === barrio)
      if (foundBarrio) {
        center = foundBarrio.center
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
      <br />
      <div>
        <Button variant="contained" color="primary" type="submit">
          Descargar mapa
        </Button>
      </div>
    </form>
  )
}
