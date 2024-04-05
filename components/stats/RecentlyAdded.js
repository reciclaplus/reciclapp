import Grid from '@mui/material/Grid'
import { DataGrid, esES, GridToolbar } from '@mui/x-data-grid'

import dayjs from 'dayjs'
import * as CustomParseFormat from 'dayjs/plugin/customParseFormat'
import { useContext, useState } from 'react'
import { conf } from '../../configuration'
import { TownContext } from '../../context/TownContext'
import Filter from './Filter'
dayjs.extend(CustomParseFormat)

export default function RecentlyAdded(props) {
  const pdr = props.pdr
  const { town } = useContext(TownContext)
  const categories = conf[town].categories
  const barrios = []
  conf[town].barrios.forEach((barrio) => { barrios.push(barrio.nombre) })
  const [nWeeks, setNWeeks] = useState(4)

  const recentlyAddedPdr = pdr.filter(ipdr => dayjs().diff(dayjs(ipdr.date_added, 'DD/MM/YYYY'), 'days') < 7 * nWeeks)

  const columns = [
    {
      field: 'date_added',
      headerName: 'Añadido el día',
      editable: false,
      type: 'date',
      width: 150,
      valueGetter: (params) => { return dayjs(params.value, 'DD/MM/YYYY') },
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
            getRowId={(row) => row.internal_id}
            rows={recentlyAddedPdr}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            localeText={localeObj}
            experimentalFeatures={{ newEditingApi: true }} />
        </div>
      </div>
    </div>
  )
}
