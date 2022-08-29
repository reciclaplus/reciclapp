import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import NativeSelect from '@mui/material/NativeSelect'
import { useContext } from 'react'
import { conf } from '../../configuration'
import { TownContext } from '../../context/TownContext'

export default function SelectCategoria (props) {
  const { town } = useContext(TownContext)
  const categories = conf[town].categories
  const { setCategoria } = props
  const handleChange = (event) => {
    setCategoria(event.target.value)
  }

  return (
    <FormControl>
      <InputLabel>Categoria</InputLabel>
      <NativeSelect
      inputProps={{
        name: 'categoria',
        id: 'categoria'
      }}
        id='categoria-simple-select'
        value={props.categoria}
        onChange={handleChange}
      >

          {
            categories.map(cat => {
              return <option value={cat.value} key={cat}>{cat.label}</option>
            })
          }

          <option value='all'> Todo </option>
      </NativeSelect>
    </FormControl>
  )
}
