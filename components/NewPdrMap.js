import React, { useEffect, useRef, useContext } from 'react';
import { initGoogleMap, addMarker } from './BaseMap';
import { PdrContext } from '../context/PdrContext';
import { TownContext } from '../context/TownContext';
import { conf } from '../configuration';

function NewPdrMap(props){
  const googleMapRef = useRef(null);
  let googleMap = null;

  const { pdr, setPdr } = useContext(PdrContext);
  const {town, setTown} = useContext(TownContext)

  useEffect(() => {
    const mapCenter = conf[town].map_center
    googleMap = initGoogleMap(googleMapRef, mapCenter, 14);
    
    addEventListener()
    pdr.forEach(position => {
      var marker = addMarker(position, googleMap)
      var infowindow = new window.google.maps.InfoWindow({
        content: position.nombre,
      })
      marker.addListener("click", () => {
        infowindow.open({
          anchor: marker,
          googleMap,
          shouldFocus: false,  
        });
      })
    })
  }, []);
 
  var marker;
  const addEventListener = (callback) => {
    if (typeof googleMap === 'undefined') {
      callback();
    } else {
      window.google.maps.event.addListener(googleMap, "click", (event) => {
          if (typeof marker != 'undefined'){
            marker.setMap(null)            
          }
          
          marker = addMarker(event.latLng, googleMap);  
          props.setNewMarker(marker)
         
      });
    }
  }

 return <div
    ref={googleMapRef}
    style={{ width: "100%", height: 500 }}
  />
}
 
export default NewPdrMap;