import DeleteIcon from '@mui/icons-material/Delete';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Alert, Button, FormControlLabel, Snackbar, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import { useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { API_URL } from '../../configuration';
import { useTownContext } from '../../context/TownContext';
import { useUser } from '../../context/UserContext';
import { useLastN, usePdr } from '../../hooks/queries';
import DeleteRowDialog from '../DeleteRowDialog';
import { GreenRadio, RedRadio, YellowRadio } from '../RadioButtons';

export default function DataGridTable() {

  const { townConfig } = useTownContext();
  const { hasRole } = useUser();
  const [rowToDelete, setRowToDelete] = useState(null)
  const [error403, setError403] = useState(false)

  // Extract configuration from townConfig with fallback to empty arrays
  const comunidades = townConfig?.comunidades?.map(c => c.nombre) || [];
  const barrios = townConfig?.comunidades?.flatMap(c => c.barrios?.map(b => b.nombre) || []) || [];
  const categories = townConfig?.categories || [];

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
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    })
      .then(async (response) => {
        if (response.status === 403) {
          setError403(true);
          return;
        }
        await response.json();
        queryClient.invalidateQueries('pdr');
      })
      .finally(() => setRowToDelete(null));
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

        fetch(`${API_URL}/pdr/update/${newData.internal_id}`, {
          method: 'POST',
          credentials: 'include', // Include cookies
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(newData),
        })
          .then(async (response) => {
            if (response.status === 403) {
              setError403(true);
              reject(new Error('No tienes permiso para actualizar este PDR.'));
              return;
            }
            await response.json();
            queryClient.invalidateQueries('pdr');
            resolve(newData);
          })
          .catch((err) => {
            reject(err);
          });
      }, 200)
    })

  const canEdit = hasRole && hasRole('write');
  const columns = [
    {
      field: 'actions',
      type: 'actions',
      width: 80,
      getActions: (params) => {
        const actions = [];
        if (canEdit) {
          actions.push(
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={processRowDelete(params.id)}
            />
          );
        }
        actions.push(
          <GridActionsCellItem
            icon={<QrCode2Icon />}
            label="Create QR code"
            onClick={createQRcode(params)}
          />
        );
        return actions;
      }
    },
    { field: 'id', headerName: 'Id', editable: canEdit, type: 'number', width: 50 },
    { field: 'nombre', headerName: 'Nombre', editable: canEdit, width: 200 },
    { field: 'descripcion', headerName: 'Descripción', editable: canEdit, width: 350 },
    { field: 'comunidad', headerName: 'Comunidad', editable: canEdit, type: 'singleSelect', valueOptions: comunidades, width: 125 },
    { field: 'barrio', headerName: 'Barrio', editable: canEdit, type: 'singleSelect', valueOptions: barrios, width: 125 },
    {
      field: 'categoria',
      headerName: 'Categoría',
      editable: canEdit,
      type: 'singleSelect',
      valueOptions: categories.map((cat) => { return cat.value }),
      valueFormatter: (params) => {
        return categories.find(cat => cat.value === params.value).label
      },
      width: 150
    },
    { field: 'zafacon', headerName: 'Zafacón', editable: canEdit, type: 'boolean', width: 100 },
    {
      field: 'ubicacion',
      headerName: 'Ubicación',
      editable: false,
      renderCell: (params) => {
        return (
          <>
            <Link href={{
              pathname: '/map',
              query: {
                lat: params.row.lat,
                lng: params.row.lng,
                zoom: 17,
                editable: false
              }
            }}>
              <Button variant="outlined" color="secondary" sx={{ m: 1 }}>
                Ver
              </Button>
            </Link>
            {hasRole && hasRole('write') && (
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
            )}
          </>
        )
      },
      width: 200
    },
    {
      field: 'date_added',
      headerName: 'Añadido el día',
      editable: canEdit,
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
    filterValueAny: 'Cualquiera',
    filterValueTrue: 'Sí',
    filterValueFalse: 'No',
    filterOperatorIsAnyOf: 'Es cualquiera de',
    toolbarQuickFilterPlaceholder: 'Buscar...'
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

      <Snackbar open={error403} autoHideDuration={4000} onClose={() => setError403(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setError403(false)} severity="error" sx={{ width: '100%' }}>
          No tienes permiso para realizar esta acción.
        </Alert>
      </Snackbar>
    </Box>
  )
}
