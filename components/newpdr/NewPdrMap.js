import { useContext, useEffect, useRef } from 'react'
import { conf } from '../../configuration'
import { PdrContext } from '../../context/PdrContext'
import { TownContext } from '../../context/TownContext'
import { getActivePdr } from '../../utils/pdr-management'
import { addMarker, initGoogleMap } from '../map/BaseMap'

function NewPdrMap (props) {
  const googleMapRef = useRef(null)
  let googleMap = null

  const { pdr } = useContext(PdrContext)
  const { town } = useContext(TownContext)

  useEffect(() => {
    const mapCenter = conf[town].map_center
    googleMap = initGoogleMap(googleMapRef, mapCenter, 14)

    addEventListener()
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
  }, [])

  let marker
  const addEventListener = (callback) => {
    if (typeof googleMap === 'undefined') {
      callback()
    } else {
      window.google.maps.event.addListener(googleMap, 'click', (event) => {
        if (typeof marker !== 'undefined') {
          marker.setMap(null)
        }

        marker = addMarker(event.latLng, googleMap)
        props.setNewMarker(marker)
      })
    }
  }

  return <div
    ref={googleMapRef}
    style={{ width: '100%', height: 500 }}
  />
}

export default NewPdrMap
