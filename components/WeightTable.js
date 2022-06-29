import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'
import FilterListIcon from '@mui/icons-material/FilterList'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import GetAppIcon from '@mui/icons-material/GetApp'
import LastPageIcon from '@mui/icons-material/LastPage'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import SearchIcon from '@mui/icons-material/Search'
import Paper from '@mui/material/Paper'
import MaterialTable from 'material-table'
import { useContext } from 'react'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { WeightContext } from '../context/WeightContext'

export default function WeightTable (props) {
  const { weight, setWeight } = useContext(WeightContext)

  const tableData = weight

  return (
    <div style={{ maxWidth: '100%', display: 'block' }}>
    <MaterialTable
      components={{
        Container: props => <Paper {...props} elevation={0}/>
      }}
    localization={{
      toolbar: {
        searchTooltip: 'Buscar',
        searchPlaceholder: 'Buscar',
        exportTitle: 'Descargar',
        exportName: 'Descargar como CSV',
        exportAriaLabel: 'Hello'
      },
      body: {
        deleteTooltip: 'Eliminar',
        editTooltip: 'Editar',
        editRow: {
          deleteText: '¿Seguro que quieres eliminar esta fila?',
          cancelTooltip: 'Cancelar',
          saveTooltip: 'Aceptar'
        },
        addTooltip: 'Añadir'
      },
      pagination: {
        labelRowsSelect: 'filas',
        labelDisplayedRows: '{from}-{to} de {count}',
        labelRowsPerPage: 'Filas por página'

      }
    }}
      icons={{
        Add: AddCircleOutlineIcon,
        Search: SearchIcon,
        Clear: ClearIcon,
        Filter: FilterListIcon,
        FirstPage: FirstPageIcon,
        LastPage: LastPageIcon,
        NextPage: NavigateNextIcon,
        PreviousPage: NavigateBeforeIcon,
        ResetSearch: ClearIcon,
        Delete: DeleteForeverIcon,
        Edit: EditIcon,
        Check: CheckIcon,
        Export: GetAppIcon,
        SortArrow: ArrowDropDownIcon
      }}
      title="Peso"
      data={tableData}
      columns={[
        { title: 'Date', field: 'date', type: 'date' },
        { title: 'Pet (lb)', field: 'pet', type: 'numeric' },
        { title: 'Galones (lb)', field: 'galones', type: 'numeric' },
        { title: 'Plástico Duro (lb)', field: 'plasticoduro', type: 'numeric' },
        { title: 'Basura (lb)', field: 'basura', type: 'numeric' }
      ]}
      editable={{
        onRowAdd: newData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              setWeight([...weight, newData])

              resolve()
            }, 1000)
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              console.log(newData)
              const dataUpdate = [...weight]
              const index = oldData.tableData.id
              dataUpdate[index] = newData
              console.log(dataUpdate)
              setWeight(dataUpdate)
              resolve()
            }, 5000)
          }),
        onRowDelete: oldData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataDelete = [...weight]
              const index = oldData.tableData.date
              dataDelete.splice(index, 1)
              setWeight([...dataDelete])

              resolve()
            }, 1000)
          })
      }}
    />
    </div>
  )
}
