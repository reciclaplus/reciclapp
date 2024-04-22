import DeleteIcon from '@mui/icons-material/Delete';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Button, FormControlLabel, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import { DataGrid, GridActionsCellItem, GridToolbar, esES } from '@mui/x-data-grid';
import { useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import Link from 'next/link';
import { useCallback, useContext, useState } from 'react';
import { API_URL, conf } from '../../configuration';
import { TownContext } from '../../context/TownContext';
import { useLastN, usePdr } from '../../hooks/queries';
import DeleteRowDialog from '../DeleteRowDialog';
import { GreenRadio, RedRadio, YellowRadio } from '../RadioButtons';

export default function DataGridTable() {

  const { town } = useContext(TownContext)
  const [rowToDelete, setRowToDelete] = useState(null)
  const comunidades = []
  conf[town].comunidades.forEach((comunidad) => { comunidades.push(comunidad.nombre) })
  const barrios = []
  conf[town].barrios.forEach((barrio) => { barrios.push(barrio.nombre) })
  const categories = conf[town].categories
  const queryClient = useQueryClient()

  const pdrQuery = usePdr()
  const last5Query = useLastN(5)
  const pdr = pdrQuery.status == 'success' ? pdrQuery.data : []
  const last5 = last5Query.status == 'success' ? last5Query.data : []

  function lastNweeks(params) {
    const last5weeks = last5.map(date => ({ "value": params.row.internal_id in date ? date[params.row.internal_id]["value"] : "", "date": date["date"] }))
    return last5weeks
  }

  function renderLastNweeks(params) {

    const result = params.value.map(date => {
      const value = date.value
      const monday = date.date
      let control
      if (value === 'si') {
        control = <GreenRadio checked={true} size='small' sx={{ p: 0 }} />
      } else if (value === 'no') {
        control = <RedRadio checked={true} size='small' sx={{ p: 0 }} />
      } else if (value === 'cerrado') {
        control = <Radio checked={true} color="default" size='small' sx={{ p: 0 }} />
      } else if (value === 'nada') {
        control = <YellowRadio checked={true} size='small' sx={{ p: 0 }} />
      } else {
        control = <Radio checked={false} color="default" size='small' sx={{ p: 0 }} />
      }
      return <FormControlLabel control={control} label={<Typography variant="body2" color="textSecondary">{monday}</Typography>} labelPlacement="top" key={date.date} />
    }).reverse()

    return (
      <Box>
        {result}
      </Box>
    )
  }
  const deleteRow = (internal_id) => {
    fetch(`${API_URL}/pdr/delete/${internal_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': 'Bearer ' + localStorage.token
      }
    }).then((response) => (response.json()))
      .then(() => queryClient.invalidateQueries('pdr'))
    setRowToDelete(null)
  }

  const processRowDelete = useCallback(
    (id) => () => {
      setRowToDelete(id)
    },
    []
  )

  const createQRcode = useCallback(
    (params) => () => {
      const url = encodeURI(`https://quickchart.io/qr?text=https://reciclapp-dev-dot-norse-voice-343214.uc.r.appspot.com//recogida/${params.id}&size=300&margin=3&caption=${params.row.id}-${params.row.barrio}`);
      window.open(url, '_blank');
    }, [])

  const processRowUpdate =
    (newData, oldData) => new Promise((resolve, reject) => {
      setTimeout(() => {
        delete newData.active
        delete newData.alerta
        delete newData.zafacon

        const new_data = fetch(`${API_URL}/pdr/update/${newData.internal_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Authorization': 'Bearer ' + localStorage.token
          },
          body: JSON.stringify(newData),
        }).then((response) => (response.json()))
          .then(() => queryClient.invalidateQueries('pdr'))
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
        />,
        <GridActionsCellItem
          icon={<QrCode2Icon />}
          label="Create QR code"
          onClick={createQRcode(params)}
        />]
    },
    { field: 'id', headerName: 'Id', editable: true, type: 'number', width: 50 },
    { field: 'nombre', headerName: 'Nombre', editable: true, width: 200 },
    { field: 'descripcion', headerName: 'Descripción', editable: true, width: 350 },
    { field: 'comunidad', headerName: 'Comunidad', editable: true, type: 'singleSelect', valueOptions: comunidades, width: 125 },
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
      field: 'date_added',
      headerName: 'Añadido el día',
      editable: true,
      type: 'date',
      width: 150,
      valueGetter: (params) => { return moment(params.value, 'DD/MM/YYYY') },
      valueFormatter: (params) => { return params.value.format('DD/MM/YYYY') }
    },
    {
      field: 'recogida',
      headerName: 'Últimas 5 semanas',
      editable: false,
      valueGetter: lastNweeks,
      renderCell: renderLastNweeks,
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
    <Box sx={{ height: '100%', width: '100%', p: 2 }}>
      <DataGrid
        getRowId={(row) => row.internal_id}
        rows={pdr}
        columns={columns}
        localeText={localeObj}
        components={{ Toolbar: GridToolbar }}
        componentsProps={{
          toolbar: { showQuickFilter: true },
          footer: { "data-testid": "footer" }
        }}
        processRowUpdate={processRowUpdate}
        experimentalFeatures={{ newEditingApi: true }} />

      <DeleteRowDialog rowToDelete={rowToDelete} setRowToDelete={setRowToDelete} deleteRow={deleteRow} />
    </Box>
  )
}
