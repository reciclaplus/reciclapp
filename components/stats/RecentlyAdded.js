import { Grid } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import moment from 'moment'
import { useContext, useState } from 'react'
import { conf } from '../../configuration'
import { PdrContext } from '../../context/PdrContext'
import { TownContext } from '../../context/TownContext'
import { lastNweeks } from '../DataGridTable'
import SelectWeeks from './SelectWeeks'

export default function RecentlyAdded () {
  const { pdr } = useContext(PdrContext)
  const { town } = useContext(TownContext)
  const categories = conf[town].categories
  const barrios = []
  conf[town].barrios.forEach((barrio) => { barrios.push(barrio.nombre) })
  const [nWeeks, setNWeeks] = useState(4)

  const recentlyAddedPdr = pdr.filter(ipdr => moment().diff(moment(ipdr.dateAdded, 'DD/MM/YYYY'), 'days') < 7 * nWeeks)
  console.log(recentlyAddedPdr.length)
  console.log(pdr.map(ipdr => moment(ipdr.dateAdded, 'DD/MM/YYYY').diff(moment(), 'days')))
  const columns = [
    {
      field: 'dateAdded',
      headerName: 'Añadido el día',
      editable: true,
      type: 'date',
      width: 150,
      valueGetter: (params) => { return moment(params.value, 'DD/MM/YYYY') },
      valueFormatter: (params) => { return params.value.format('DD/MM/YYYY') }
    },
    { field: 'nombre', headerName: 'Nombre', editable: true, width: 200 },
    { field: 'descripcion', headerName: 'Descripción', editable: true, width: 350 },
    { field: 'barrio', headerName: 'Barrio', editable: true, type: 'singleSelect', valueOptions: barrios, width: 125 },
    {
      field: 'categoria',
      headerName: 'Categoría',
      editable: true,
      type: 'singleSelect',
      valueOptions: categories.map((cat) => { return cat.value }),
      valueFormatter: (params) => {
        return categories.find(cat => cat.value === params.value).label
      },
      width: 150
    },
    {
      field: 'recogida',
      headerName: 'Últimas 5 semanas',
      editable: false,
      renderCell: (params) => {
        return lastNweeks(params.value)
      },
      width: 600
    }
  ]

  return (
        <div style={{ height: 500, width: '100%' }}>
            <Grid container justifyContent="flex-end" sx={{ mb: 1 }}>
                <SelectWeeks nWeeks={nWeeks} setNWeeks={setNWeeks}></SelectWeeks>
            </Grid>
            <div style={{ display: 'flex', height: '100%' }}>
                <div style={{ flexGrow: 1 }}>
                    <DataGrid
                    initialState={{
                      sorting: {
                        sortModel: [{ field: 'dateAdded', sort: 'desc' }]
                      }
                    }}
                    getRowId={(row) => row.internalId}
                    rows={recentlyAddedPdr}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}

                    experimentalFeatures={{ newEditingApi: true }}/>
                </div>
            </div>
        </div>
  )
}
