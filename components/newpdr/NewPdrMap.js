import { useEffect, useRef, useState } from 'react'
import { useTownContext } from '../../context/TownContext'
import { addMarker } from '../map/BaseMap'

function NewPdrMap(props) {
  const googleMapRef = useRef(null)
  const [googleMap, setGoogleMap] = useState(null)

  const pdr = props.pdr
  const { townConfig } = useTownContext();

  useEffect(() => {

    const center = townConfig?.map_center || { lat: 18.4606607, lng: -70.8405734 }

    const zoom = 14
    function initGoogleMap() {
      return new window.google.maps.Map(googleMapRef.current, {
        center,
        zoom,
      })
    }
    setGoogleMap(initGoogleMap())
  }, [googleMapRef, townConfig])

  useEffect(() => {
    if (props.comunidad != '' && googleMap !== null && townConfig) {
      const comunidad = townConfig.comunidades?.find(obj => { return obj.nombre === props.comunidad })
      if (comunidad?.center) {
        const map_center = comunidad.center
        googleMap.setCenter({ lat: parseFloat(map_center.split(",")[0]), lng: parseFloat(map_center.split(",")[1]) })
      }
    }
  }, [props.comunidad, googleMap, townConfig])

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

      pdr.forEach(position => {
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
  }, [googleMap, props.pdr])

  return <div
    ref={googleMapRef}
    style={{ width: '100%', height: 500 }}
  />
}

export default NewPdrMap
