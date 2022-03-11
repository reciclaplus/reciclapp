import { TextField } from "@mui/material";


export default function DatePicker(props){
    
    const year = props.defaultDate.getFullYear()
    const month = (props.defaultDate.getMonth() + 1 > 9) ? props.defaultDate.getMonth() + 1 : `0${props.defaultDate.getMonth()+1}`
    const date = (props.defaultDate.getDate() > 9) ? props.defaultDate.getDate() : `0${props.defaultDate.getDate()}`;
    const defaultDate = `${year}-${month}-${date}`

    return (
    <TextField
        id="date"
        label="Fecha"
        type="date"
        defaultValue={defaultDate}
        onChange={props.onChange}
        InputLabelProps={{
        shrink: true,
        }}
    />
    )
}