import ClearIcon from '@mui/icons-material/Clear'
import FilterListIcon from '@mui/icons-material/FilterList'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import LastPageIcon from '@mui/icons-material/LastPage'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import SearchIcon from '@mui/icons-material/Search'
import Paper from '@mui/material/Paper'
import Radio from '@mui/material/Radio'
import MaterialTable from 'material-table'
import Link from 'next/link'
import { useContext, useEffect } from 'react'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CheckIcon from '@mui/icons-material/Check'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import DetailsIcon from '@mui/icons-material/Details'
import EditIcon from '@mui/icons-material/Edit'
import GetAppIcon from '@mui/icons-material/GetApp'
import { FormControlLabel } from '@mui/material'
import Button from '@mui/material/Button'
import { getDateOfWeek, getWeekNumber } from '../utils/dates'
import { pdrExists } from '../utils/pdr-management'
import { GreenRadio, RedRadio, YellowRadio } from './RadioButtons'

import Grid from '@mui/material/Grid'

import { conf } from '../configuration'
import { PdrContext } from '../context/PdrContext'
import { TownContext } from '../context/TownContext'

export default function Table (props) {
  const { pdr, setPdr } = useContext(PdrContext)
  const { town } = useContext(TownContext)

  const barrios = []
  const barriosList = conf[town].barrios
  barriosList.forEach((barrio) => { barrios.push(barrio.nombre) })

  const tableData = pdr

  useEffect(() => {
    for (const pdr in tableData) {
      // if the pdr has been visited more than twice, initialize alerta as true.
      let alerta = tableData[pdr].recogida.length > 2

      for (let i = 0; i < 3; i++) {
        const date = new Date()
        date.setDate(date.getDate() - 7 * i)

        const week = getWeekNumber(date)
        const year = date.getFullYear()

        const weekData = tableData[pdr].recogida.filter(function (weekRow) {
          return weekRow.year === year && weekRow.week === week
        })

        if (weekData.length > 0 && weekData[0].wasCollected !== 'no' && weekData[0].wasCollected !== 'cerrado') {
          alerta = false
        }
      }
      tableData[pdr].alerta = alerta
    }
  })

  function getLastWeeks (userData, nWeeks) {
    const data = userData.recogida

    data.sort((a, b) => b.year === a.year ? b.week - a.week : b.year - a.year)

    const trafficLights = data.slice(0, 5).map((e) => {
      if (e.wasCollected === 'si') {
        return <FormControlLabel value="si" control={<GreenRadio checked={true}/>} label={getDateOfWeek(e.week, e.year).toLocaleDateString()} labelPlacement="bottom"/>
      } else if (e.wasCollected === 'no') {
        return <FormControlLabel value="no" control={<RedRadio checked={true}/>} label={getDateOfWeek(e.week, e.year).toLocaleDateString()} labelPlacement="bottom"/>
      } else if (e.wasCollected === 'cerrado') {
        return <FormControlLabel value="cerrado" control={<Radio checked={true} color="default" />} label={getDateOfWeek(e.week, e.year).toLocaleDateString()} labelPlacement="bottom"/>
      } else {
        return <FormControlLabel value="nada" control={<YellowRadio checked={true}/>} label={getDateOfWeek(e.week, e.year).toLocaleDateString()} labelPlacement="bottom"/>
      }
    })

    return (<div>
    {trafficLights}
  </div>)
  }

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
      }
    }}
      icons={{
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
      title={conf[town].nombre}
      columns={[
        {
          title: 'Barrio',
          field: 'barrio',
          lookup: barrios.reduce(function (result, item) {
            result[item] = item
            return result
          }, {})
        },
        { title: 'Id', field: 'id', type: 'numeric' },
        { title: 'Nombre', field: 'nombre' },

        {
          title: 'Ubicación',
          render: rowData =>
      <Grid container spacing={1}>
        <Grid item>
      <Link href={{
        pathname: '/map',
        query: {
          lat: rowData.lat,
          lng: rowData.lng,
          zoom: 17,
          editable: false
        }
      }}
      >
        <Button variant="outlined" color="primary" sx={{ m: 1 }}>
          Ver
        </Button>
      </Link>
      </Grid>
      <Grid item>
      <Link href={{
        pathname: '/map',
        query: {
          lat: rowData.lat,
          lng: rowData.lng,
          zoom: 17,
          editable: true
        }
      }}>
        <Button variant="outlined" color="primary" sx={{ m: 1 }}>
          Editar
        </Button>
      </Link>
      </Grid>
      </Grid>
        },
        { title: 'Descripción', field: 'descripcion' },
        { title: 'Categoría', field: 'categoria', lookup: { casa: 'Casa Particular', escuela: 'Escuela', negocio: 'Negocio' } },
        { title: 'Zafacón', field: 'zafacon', lookup: { true: 'Sí', false: 'No' } },
        { title: 'Alerta', field: 'alerta', lookup: { true: 'Sí', false: 'No' } },
        { title: 'Activo', field: 'active', lookup: { true: 'Sí', false: 'No' }, defaultFilter: ['true'] }]}
      data={tableData}
      options={{
        filtering: true,
        pageSize: 100,
        exportButton: true,
        doubleHorizontalScroll: true
      }}
      detailPanel={[
        {
          icon: DetailsIcon,
          tooltip: 'Muestra más',
          render: rowData => {
            return (
              getLastWeeks(rowData, 5)
            )
          }
        }]}
      editable={{
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataUpdate = [...pdr]
              const index = oldData.tableData.id
              dataUpdate[index] = newData
              if (newData.id !== oldData.id && pdrExists(newData.barrio, newData.id, pdr)) {
                alert('Esta id ya existe')
              } else {
                setPdr([...dataUpdate])
              }

              resolve()
            }, 5000)
          }),
        onRowDelete: oldData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataDelete = [...pdr]
              const index = oldData.tableData.id
              dataDelete[index].active = false
              // dataDelete.splice(index, 1);
              setPdr([...dataDelete])

              resolve()
            }, 1000)
          }),
        onBulkUpdate: changes =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const selectedRows = Object.values(changes)
              const updatedRows = [...pdr]
              let index
              selectedRows.forEach(row => {
                index = row.oldData.tableData.id
                updatedRows[index] = row.newData
              })
              setPdr(updatedRows)
              resolve()
            }, 1000)
          })
      }}
    />
    </div>
  )
}
