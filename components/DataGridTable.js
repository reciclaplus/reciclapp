import DeleteIcon from '@mui/icons-material/Delete'
import { Button, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material'

import { DataGrid, esES, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid'
import moment from 'moment'
import Link from 'next/link'
import { useCallback, useContext, useEffect, useState } from 'react'
import { conf } from '../configuration'
import { PdrContext } from '../context/PdrContext'
import { TownContext } from '../context/TownContext'
import { calculateAlert } from '../utils/pdr-management'
import DeleteRowDialog from './DeleteRowDialog'
import { GreenRadio, RedRadio, YellowRadio } from './RadioButtons'

export function lastNweeks (recogida, n) {
  const fiveMondays = [...Array(5).keys()].map(nWeek => moment().day('monday').subtract(nWeek, 'weeks'))

  const lastNweeks = fiveMondays.map(monday => {
    const r = recogida.find(week => week.date === monday.format('DD/MM/YYYY'))
    if (r) {
      return { date: r.date, wasCollected: r.wasCollected }
    } else {
      return { date: monday.format('DD/MM/YYYY'), wasCollected: 'null' }
    }
  })

  const result = lastNweeks.map(date => {
    let control
    if (date.wasCollected === 'si') {
      control = <GreenRadio checked={true} size='small' sx={{ p: 0 }}/>
    } else if (date.wasCollected === 'no') {
      control = <RedRadio checked={true} size='small' sx={{ p: 0 }}/>
    } else if (date.wasCollected === 'cerrado') {
      control = <Radio checked={true} color="default" size='small' sx={{ p: 0 }}/>
    } else if (date.wasCollected === 'nada') {
      control = <YellowRadio checked={true} size='small' sx={{ p: 0 }}/>
    } else if (date.wasCollected === 'null') {
      control = <Radio checked={false} color="default" size='small' sx={{ p: 0 }}/>
    }

    return <FormControlLabel control={control} label={<Typography variant="body2" color="textSecondary">{date.date}</Typography>} labelPlacement="top" key={date.date} />
  }).reverse()

  return (
        <RadioGroup row>
        { result }
        </RadioGroup>)
}

export default function DataGridTable () {
  const { pdr, setPdr } = useContext(PdrContext)
  const { town } = useContext(TownContext)
  const [rowToDelete, setRowToDelete] = useState(null)
  const barrios = []
  conf[town].barrios.forEach((barrio) => { barrios.push(barrio.nombre) })
  const categories = conf[town].categories

  useEffect(() => {
    fetch('http://localhost:5000/add-date-added', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(pdr)
    }).then(function (response) {
      return response.json()
    }).then(function (json) {
      setPdr(json)
    })
  }, [])

  const deleteRow = (id) => {
    const dataUpdate = pdr.filter((row) => row.internalId !== id)
    setPdr(dataUpdate)
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
      const dataUpdate = [...pdr]
      const index = pdr.findIndex(e => JSON.stringify(e) === JSON.stringify(oldData))
      dataUpdate[index] = newData
      setPdr([...dataUpdate])
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
    { field: 'id', headerName: 'Id', editable: true, type: 'number', width: 50 },
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
      field: 'dateAdded',
      headerName: 'Añadido el día',
      editable: true,
      type: 'date',
      width: 150,
      valueGetter: (params) => { return moment(params.value, 'DD/MM/YYYY') },
      valueFormatter: (params) => { return params.value.format('DD/MM/YYYY') }
    },
    {
      field: 'alerta',
      headerName: 'Alerta',
      editable: false,
      type: 'boolean',
      width: 100,
      valueGetter: calculateAlert
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
    <div style={{ height: '80vh', width: '100%' }}>
      <DataGrid
      getRowId={(row) => row.internalId}
      rows={pdr}
      columns={columns}
      localeText={localeObj}
      components={{ Toolbar: GridToolbar }}
      componentsProps={{
        toolbar: { showQuickFilter: true }
      }}
      processRowUpdate={processRowUpdate}
      experimentalFeatures={{ newEditingApi: true }}/>

      <DeleteRowDialog rowToDelete={rowToDelete} setRowToDelete={setRowToDelete} deleteRow={deleteRow} />

    </div>
  )
}
