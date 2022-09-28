import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import NativeSelect from '@mui/material/NativeSelect'

export default function Filter (props) {
  const { setCurrentValue, currentValue, filterName, values } = props
  const handleChange = (event) => {
    setCurrentValue(event.target.value)
  }

  return (
    <FormControl>
      <InputLabel>{filterName}</InputLabel>
      <NativeSelect
      inputProps={{
        name: 'filter',
        id: 'filter'
      }}
        id='simple-select'
        value={currentValue}
        onChange={handleChange}
        sx={{ m: 1 }}
      >

          {
            values.map(ivalue => {
              return <option value={ivalue.value} key={ivalue.value}>{ivalue.label}</option>
            })
          }

      </NativeSelect>
    </FormControl>
  )
}
