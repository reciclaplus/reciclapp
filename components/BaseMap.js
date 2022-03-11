export function initGoogleMap(googleMapRef, center, zoom){
    return new window.google.maps.Map(googleMapRef.current, {
      center: center,
      zoom: zoom,
    });
  }

export function addMarker(location, map, draggable) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    return new window.google.maps.Marker({
      position: location,
      map: map,
      draggable: draggable
    });
  }

export function addCustomMarker(location, map, icon, draggable) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    return new window.google.maps.Marker({
      position: location,
      map: map,
      icon: icon,
      draggable: draggable
    });
  }