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
    
    export default function initPolygonsSY(map) {
        
        // Define the LatLng coordinates for the polygon's path.
        const barrioBlancoCoords = [
          { lat: 18.454438, lng: -70.827624 },
          { lat: 18.458503, lng: -70.826734 },
          { lat: 18.458988, lng: -70.831651},
          { lat: 18.455321, lng: -70.832285 },
          { lat: 18.454438, lng: -70.827624 }
        ];
    
        const barrioNuevoCoords = [
          { lat: 18.458503, lng: -70.826734 },
          { lat: 18.459161, lng:  -70.832594 },
          { lat: 18.461170, lng: -70.832206 },
          { lat: 18.460663, lng: -70.826394 },
          { lat: 18.458503, lng: -70.826734 }
        ];
    
        const barrioPintadoCoords = [
          { lat: 18.458988, lng: -70.831651},
          { lat: 18.458919, lng:  -70.836344 },
          { lat: 18.456024, lng: -70.836948 },
          { lat: 18.455321, lng: -70.832285 },
          { lat: 18.458988, lng: -70.831651}
        ];
    
        const ojoDeAguaCoords = [
          { lat: 18.458769, lng: -70.832776},
          { lat: 18.458919, lng:  -70.836344 },
          { lat: 18.462323, lng: -70.835661 },
          { lat: 18.461682, lng: -70.832088 },
          { lat: 18.458769, lng: -70.832776}
        ];
    
        const sanFranciscoCoords = [
          { lat: 18.461170, lng: -70.832206 },
          { lat: 18.461334, lng:  -70.828023 },
          { lat: 18.466463, lng: -70.829815 },
          { lat: 18.465883, lng:  -70.831354 },
          { lat: 18.461170, lng: -70.832206 }
        ];
    
        const abanicoCoords = [
          { lat: 18.461682, lng: -70.832088 },
          { lat: 18.465883, lng:  -70.831354 },
          { lat: 18.463554, lng:  -70.835471 },
          { lat: 18.462323, lng: -70.835661 },
          { lat: 18.461682, lng: -70.832088 }
        ];
    
        const cartonesCoords = [
          { lat: 18.456024, lng: -70.836948 },
          { lat: 18.463554, lng:  -70.835471 },
          { lat: 18.463395, lng: -70.836891 },
          { lat: 18.462392, lng: -70.838243 },
          { lat: 18.456111, lng: -70.838088 },
          { lat: 18.456024, lng: -70.836948 }
        ];
    
        const barrioTranquiloCoords = [
          { lat: 18.462484, lng: -70.838280 },
          { lat: 18.473796, lng:  -70.843645 },
          { lat: 18.462579, lng: -70.844405 },
          { lat: 18.462484, lng: -70.838280 }
        ];
    
        const cubaLindaCoords = [
          { lat: 18.461103, lng: -70.827147 },
          { lat: 18.460762, lng:  -70.825927 },
          { lat: 18.461607, lng: -70.825798 },
          { lat: 18.461953, lng: -70.826984 },
          { lat: 18.461103, lng: -70.827147 }
        ];
    
        const barrioBlanco = newPolygon(barrioBlancoCoords, "#ff8da1")
        const barrioNuevo = newPolygon(barrioNuevoCoords, "#90ee90")
        const barrioPintado = newPolygon(barrioPintadoCoords, "#1e90ff")
        const ojoDeAgua = newPolygon(ojoDeAguaCoords, "#ffc04d")
        const sanFrancisco = newPolygon(sanFranciscoCoords, "#b299e5")
        const abanico = newPolygon(abanicoCoords, "#ffff94")
        const cartones = newPolygon(cartonesCoords, "#ff8080")
        const barrioTranquilo = newPolygon(barrioTranquiloCoords, "#d3d3d3")
        const cubaLinda = newPolygon(cubaLindaCoords, "#8b4513")
    
        barrioBlanco.setMap(map);
        barrioNuevo.setMap(map);
        barrioPintado.setMap(map);
        ojoDeAgua.setMap(map);
        sanFrancisco.setMap(map);
        abanico.setMap(map);
        cartones.setMap(map);
        barrioTranquilo.setMap(map);
        cubaLinda.setMap(map);
      }