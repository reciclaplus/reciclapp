// Construct the polygon.
function newPolygon(coordinates, color) {
    return new window.google.maps.Polygon({
        paths: coordinates,
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.35,
    });
    }
    
    export default function initPolygonsP4(map) {
        
        // Define the LatLng coordinates for the polygon's path.
        const p4ViejoOesteCoords = [
          { lat: 18.417217, lng: -70.831162 },
          { lat: 18.416470, lng: -70.826375 },
          { lat: 18.407389, lng: -70.825565 },
          { lat: 18.407959, lng: -70.830114 },
    
        ];
    
        const p4ViejoEsteCoords = [
          { lat: 18.415753, lng: -70.821226 },
          { lat: 18.416470, lng: -70.826375 },
          { lat: 18.407389, lng: -70.825565 },
          { lat: 18.406472, lng: -70.820420 },
        ];
        const p4NuevoOesteCoords = [
          { lat: 18.417217, lng: -70.831162 },
          { lat: 18.416470, lng: -70.826375 },
          { lat: 18.425456, lng: -70.829777 },
          { lat: 18.422250, lng: -70.832062 },
        ];
        const p4NuevoEsteCoords = [
          { lat: 18.415753, lng: -70.821226 },
          { lat: 18.416470, lng: -70.826375 },
          { lat: 18.425456, lng: -70.829777 },
          { lat: 18.426454, lng: -70.827030 },
          
        ];
    
        const p4ViejoOeste = newPolygon(p4ViejoOesteCoords, "#ff8da1")
        const p4ViejoEste = newPolygon(p4ViejoEsteCoords, "#90ee90")
        const p4NuevoOeste = newPolygon(p4NuevoOesteCoords, "#1e90ff")
        const p4NuevoEste = newPolygon(p4NuevoEsteCoords, "#ffc04d")
    
        p4ViejoOeste.setMap(map);
        p4ViejoEste.setMap(map);
        p4NuevoOeste.setMap(map);
        p4NuevoEste.setMap(map);
      }