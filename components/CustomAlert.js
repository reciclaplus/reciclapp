import { Alert, Snackbar } from '@mui/material'

export default function CustomAlert (props) {
  function handleClose () {
    props.setAlertMessage(null)
  }

  return (
        <Snackbar open={true} autoHideDuration={6000} onClose={handleClose} anchorOrigin={ { vertical: 'top', horizontal: 'center' } }>
            <Alert onClose={handleClose} severity={props.severity}>
                {props.message}
            </Alert>
        </Snackbar>
  )
}
