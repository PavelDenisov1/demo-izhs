
export function getCenterCoordinates(setLocations:Function) {
   let link = 'https://rk.geosamara.ru/geosamara-demo-services/1.0.0/regions'
    fetch(link)
        .then(response => response.json())
        .then(data => setLocations(data));
}



