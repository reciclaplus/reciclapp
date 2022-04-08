import React, { useEffect, useRef, useContext } from 'react';
import initPolygonsP4 from '../config/P4/P4Polygons';
import initPolygonsSY from '../config/SY/SYPolygons';
import { PdrContext } from '../context/PdrContext';
import { geoLocation } from './GeoMap';
import {useRouter} from 'next/router';
import { initGoogleMap } from './BaseMap';
import { TownContext } from '../context/TownContext';
import { conf } from '../configuration';
import { getActivePdr } from '../utils/pdr-management';

const MyMap = (props) => {
    const googleMapRef = useRef(null);
    let googleMap = null;

    const { pdr, setPdr } = useContext(PdrContext);
    const {town, setTown} = useContext(TownContext)

    const router = useRouter()
    const {lat, lng, zoom, editable} = router.query
    
    const mapCenter = (!isNaN(lat)) ? ({"lat": Number(lat), "lng": Number(lng)}) : conf[town].map_center
    const zoomMap = (!isNaN(zoom)) ? Number(zoom) : 14

    useEffect(()=>{

        const timer = setTimeout(()=>{
            if (googleMap !== null){
                geoLocation(googleMap)
            }
        }, 1000)
        
        return () => clearTimeout(timer)        
    })

    useEffect(() => {

        googleMap = initGoogleMap(googleMapRef, mapCenter, zoomMap);

        if (pdr.length > 1) {
        getActivePdr(pdr).forEach(position => {
            var marker = addMarker(position, googleMap, position.nombre)
            var infowindow = new google.maps.InfoWindow({
            content: position.nombre,
            })
            
            if (position.lat == mapCenter.lat && position.lng== mapCenter.lng){
            infowindow.open({
                anchor: marker,
                googleMap,
                shouldFocus: true, 
            });

            const image = {
                url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                scaledSize : new google.maps.Size(50, 50)
              };
      
              marker.setIcon(image)
              
              if ((editable === "true")){
                marker.setDraggable(true)
                window.google.maps.event.addListener(marker, 'dragend', function(evt){
                    position.lat = evt.latLng.lat()
                    position.lng = evt.latLng.lng()
                    console.log(evt.latLng.lat())
                  });
              }
              
            
            }
            
            marker.addListener("click", () => {
            infowindow.open({
                anchor: marker,
                googleMap,
                shouldFocus: false,
            });
            });
            
            google.maps.event.addListener(googleMap, "click", function(event) {
            infowindow.close();
            });
        })
        }
        initPolygonsSY(googleMap)
        initPolygonsP4(googleMap)
    },[pdr]);

        // Adds a marker to the map.
    function addMarker(location, map, title) {
        // Add the marker at the clicked location, and add the next-available label
        // from the array of alphabetical characters.
        return new google.maps.Marker({
        position: location,
        map: map,
        title: title,
        });
    }
 
    return <div
        ref={googleMapRef}
        style={{ width: '100%', height: 500 }}
    />
}
 
export default MyMap;