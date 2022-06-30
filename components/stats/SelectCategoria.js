import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import NativeSelect from '@mui/material/NativeSelect'

export default function SelectCategoria (props) {
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

          <option value='casa'> Casa Particular </option>
          <option value='escuela'> Escuela </option>
          <option value='negocio'> Negocio </option>
          <option value='all'> Todo </option>
      </NativeSelect>
    </FormControl>
  )
}
