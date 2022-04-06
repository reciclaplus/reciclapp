import { Button } from "@mui/material";
import React, { useEffect, useState, useContext } from 'react';
import { PdrContext } from '../../context/PdrContext';
import { TownContext } from '../../context/TownContext';
import { WeightContext } from "../../context/WeightContext";
import {conf} from '../../configuration'
import { BUCKET_NAME } from "./google";

function UploadFile(props) {

  const { pdr, setPdr } = useContext(PdrContext);
  const {town, setTown} = useContext(TownContext)
  const {weight, setWeight} = useContext(WeightContext)

  
  const bucket = town === "sample" ? "reciclaplus-public" : BUCKET_NAME

  function upload() {
    if (pdr.length > 0) {
      uploadFunction()
    }
    else {
      alert("No hay puntos en el archivo actual.")
    }
  }

  function uploadFunction() {
    
    const boundary='foo_bar_baz'
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";
    var fileName=conf[town].file;
    var fileData=JSON.stringify({"pdr": pdr, "peso": weight});
    var contentType='text/plain'
    var metadata = {
      'name': fileName,
      'mimeType': contentType,
      'Cache-Control': 'no-store'
    };

    var multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: ' + contentType + '\r\n\r\n' +
      fileData+'\r\n'+
      close_delim;


    var request = gapi.client.request({
      'path': `https://storage.googleapis.com/upload/storage/v1/b/${bucket}/o/`,
      'method': 'POST',
      'params': {'uploadType': 'multipart'},
      'headers': {
        'Content-Type': 'multipart/related; boundary=' + boundary + '',
        // "Authorization": "Bearer " + props.googleauth.currentUser.Nb.wc.access_token
      },
      'body': multipartRequestBody});
      return request.execute(function(file, rawResponse) {
          
        if (JSON.parse(rawResponse).gapiRequest.data.status === 200) {
            alert("Archivo guardado correctamente")
          }
          else {
            console.log(JSON.parse(rawResponse))
            alert("No se pudo guardar el archivo")
          }
          
        } );
  }

    return (
        <Button id="upload-btn" component="a" variant="contained" color="primary" onClick={upload}>Guardar</Button>
    )
}

export default UploadFile