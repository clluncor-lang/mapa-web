var map = L.map('map').setView([-12.068, -77.08], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

var urlCSV = "https://docs.google.com/spreadsheets/d/1enENlMc8MPCTFqNj_7ArIuHdWMeBn8np4aNMy4knyZw/export?format=csv&gid=530107837";

Papa.parse(urlCSV, {

    download: true,
    header: true,

    complete: function(results) {

        console.log(results.data);

        results.data.forEach(function(fila) {

            console.log(fila);

            var lat = fila["latitud "];
            var lon = fila["longitud"];

            console.log("LAT:", lat);
            console.log("LON:", lon);

            if(lat && lon) {

                lat = parseFloat(lat.replace(",", "."));
                lon = parseFloat(lon.replace(",", "."));

                console.log(lat, lon);

                if(!isNaN(lat) && !isNaN(lon)) {

                    L.marker([lat, lon])
                        .addTo(map)
                        .bindPopup(fila["Actividad"]);

                }

            }

        });

    }

});