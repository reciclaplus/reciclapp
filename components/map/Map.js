/* eslint-disable no-undef */

import { MarkerClusterer } from '@googlemaps/markerclusterer'
import { useRouter } from 'next/router'
import { useContext, useEffect, useRef, useState } from 'react'
import initPolygonsP4 from '../../config/P4/P4Polygons'
import initPolygonsSY from '../../config/SY/SYPolygons'
import { conf } from '../../configuration'
import { PdrContext } from '../../context/PdrContext'
import { TownContext } from '../../context/TownContext'

export const MapComponent = (props) => {

  const googleMapRef = useRef(null)
  const [googleMap, setGoogleMap] = useState(null)

  const { pdr } = useContext(PdrContext)
  const { town } = useContext(TownContext)

  const router = useRouter()
  const { lat, lng, zoom, editable } = router.query

  const center = (!isNaN(lat)) ? ({ lat: Number(lat), lng: Number(lng) }) : conf[town].map_center
  const zoomMap = (!isNaN(zoom)) ? Number(zoom) : 14

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (googleMap !== null) {
  //       geoLocation(googleMap)
  //     }
  //   }, 1000)

  //   return () => clearTimeout(timer)
  // })


  useEffect(() => {

    function initGoogleMap() {
      return new window.google.maps.Map(googleMapRef.current, {
        center,
        zoom: zoomMap,
      })
    }
    setGoogleMap(initGoogleMap())
  }, [googleMapRef])

  useEffect(() => {

    if (googleMap !== null) {

      let allMarkers
      if (pdr.length > 1) {
        allMarkers = pdr.map(position => {
          const marker = addMarker(position, googleMap, position.nombre)
          const infowindow = new window.google.maps.InfoWindow({
            content: position.nombre
          })

          if (position.lat === center.lat && position.lng === center.lng) {
            infowindow.open({
              anchor: marker,
              googleMap,
              shouldFocus: true
            })

            const image = {
              url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
              scaledSize: new google.maps.Size(50, 50)
            }

            marker.setIcon(image)

            if ((editable === 'true')) {
              marker.setDraggable(true)
              google.maps.event.addListener(marker, 'dragend', function (evt) {
                position.lat = evt.latLng.lat()
                position.lng = evt.latLng.lng()
              })
            }
          }

          marker.addListener('click', () => {
            infowindow.open({
              anchor: marker,
              googleMap,
              shouldFocus: false
            })
          })

          googleMap.addListener('click', function (event) {
            infowindow.close()
          })
          return marker
        })

      }

      const renderer = {
        render({ count, position }) {
          return new google.maps.Marker({
            position,
            label: String(count),
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 15,
              strokeWeight: 4,
              fillOpacity: 1,
              fillColor: '#B5D3C5',
              strokeColor: '#47916E'
            }
          })
        }
      }

      // eslint-disable-next-line no-unused-vars
      const markerCluster = new MarkerClusterer({ map: googleMap, markers: allMarkers, renderer })
      initPolygonsSY(googleMap)
      initPolygonsP4(googleMap)
    }
  }, [googleMap, pdr])

  function addMarker(location, map, title) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    return new window.google.maps.Marker({
      position: location,
      map,
      title
    })
  }

  return <div
    ref={googleMapRef}
    style={{ width: '100%', height: '100%' }}
  />
}
