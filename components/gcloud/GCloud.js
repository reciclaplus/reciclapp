import Head from 'next/head'
import { Button } from "@material-ui/core";
import React, { useEffect, useState } from 'react';


function GCloud() {


  function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
  }

    return (<>
        <Head>
        
        <meta name="description" content="Generated by create next app" />
        <script src="https://accounts.google.com/gsi/client" async defer></script>
        
      </Head>

      <div id="g_id_onload"
         data-client_id=""
         data-callback="handleCredentialResponse">
    </div>
        
        <div className="g_id_signin" data-type="standard"></div>
        
        
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
        </>
    )
}

export default GCloud