import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { Button } from '@mui/material'
import { DataGrid, esES, GridActionsCellItem, GridToolbarContainer } from '@mui/x-data-grid'
import moment from 'moment'
import { useCallback, useContext, useState } from 'react'
import { WeightContext } from '../../context/WeightContext'
import DeleteRowDialog from '../DeleteRowDialog'

function EditToolbar (props) {
  const { weight, setWeight } = props

  const handleClick = () => {
    const prevDates = weight.map((row) => moment(row.date).format('DD/MM/YYYY'))
    const newDate = moment()

    while (prevDates.includes(moment(newDate).format('DD/MM/YYYY'))) {
      newDate.add(1, 'days')
    }

    setWeight((oldRows) => [{ date: newDate.toDate(), pet: 0, galones: 0, plasticoduro: 0, basura: 0 }, ...oldRows])
  }

  return (
          <GridToolbarContainer>
            <Button color="secondary" startIcon={<AddIcon />} onClick={handleClick}>
              Añadir fila
            </Button>
          </GridToolbarContainer>
  )
}

export default function WeightDataGridTable (props) {
  const { weight, setWeight } = useContext(WeightContext)
  const [rowToDelete, setRowToDelete] = useState(null)

  const deleteRow = (id) => {
    const dataUpdate = weight.filter((row) => moment(row.date).format('DD/MM/YYYY') !== id)
    setWeight(dataUpdate)
    setRowToDelete(null)
  }

  const processRowDelete = useCallback(
    (id) => () => {
      setRowToDelete(id)
    },
    []
  )

  const processRowUpdate =
  (newData, oldData) => new Promise((resolve, reject) => {
    setTimeout(() => {
      const dataUpdate = [...weight]
      const index = weight.findIndex(e => JSON.stringify(e) === JSON.stringify(oldData))
      dataUpdate[index] = newData
      setWeight([...dataUpdate])
      resolve(newData)
    }, 200)
  }
  )

  const columns = [
    {
      field: 'actions',
      type: 'actions',
      width: 80,
      getActions: (params) =>
      // eslint-disable-next-line react/jsx-key
        [<GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={processRowDelete(params.id)}
          />]

    },
    {
      field: 'date',
      headerName: 'Date',
      editable: true,
      type: 'date',
      width: 150,
      valueFormatter: (params) => {
        const date = new Date(params.value)
        return moment(date).format('DD/MM/YYYY')
      }
    },
    { field: 'pet', headerName: 'Pet (lb)', editable: true, type: 'number', width: 100 },
    { field: 'galones', headerName: 'Galones (lb)', editable: true, type: 'number', width: 100 },
    { field: 'plasticoduro', headerName: 'Plástico Duro (lb)', editable: true, type: 'number', width: 100 },
    { field: 'basura', headerName: 'Basura (lb)', editable: true, type: 'number', width: 100 }
  ]
  return (
        <div style={{ height: '80vh', width: '100%' }} data-testid='weight-table'>
            <DataGrid
            getRowId={(row) => moment(row.date).format('DD/MM/YYYY') }
            rows={weight}
            columns={columns}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            processRowUpdate={processRowUpdate}
            experimentalFeatures={{ newEditingApi: true }}
            components={{ Toolbar: EditToolbar }}
            componentsProps={{
              toolbar: { weight, setWeight },
              footer: {"data-testid": "footer"}
            }} />
            <DeleteRowDialog rowToDelete={rowToDelete} setRowToDelete={setRowToDelete} deleteRow={deleteRow} />
        </div>
  )
}
