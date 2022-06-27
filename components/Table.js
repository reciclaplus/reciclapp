import Link from 'next/link';
import Paper from '@mui/material/Paper';
import MaterialTable from 'material-table';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import React, { useEffect } from 'react';
import Radio from '@mui/material/Radio';

import { FormControlLabel } from '@mui/material';
import DetailsIcon from '@mui/icons-material/Details';
import { RedRadio, YellowRadio, GreenRadio } from './RadioButtons';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import GetAppIcon from '@mui/icons-material/GetApp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { getWeekNumber } from '../utils/dates';
import { getActivePdr } from '../utils/pdr-management';
import Button from '@mui/material/Button';

import Grid from '@mui/material/Grid';
import { useContext } from 'react';
import { PdrContext } from '../context/PdrContext';
import { TownContext } from '../context/TownContext';
import {conf} from '../configuration'
import { pdrExists } from '../utils/pdr-management'
import { getDateOfWeek } from '../utils/dates';


export default function Table(props) {
  
  const { pdr, setPdr } = useContext(PdrContext);
  const {town, setTown} = useContext(TownContext)

  var barrios = []
  const barriosList = conf[town].barrios
  barriosList.forEach((barrio) => { barrios.push(barrio.nombre) })

  var tableData = pdr

  useEffect(() => {
    const today = new Date()

    for (let pdr in tableData){
      // if the pdr has been visited more than twice, initialize alerta as true.
      var alerta = tableData[pdr].recogida.length > 2 ? true : false

      for (var i = 0; i < 3; i++) {
        var date = new Date()
        date.setDate(date.getDate() - 7*i)
        
        var week = getWeekNumber(date)
        var year = date.getFullYear()
  
        var weekData = tableData[pdr].recogida.filter(function(weekRow){
          return weekRow.year===year && weekRow.week===week;
        })

        if (weekData.length > 0 && weekData[0].wasCollected !== "no" && weekData[0].wasCollected !== "cerrado") {
          alerta = false
        }
      }
      tableData[pdr]["alerta"] = alerta
    }
    
  })

  function getLastWeeks(userData, nWeeks){
    
    var data = userData.recogida
    
    data.sort((a, b) => b.year === a.year ? b.week - a.week : b.year - a.year)

    var trafficLights = data.slice(0,5).map((e) => {
      
        if (e.wasCollected === "si") {
          return <FormControlLabel value="si" control={<GreenRadio checked={true}/>} label={getDateOfWeek(e.week, e.year).toLocaleDateString()} labelPlacement="bottom"/>
        }
        else if (e.wasCollected === "no"){
          return <FormControlLabel value="no" control={<RedRadio checked={true}/>} label={getDateOfWeek(e.week, e.year).toLocaleDateString()} labelPlacement="bottom"/>
        }
        else if (e.wasCollected === "cerrado"){
          return <FormControlLabel value="cerrado" control={<Radio checked={true} color="default" />} label={getDateOfWeek(e.week, e.year).toLocaleDateString()} labelPlacement="bottom"/>
        }
        else {
          return <FormControlLabel value="nada" control={<YellowRadio checked={true}/>} label={getDateOfWeek(e.week, e.year).toLocaleDateString()} labelPlacement="bottom"/>
          
        }
      
      });

  return (<div>
    {trafficLights}
  </div>)
  }
  
  return (
    <div style={{ maxWidth: "100%", display:"block"}}>
    <MaterialTable 
    components={{
        Container: props => <Paper {...props} elevation={0}/>
   }}
    localization={{
      toolbar: {
        searchTooltip:"Buscar", 
        searchPlaceholder:"Buscar",
        exportTitle: "Descargar",
        exportName: "Descargar como CSV",
        exportAriaLabel: "Hello"
      },
      body:{
        deleteTooltip: "Eliminar",
        editTooltip: "Editar",
        editRow: {
          deleteText: "¿Seguro que quieres eliminar esta fila?",
          cancelTooltip: "Cancelar",
          saveTooltip: "Aceptar",
        },
        addTooltip: "Añadir"
      },
      }}
      icons={{Search: SearchIcon, Clear: ClearIcon, Filter: FilterListIcon, FirstPage: FirstPageIcon, 
      LastPage: LastPageIcon, NextPage: NavigateNextIcon, PreviousPage: NavigateBeforeIcon, ResetSearch: ClearIcon, 
      Delete: DeleteForeverIcon, Edit: EditIcon, Check:CheckIcon, Export: GetAppIcon, SortArrow: ArrowDropDownIcon}}
      title={conf[town].nombre}
      columns={[
      { title: 'Barrio', field: 'barrio', 
        lookup: barrios.reduce(function(result, item) {
                result[item] = item
                return result
              }, {})},
      { title: 'Id', field: 'id', type: 'numeric'},
      { title: 'Nombre', field: 'nombre'},
      
      { title: 'Ubicación', 
      render: rowData => 
      <Grid container spacing={1}>
        <Grid item>
      <Link href={{
        pathname: '/map',
        query: {  lat: rowData.lat,
                  lng:rowData.lng,
                  zoom: 17,
                  editable: false
                },
      }}
      >
        <Button variant="outlined" color="primary" sx={{m: 1}}>
          Ver
        </Button>
      </Link>
      </Grid>
      <Grid item>
      <Link href={{
        pathname: '/map',
        query: {  lat: rowData.lat,
                  lng:rowData.lng,
                  zoom: 17,
                  editable: true
                },
      }}>
        <Button variant="outlined" color="primary" sx={{m: 1}}>
          Editar
        </Button>
      </Link>
      </Grid>
      </Grid>
      },
      { title: 'Descripción', field: 'descripcion'},
      { title: 'Categoría', field: 'categoria', lookup: { casa: 'Casa Particular', escuela: 'Escuela', negocio: "Negocio"}},
      { title: 'Zafacón', field: 'zafacon', lookup: { true: 'Sí', false: 'No'}},
      { title: 'Alerta', field: 'alerta', lookup: { true: 'Sí', false: 'No'}},
      { title: 'Activo', field: 'active', lookup: { true: 'Sí', false: 'No'}, defaultFilter: ["true"]}]}
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
          },
        }]}
      editable={{
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataUpdate = [...pdr];
              const index = oldData.tableData.id;
              dataUpdate[index] = newData;
              if (newData.id !== oldData.id && pdrExists(newData.barrio, newData.id, pdr)){
                  alert("Esta id ya existe")
              }
              else{
                setPdr([...dataUpdate]);
              }

              resolve();
            }, 5000)
          }),
        onRowDelete: oldData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataDelete = [...pdr];
              const index = oldData.tableData.id;
              dataDelete[index].active = false
              // dataDelete.splice(index, 1);
              setPdr([...dataDelete]);
              
              resolve()
            }, 1000)
          }),
          onBulkUpdate: changes =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const selectedRows = Object.values(changes)
              const updatedRows = [...pdr]
              let index
              selectedRows.map(row => {
                index = row.oldData.tableData.id
                updatedRows[index] = row.newData
              })
              setPdr(updatedRows)
              resolve();
            }, 1000);
          }), 
      }}
    />
    </div>
  )
}
