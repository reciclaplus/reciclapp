import Grid from '@mui/material/Grid'
import { DataGrid, esES, GridToolbar } from '@mui/x-data-grid'
import moment from 'moment'
import { useContext, useState } from 'react'
import { conf } from '../../configuration'
import { PdrContext } from '../../context/PdrContext'
import { TownContext } from '../../context/TownContext'
import { lastNweeks } from '../DataGridTable'
import Filter from './Filter'

export default function RecentlyAdded () {
  const { pdr } = useContext(PdrContext)
  const { town } = useContext(TownContext)
  const categories = conf[town].categories
  const barrios = []
  conf[town].barrios.forEach((barrio) => { barrios.push(barrio.nombre) })
  const [nWeeks, setNWeeks] = useState(4)

  const recentlyAddedPdr = pdr.filter(ipdr => moment().diff(moment(ipdr.dateAdded, 'DD/MM/YYYY'), 'days') < 7 * nWeeks)

  const columns = [
    {
      field: 'dateAdded',
      headerName: 'Añadido el día',
      editable: false,
      type: 'date',
      width: 150,
      valueGetter: (params) => { return moment(params.value, 'DD/MM/YYYY') },
      valueFormatter: (params) => { return params.value.format('DD/MM/YYYY') }
    },
    { field: 'nombre', headerName: 'Nombre', editable: false, width: 200 },
    { field: 'descripcion', headerName: 'Descripción', editable: false, width: 350 },
    { field: 'barrio', headerName: 'Barrio', editable: false, type: 'singleSelect', valueOptions: barrios, width: 125 },
    {
      field: 'categoria',
      headerName: 'Categoría',
      editable: false,
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

  const localeObj = {
    ...esES.components.MuiDataGrid.defaultProps.localeText,
    ...{
      filterValueAny: 'Cualquiera',
      filterValueTrue: 'Sí',
      filterValueFalse: 'No',
      filterOperatorIsAnyOf: 'Es cualquiera de',
      toolbarQuickFilterPlaceholder: 'Buscar...'
    }
  }

  return (
        <div>
            <Grid container justifyContent="flex-end" sx={{ mb: 1 }}>
              <Filter
                currentValue={nWeeks}
                setCurrentValue={setNWeeks}
                filterName='Plazo'
                values={[{ value: 1, label: 'Última semana' }, { value: 4, label: 'Último mes' }, { value: 12, label: 'Últimos 3 meses' }, { value: 52, label: 'Último año' }, { value: 78, label: 'Último año y medio' }]}></Filter>
            </Grid>
            <div style={{ display: 'flex', height: 500 }}>
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
                    localeText={localeObj}
                    experimentalFeatures={{ newEditingApi: true }}/>
                </div>
            </div>
        </div>
  )
}
