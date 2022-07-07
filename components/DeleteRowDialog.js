import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material'

export default function DeleteRowDialog (props) {
  return (
        <Dialog
        open={!(props.rowToDelete === null)}
      >
        <DialogTitle>Estás segura?</DialogTitle>
        <DialogActions>
          <Button onClick={() => { props.setRowToDelete(null) }}>
            No
          </Button>
          <Button onClick={() => { props.deleteRow(props.rowToDelete) }}>Sí</Button>
        </DialogActions>
      </Dialog>
  )
}
