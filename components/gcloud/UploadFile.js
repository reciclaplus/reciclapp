/* eslint-disable no-undef */
import { Button } from '@mui/material'
import { useContext } from 'react'
import { conf } from '../../configuration'
import { PdrContext } from '../../context/PdrContext'
import { StatsContext } from '../../context/StatsContext'
import { TownContext } from '../../context/TownContext'
import { WeightContext } from '../../context/WeightContext'
import { BUCKET_NAME } from './google'

function UploadFile (props) {
  const { pdr } = useContext(PdrContext)
  const { town } = useContext(TownContext)
  const { weight } = useContext(WeightContext)
  const { stats } = useContext(StatsContext)

  const bucket = town === 'sample' ? 'reciclaplus-public' : BUCKET_NAME

  function upload () {
    if (pdr.length > 0) {
      uploadFunction()
    } else {
      alert('No hay puntos en el archivo actual.')
    }
  }

  function uploadFunction () {
    const boundary = 'foo_bar_baz'
    const delimiter = '\r\n--' + boundary + '\r\n'
    const closeDelim = '\r\n--' + boundary + '--'
    const fileName = conf[town].file
    const fileData = JSON.stringify({ pdr, peso: weight, stats })
    const contentType = 'text/plain'
    const metadata = {
      name: fileName,
      mimeType: contentType,
      'Cache-Control': 'no-store'
    }

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: ' + contentType + '\r\n\r\n' +
      fileData + '\r\n' +
      closeDelim

    const request = gapi.client.request({
      path: `https://storage.googleapis.com/upload/storage/v1/b/${bucket}/o/`,
      method: 'POST',
      params: { uploadType: 'multipart' },
      headers: {
        'Content-Type': 'multipart/related; boundary=' + boundary + ''
        // "Authorization": "Bearer " + props.googleauth.currentUser.Nb.wc.access_token
      },
      body: multipartRequestBody
    })
    return request.execute(function (file, rawResponse) {
      if (JSON.parse(rawResponse).gapiRequest.data.status === 200) {
        alert('Archivo guardado correctamente')
      } else {
        console.log(JSON.parse(rawResponse))
        alert('No se pudo guardar el archivo')
      }
    })
  }

  return (
        <Button id="upload-btn" component="a" variant="contained" color="primary" onClick={upload}>Guardar</Button>
  )
}

export default UploadFile
