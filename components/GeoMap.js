// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
let infoWindow;
import { addCustomMarker } from "./BaseMap";
import { BUCKET_NAME } from "./gcloud/google";

export function geoLocation(map){
    const locationButton = document.createElement("button");
    infoWindow = new google.maps.InfoWindow();

    locationButton.textContent = "Go to Current Location";
    locationButton.classList.add("custom-map-control-button");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            const image = {
                url: `https://storage.cloud.google.com/${BUCKET_NAME}/location.png`,
                scaledSize : new google.maps.Size(30, 30)
              };
            addCustomMarker(pos, map, image)
     
            locationButton.addEventListener("click", () => {
               map.setCenter(pos)
                });
          },
          () => {
            handleLocationError(true, infoWindow, map.getCenter());
          }
        );
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }

    
  }


  

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}