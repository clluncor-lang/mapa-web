var map = L.map('map').setView([-12.068, -77.08], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

var urlCSV = "https://docs.google.com/spreadsheets/d/1enENlMc8MPCTFqNj_7ArIuHdWMeBn8np4aNMy4knyZw/export?format=csv&gid=530107837";

var markers = [];

function convertirLinkDrive(url) {

    if(!url) return "";

    var match = url.match(/\/d\/(.*?)\//);

    if(match && match[1]) {

        return `https://drive.google.com/uc?export=view&id=${match[1]}`;

    }

    return url;
}

function cargarDatos(mesSeleccionado = "Todos") {

    markers.forEach(marker => {
        map.removeLayer(marker);
    });

    markers = [];

    Papa.parse(urlCSV, {

        download: true,
        header: true,

        complete: function(results) {

            results.data.forEach(function(fila) {

                var lat = fila["latitud "];
                var lon = fila["longitud"];

                if(lat && lon) {

                    lat = parseFloat(lat.replace(",", "."));
                    lon = parseFloat(lon.replace(",", "."));

                    if(!isNaN(lat) && !isNaN(lon)) {

                        var mes = (fila["Mes"] || "")
                            .trim()
                            .toLowerCase();

                        if(
                            mesSeleccionado.toLowerCase() === "todos" ||
                            mes === mesSeleccionado.trim().toLowerCase()
                        ) {

                            var imagen = convertirLinkDrive(fila["Foto"]);

                            var marker = L.marker([lat, lon]).addTo(map);

                            markers.push(marker);

                            marker.bindPopup(`
                                <div style="width:250px">

                                <h3>${fila["Actividad"] || ""}</h3>

                                <b>Mes:</b> ${fila["Mes"] || ""}<br>

                                <b>Lugar:</b> ${fila["lugar"] || ""}<br><br>

                                <b>Comentario:</b><br>
                                ${fila["comentario "] || ""}<br><br>

                                <b>Responsable:</b>
                                ${fila["Responsable"] || ""}<br><br>

                                ${
                                    imagen
                                    ?
                                    `<img src="${imagen}" width="100%">`
                                    :
                                    ""
                                }

                                </div>
                            `);

                        }

                    }

                }

            });

        }

    });

}

cargarDatos();

document.getElementById("mes").addEventListener("change", function() {

    cargarDatos(this.value);

});
