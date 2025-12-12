import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { esES } from '@mui/x-data-grid/locales'
import dayjs from 'dayjs'
import * as CustomParseFormat from 'dayjs/plugin/customParseFormat'
import { useState } from 'react'
import { useTownContext } from '../../../context/TownContext'
import ChartCard from '../common/ChartCard'
import Filter from '../common/Filter'
dayjs.extend(CustomParseFormat)

export default function RecentlyAdded(props) {
    const pdr = props.pdr
    const loading = props.loading
    const { townConfig } = useTownContext()
    const categories = townConfig?.categories || []
    const barrios = townConfig?.comunidades?.flatMap(c => c.barrios?.map(b => b.nombre) || []) || []
    const [nWeeks, setNWeeks] = useState(4)

    const recentlyAddedPdr = pdr.filter(ipdr => dayjs().diff(dayjs(ipdr.date_added, 'DD/MM/YYYY'), 'days') < 7 * nWeeks)

    const columns = [
        {
            field: 'date_added',
            headerName: 'Añadido el día',
            editable: false,
            type: 'date',
            width: 150,
            valueGetter: (value) => { return dayjs(value, 'DD/MM/YYYY') },
            valueFormatter: (value) => { return value.format('DD/MM/YYYY') }
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
            valueFormatter: (value) => {
                return categories.find(cat => cat.value === value).label
            },
            width: 150
        }
    ]

    const localeObj = {
        ...esES.components.MuiDataGrid.defaultProps.localeText,
        filterValueAny: 'Cualquiera',
        filterValueTrue: 'Sí',
        filterValueFalse: 'No',
        filterOperatorIsAnyOf: 'Es cualquiera de',
        toolbarQuickFilterPlaceholder: 'Buscar...'
    }

    const toolbar = (
        <Filter
            currentValue={nWeeks}
            setCurrentValue={setNWeeks}
            filterName="Plazo"
            values={[
                { value: 1, label: 'Última semana' },
                { value: 4, label: 'Último mes' },
                { value: 12, label: 'Últimos 3 meses' },
                { value: 52, label: 'Último año' },
                { value: 78, label: 'Último año y medio' }
            ]}
        />
    )

    return (
        <ChartCard title="Puntos de Reciclaje Nuevos" toolbar={toolbar}>
            {loading
                ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                        <CircularProgress />
                    </Box>
                )
                : recentlyAddedPdr.length === 0
                    ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                            <Typography color="text.secondary">No hay puntos nuevos en este período</Typography>
                        </Box>
                    )
                    : (
                        <Box sx={{ height: 400, width: '100%' }}>
                            <DataGrid
                                initialState={{
                                    sorting: {
                                        sortModel: [{ field: 'date_added', sort: 'desc' }]
                                    }
                                }}
                                getRowId={(row) => row.internal_id}
                                rows={recentlyAddedPdr}
                                columns={columns}
                                slots={{ toolbar: GridToolbar }}
                                localeText={localeObj}
                            />
                        </Box>
                    )}
        </ChartCard>
    )
}
