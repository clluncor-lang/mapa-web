var map = L.map('map').setView([-12.068, -77.08], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

var urlCSV =
"https://docs.google.com/spreadsheets/d/1enENlMc8MPCTFqNj_7ArIuHdWMeBn8np4aNMy4knyZw/export?format=csv&gid=530107837";

var capaMarkers = L.layerGroup().addTo(map);

function convertirLinkDrive(url) {

    if (!url) return "";

    var match = url.match(/\/d\/(.*?)\//);

    if (match && match[1]) {

        return "https://drive.google.com/uc?export=view&id=" + match[1];

    }

    return url;
}

function cargarDatos(mesSeleccionado = "Todos") {

    capaMarkers.clearLayers();

    Papa.parse(urlCSV, {

        download: true,
        header: true,

        complete: function(results) {

            console.log(results.data);

            results.data.forEach(function(fila) {

                var lat =
                    fila["latitud "] ||
                    fila["latitud"] ||
                    "";

                var lon =
                    fila["longitud"] ||
                    fila["longitud "] ||
                    "";

                lat = lat.toString().replace(",", ".");
                lon = lon.toString().replace(",", ".");

                lat = parseFloat(lat);
                lon = parseFloat(lon);

                if (!isNaN(lat) && !isNaN(lon)) {

                    var mes =
                        (fila["Mes"] || "")
                        .trim()
                        .toLowerCase();

                    var filtro =
                        mesSeleccionado
                        .trim()
                        .toLowerCase();

                    if (
                        filtro === "todos" ||
                        mes === filtro
                    ) {

                        var foto =
                            fila["Foto"] ||
                            fila["Imagen"] ||
                            "";

                        foto = convertirLinkDrive(foto);

                        var popup = `

                        <div style="width:250px">

                        <h2>
                        ${fila["actividad_realizada"] || ""}
                        </h2>

                        <b>Actividad:</b><br>
                        ${fila["Actividad"] || ""}

                        <br><br>

                        <b>Mes:</b><br>
                        ${fila["Mes"] || ""}

                        <br><br>

                        <b>Lugar:</b><br>
                        ${fila["lugar"] || ""}

                        <br><br>

                        <b>Comentario:</b><br>
                        ${
                            fila["comentario "] ||
                            fila["comentario"] ||
                            ""
                        }

                        <br><br>

                        <b>Responsable:</b><br>
                        ${fila["Responsable"] || ""}

                        <br><br>
                        `;

                        if (foto !== "") {

                            popup += `
                            <img
                            src="${foto}"
                            style="
                            width:100%;
                            border-radius:10px;
                            ">
                            `;
                        }

                        popup += `</div>`;

                        var marker = L.marker([lat, lon]);

                        marker.bindPopup(popup);

                        capaMarkers.addLayer(marker);

                    }

                }

            });

        }

    });

}

cargarDatos();

document
.getElementById("mes")
.addEventListener("change", function() {

    cargarDatos(this.value);

});
