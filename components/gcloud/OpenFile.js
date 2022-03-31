import Head from 'next/head'
import { Button } from "@mui/material";
import React, { useEffect, useState, useContext } from 'react';
import { PdrContext } from '../../context/PdrContext';
import { TownContext } from '../../context/TownContext';
import { WeightContext } from '../../context/WeightContext';
import { conf } from '../../configuration';
import { BUCKET_NAME } from './google';
import { useRouter } from 'next/router'

function OpenFile(props) {

  const router = useRouter()
  const { pdr, setPdr } = useContext(PdrContext);
  const {town, setTown} = useContext(TownContext)
  const {weight, setWeight} = useContext(WeightContext)

  var file = conf[town].file

  const bucket = town === "sample" ? "reciclaplus-public" : BUCKET_NAME

  function downloadFunction() {

    var request = gapi.client.request({
      'path': `https://storage.googleapis.com/storage/v1/b/${bucket}/o/${file}?alt=media`,
      'method': 'GET',
      'headers': {
        'Accept': 'application/json',
        // "Authorization": "Bearer " + props.googleauth.currentUser.Nb.wc.access_token
      }});
      return request.execute(function(file, rawResponse) {
          
          if (JSON.parse(rawResponse).gapiRequest.data.status === 200) {
            setPdr(file.pdr)
            setWeight(file.peso)
            router.push("/list")
          }
          else {
            alert("Conéctate para abrir el archivo")
            console.log(JSON.parse(rawResponse))
          }
          
        } );
  }

    return (<>
        <Head>
        
        <meta name="description" content="Generated by create next app" />
        
      </Head>
        
        <Button id="open-btn" component="a" variant="contained" color="primary" onClick={downloadFunction}>Abrir</Button>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
        
        </>
    )
}

export default OpenFile