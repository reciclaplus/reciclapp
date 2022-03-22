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
import Radio from '@material-ui/core/Radio';
import { FormControlLabel } from '@material-ui/core';
import DetailsIcon from '@mui/icons-material/Details';
import { RedRadio, YellowRadio, GreenRadio } from './RadioButtons';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import GetAppIcon from '@mui/icons-material/GetApp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { getWeekNumber } from '../utils/dates';
import Button from '@material-ui/core/Button';
import { useContext } from 'react';
import { PdrContext } from '../context/PdrContext';
import { TownContext } from '../context/TownContext';
import {conf} from '../configuration'
import { pdrExists } from '../utils/pdr-management'
import { getDateOfWeek } from '../utils/dates';
import { WeightContext } from '../context/WeightContext';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function WeightTable(props) {
  
  const {weight, setWeight} = useContext(WeightContext)
    
  var tableData = weight
  
  return (
    <div style={{ maxWidth: "100%", display:"block"}}>
    <MaterialTable 
    components={{
        Container: props => <Paper {...props} elevation={0}/>
   }}
      localization={{toolbar:{searchTooltip:"Buscar", searchPlaceholder:"Buscar"}}}
      icons={{Add: AddCircleOutlineIcon,Search: SearchIcon, Clear: ClearIcon, Filter: FilterListIcon, FirstPage: FirstPageIcon, 
      LastPage: LastPageIcon, NextPage: NavigateNextIcon, PreviousPage: NavigateBeforeIcon, ResetSearch: ClearIcon, 
      Delete: DeleteForeverIcon, Edit: EditIcon, Check:CheckIcon, Export: GetAppIcon, SortArrow: ArrowDropDownIcon}}
      title="Peso"
      data={tableData}
      columns={[
      { title: 'Date', field: 'date', type: "date"},
      { title: 'Pet', field: 'pet', type: 'numeric'},
      { title: 'Galones', field: 'galones', type: 'numeric'},
      { title: 'Plástico Duro', field: 'plasticoduro', type: 'numeric'},
      { title: 'Basura', field: 'basura', type: 'numeric'}
            ]}
      editable={{
        // onRowAddCancelled: rowData => console.log('Row adding cancelled'),
        // onRowUpdateCancelled: rowData => console.log('Row editing cancelled'),
        onRowAdd: newData =>
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    setWeight([...weight, newData])

                    resolve();
                }, 1000);
            }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(newData)
              const dataUpdate = [...weight];
              const index = oldData.tableData.id;
              dataUpdate[index] = newData;
              console.log(dataUpdate)
              setWeight(dataUpdate)
              resolve();
            }, 5000)
          }),
        onRowDelete: oldData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataDelete = [...weight];
              const index = oldData.tableData.date;
              dataDelete.splice(index, 1);
              setWeight([...dataDelete]);
              
              resolve()
            }, 1000)
          }),
      }}
    />
    </div>
  )
}
