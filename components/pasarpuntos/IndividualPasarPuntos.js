import { Box, Button, FormControl, FormLabel } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { API_URL } from '../../configuration'
import CustomAlert from '../CustomAlert'
import RadioButtonsGroup from '../RadioButtonsGroup'

const IndividualPasarPuntos = (props) => {
    const [alertMessage, setAlertMessage] = useState(null)
    const [fecha, setFecha] = useState(dayjs())
    const router = useRouter()
    const internal_id = router.query.id
    const [payload, setPayload] = useState({})
    const [pdr, setPdr] = useState({})
    const [initialValue, setInitialValue] = useState('')

    useEffect(() => {
        if (!router.isReady) return;

        fetch(`${API_URL}/pdr/get/${internal_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
            }
        }).then((response) => (response.json())).then((data) => {
            console.log(data)
            setPdr(data)
        })

        fetch(`${API_URL}/recogida/get/${fecha.year()}/${fecha.week()}/${internal_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
            }
        }).then((response) => (response.json())).then((data) => {
            console.log(data)
            setInitialValue(data['value'])
        })

    }, [router])



    function handleChange(id, value) {
        setPayload({ [id]: { "date": fecha.day(1).format('DD/MM/YYYY'), "internal_id": id, "value": value } })
        console.log(JSON.stringify(payload))
        console.log(value)
    }

    const handleSubmit = () => {
        event.preventDefault()
        fetch(`${API_URL}/recogida/set/${fecha.year()}/${fecha.week()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + localStorage.token

            },
            body: JSON.stringify(payload)
        }).then((response) => (response.json())).then((data) => {
            setAlertMessage(
                <CustomAlert
                    message={`Se ha guardado la recogida en fecha ${fecha.format('DD/MM/YYYY')} de ${pdr.nombre}`}
                    setAlertMessage={setAlertMessage}
                    severity='info' />
            )
        })

    }

    return (
        <Box sx={{ p: 2 }}>
            {alertMessage}
            <form onSubmit={handleSubmit} data-testid="pasar-puntos-form">
                <div>
                    <FormControl role="form-field">
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                            <DatePicker
                                label="Fecha"
                                value={fecha}
                                onChange={(newValue) => {
                                    setFecha(newValue)
                                    setPayload({})
                                }}
                            />
                        </LocalizationProvider>
                    </FormControl>
                </div>
                <br />

                <FormControl component="fieldset" role="form-field">


                    <FormLabel sx={{ mt: 3 }} component="legend"> {pdr.nombre} - {pdr.barrio} </FormLabel>
                    <RadioButtonsGroup onChange={handleChange} internal_id={internal_id} initialValue={initialValue} />


                </FormControl>
                <br />
                <div>
                    <Button sx={{ my: 3 }} color="secondary" variant="contained" type="submit">
                        Pasar esos puntos
                    </Button>
                </div>
            </form>
        </Box>
    );
};

export default IndividualPasarPuntos;