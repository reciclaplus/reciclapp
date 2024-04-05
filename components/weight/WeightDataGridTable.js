import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { Box, Button } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridToolbarContainer, esES } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import * as CustomParseFormat from 'dayjs/plugin/customParseFormat'
import { useCallback, useEffect, useState } from 'react'
import { API_URL } from '../../configuration'
import DeleteRowDialog from '../DeleteRowDialog'
dayjs.extend(CustomParseFormat)

function EditToolbar(props) {
  const { weight, setWeight } = props

  const handleClick = () => {

    currentWeek = dayjs().week()
    currentYear = dayjs().year()

    const rowIds = weight.map((row) => row.id);
    const maxRowId = Math.max(...rowIds);
    const nextRowId = maxRowId + 1;

    newRow = { id: nextRowId, date: dayjs().toDate(), week: `${curr}`, pet: 0, galones: 0, plasticoduro: 0, basura: 0 }

    fetch(`${API_URL}/recogida/weight/set/${nextRowId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.id_token
      },
      body: JSON.stringify(newRow),
    }).then((response) => (response.json())).then((data) => { setWeight([...weight, data]) })

  }

  return (
    <GridToolbarContainer>
      <Button color="secondary" startIcon={<AddIcon />} onClick={handleClick}>
        Añadir fila
      </Button>
    </GridToolbarContainer>
  )
}

export default function WeightDataGridTable(props) {
  const [rowToDelete, setRowToDelete] = useState(null)
  const [weight, setWeight] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/recogida/weight/get`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.id_token
      }
    }).then((response) => (response.json())).then((data) => { setWeight(data) })
  }, [])

  const deleteRow = (id) => {
    fetch(`${API_URL}/recogida/weight/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }).then((response) => (response.json())).then((data) => { setWeight(weight.filter((row) => row.id !== id)) })
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
        const rowId = oldData.id
        fetch(`${API_URL}/recogida/weight/update/${rowId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(newData),
        }).then((response) => (response.json()))
          .then((data) => {
            setWeight(weight.map((row) => {
              return row.id === rowId ? newData : row
            }))
          })
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
      valueGetter: (params) => { return dayjs(params.value, 'DD/MM/YYYY') },
      valueFormatter: (params) => { return params.value.format('DD/MM/YYYY') }
    },
    { field: 'pet', headerName: 'Pet (lb)', editable: true, type: 'number', width: 100 },
    { field: 'galones', headerName: 'Galones (lb)', editable: true, type: 'number', width: 100 },
    { field: 'plasticoduro', headerName: 'Plástico Duro (lb)', editable: true, type: 'number', width: 100 },
    { field: 'basura', headerName: 'Basura (lb)', editable: true, type: 'number', width: 100 }
  ]
  return (
    <Box sx={{ height: '100%', width: '100%', p: 2 }}>
      <DataGrid
        getRowId={(row) => row.id}
        rows={weight}
        columns={columns}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        processRowUpdate={processRowUpdate}
        experimentalFeatures={{ newEditingApi: true }}
        components={{ Toolbar: EditToolbar }}
        componentsProps={{
          toolbar: { weight, setWeight },
          footer: { "data-testid": "footer" }
        }} />
      <DeleteRowDialog rowToDelete={rowToDelete} setRowToDelete={setRowToDelete} deleteRow={deleteRow} />
    </Box>
  )
}
