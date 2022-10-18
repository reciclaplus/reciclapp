import { getActivePdr } from '../../utils/pdr-management'
import { GOOGLE_API_KEY } from '../gcloud/google'
export function download (e) {
  fetch(e, {
    method: 'GET',
    headers: {}
  })
    .then(response => {
      response.arrayBuffer().then(function (buffer) {
        const url = window.URL.createObjectURL(new Blob([buffer]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'image.png') // or any other extension
        document.body.appendChild(link)
        link.click()
      })
    })
    .catch(err => {
      console.log(err)
    })
};

export function createMapURL (pdr, barrio, center) {
  const startURL = 'https://maps.googleapis.com/maps/api/staticmap'
  const zoom = '17'
  let markersString = ''
  getActivePdr(pdr).forEach(marker => {
    if (marker.barrio === barrio) {
      const markerString = `&markers=size:small%7Ccolor:red%7Clabel:${marker.id}%7C${marker.lat},${marker.lng}`
      markersString += markerString
    }
  }
  )

  const URL = `${startURL}?center=${center}&zoom=${zoom}&size=600x600&maptype=roadmap%20${markersString}%20&key=${GOOGLE_API_KEY}`
  console.log(URL)
  return URL
}
