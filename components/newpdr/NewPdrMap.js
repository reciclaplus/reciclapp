import { useContext, useEffect, useRef, useState } from 'react'
import { conf } from '../../configuration'
import { PdrContext } from '../../context/PdrContext'
import { TownContext } from '../../context/TownContext'
import { getActivePdr } from '../../utils/pdr-management'
import { addMarker } from '../map/BaseMap'

function NewPdrMap (props) {
  const googleMapRef = useRef(null)
  const [googleMap, setGoogleMap] = useState(null)

  const { pdr } = useContext(PdrContext)
  const { town } = useContext(TownContext)
  
  useEffect(()=> {
    console.log("hello")
    const center = conf[town].map_center
    
    const zoom = 14
    function initGoogleMap() {
        return new window.google.maps.Map(googleMapRef.current, {
            center,
            zoom,
          })
    }
    setGoogleMap(initGoogleMap())
  }, [googleMapRef])

  useEffect(()=> {
    if (props.comunidad != '' && googleMap !== null) {
      const map_center = conf[town].comunidades.find(obj => {return obj.nombre === props.comunidad}).center
      googleMap.setCenter({lat: parseFloat(map_center.split(",")[0]), lng: parseFloat(map_center.split(",")[1])})
    }
  }, [props.comunidad])

  useEffect(() => {
    if (googleMap !== null) {

    let marker
    googleMap.addListener('click', (event) => {
        if (typeof marker !== 'undefined') {
            marker.setMap(null)
        }

        marker = addMarker(event.latLng, googleMap)
        props.setNewMarker(marker)
        })
        
    getActivePdr(pdr).forEach(position => {
      const marker = addMarker(position, googleMap)
      const infowindow = new window.google.maps.InfoWindow({
        content: position.nombre
      })
      marker.addListener('click', () => {
        infowindow.open({
          anchor: marker,
          googleMap,
          shouldFocus: false
        })
      })
    })
}
  }, [googleMap])

  return <div
    ref={googleMapRef}
    style={{ width: '100%', height: 500 }}
  />
}

export default NewPdrMap
