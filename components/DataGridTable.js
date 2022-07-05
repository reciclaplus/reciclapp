import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import { DataGrid, esES, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid'
import Link from 'next/link'
import { useCallback, useContext } from 'react'
import { conf } from '../configuration'
import { PdrContext } from '../context/PdrContext'
import { TownContext } from '../context/TownContext'
import { calculateAlert } from '../utils/pdr-management'

const mutate = () => {
  return useCallback(
    (pdr) =>
      new Promise((resolve, reject) =>
        setTimeout(() => {
          if (pdr.nombre === '') {
            reject(new Error("Error while saving user: name can't be empty."))
          } else {
            resolve({ ...pdr, nombre: pdr.nombre?.toUpperCase() })
          }
        }, 200)
      ),
    []
  )
}

export default function DataGridTable () {
  const { pdr, setPdr } = useContext(PdrContext)
  const { town } = useContext(TownContext)
  const barrios = []
  conf[town].barrios.forEach((barrio) => { barrios.push(barrio.nombre) })
  const categorias = ['casa', 'escuela', 'negocio']

  const deleteUser = (id) => () => {
    const dataUpdate = pdr.filter((row) => (row.id + row.barrio) !== id)
    setPdr(
      dataUpdate
    )
  }

  const mutateRow = mutate()
  const columns =
      [
        {
          field: 'actions',
          type: 'actions',
          width: 80,
          getActions: (params) =>
            // eslint-disable-next-line react/jsx-key
            [<GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={deleteUser(params.id)}
        />]

        },
        { field: 'id', headerName: 'Id', editable: true, type: 'number', width: 50 },
        { field: 'nombre', headerName: 'Nombre', editable: true, width: 100 },
        { field: 'descripcion', headerName: 'Descripción', editable: true, width: 200 },
        { field: 'barrio', headerName: 'Barrio', editable: true, type: 'singleSelect', valueOptions: barrios, width: 125 },
        {
          field: 'categoria',
          headerName: 'Categoría',
          editable: true,
          type: 'singleSelect',
          valueOptions: categorias,
          valueFormatter: (params) => {
            if (params.value === 'casa') {
              return 'Casa Particular'
            }
            if (params.value === 'escuela') {
              return 'Escuela'
            }
            return 'Negocio'
          },
          width: 150
        },
        { field: 'zafacon', headerName: 'Zafacón', editable: true, type: 'boolean', width: 100 },
        {
          field: 'ubicacion',
          headerName: 'Ubicación',
          editable: false,
          renderCell: (params) => {
            return (<>
          <Link href={{
            pathname: '/map',
            query: {
              lat: params.row.lat,
              lng: params.row.lng,
              zoom: 17,
              editable: false
            }
          }}
          >
            <Button variant="outlined" color="secondary" sx={{ m: 1 }}>
              Ver
            </Button>
          </Link>
          <Link href={{
            pathname: '/map',
            query: {
              lat: params.row.lat,
              lng: params.row.lng,
              zoom: 17,
              editable: true
            }
          }}>
            <Button variant="outlined" color="secondary" sx={{ m: 1 }}>
              Editar
            </Button>
          </Link>
          </>
            )
          },
          width: 200
        },
        {
          field: 'alerta',
          headerName: 'Alerta',
          editable: false,
          type: 'boolean',
          width: 100,
          valueGetter: calculateAlert
        },
        { field: 'active', headerName: 'Activo', editable: false, type: 'boolean' }
      ]

  const processRowUpdate = useCallback(
    async (newRow) => {
      const response = await mutateRow(newRow)
      const dataUpdate = [...pdr]

      const index = newRow.tableData.id
      dataUpdate[index] = newRow

      setPdr([...dataUpdate])

      return response
    }, [mutateRow])

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <DataGrid
      getRowId={(row) => (row.id + row.barrio)}
      rows={pdr}
      columns={columns}
      localeText={esES.components.MuiDataGrid.defaultProps.localeText}
      components={{ Toolbar: GridToolbar }}
      componentsProps={{
        toolbar: { color: 'secondary' }
      }}
      processRowUpdate={processRowUpdate}
      experimentalFeatures={{ newEditingApi: true }}/>
    </div>
  )
}
