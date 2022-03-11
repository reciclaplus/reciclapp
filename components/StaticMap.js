export function download(e) {
    
    fetch(e, {
      method: "GET",
      headers: {}
    })
      .then(response => {
        response.arrayBuffer().then(function(buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "image.png"); //or any other extension
          document.body.appendChild(link);
          link.click();
        });
      })
      .catch(err => {
        console.log(err);
      });
    };


export function createMapURL(pdr, barrio, center){
    
    const startURL = "https://maps.googleapis.com/maps/api/staticmap"
    const zoom = "17"
    var markersString = ""
    pdr.forEach(marker => 
        {
            if (marker.barrio === barrio) {

                var markerString = `&markers=size:small%7Ccolor:red%7Clabel:${marker.id}%7C${marker.lat},${marker.lng}`
                markersString += markerString
            }
        }
        )
    
    const URL = `${startURL}?center=${center}&zoom=${zoom}&size=600x600&maptype=roadmap%20${markersString}%20&key=AIzaSyA_HXSM7kTwflhLNM6N8v5MJviwz89IHhw`
    console.log(URL)
    return URL
}