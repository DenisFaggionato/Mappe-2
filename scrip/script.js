let map
function init() {
  let centro = prompt("Dove vuoi centrare la mappa?")
  let centropiu = centro.replace(/ /g,"+")
  fetch("https://nominatim.openstreetmap.org/search?q=" + centropiu + "&format=json")
  .then(response => response.json())
  .then(data => {
    if (data.length > 0) {

      
      ol.proj.useGeographic();
      map = new ol.Map({
          target: 'mappa',
          layers: [
            new ol.layer.Tile({
              source: new ol.source.OSM(),
            }),
          ],
          view: new ol.View({
            center: [data[0].lon,  data[0].lat],
            zoom: 18,
          }),
        });
        alert("Una volta inserito un marker, se si vuole rimuoverlo basta premerci sopra")

    } 
    else {
      alert("Nessuna corrispondenza trovata per " + centro);
      init()
    }
  })

    return map

}
   

let layerMarker = null;

function Cerca() {
  let indirizzo = document.getElementById("testo").value;
  let indirizzopiu = indirizzo.replace(/ /g, "+");

  fetch("https://nominatim.openstreetmap.org/search?q=" + indirizzopiu + "&format=json")
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        let coordinate = [data[0].lon, data[0].lat];

        ol.proj.useGeographic();
        const iconFeature = new ol.Feature({
          geometry: new ol.geom.Point(coordinate),
        });

        const StileMarker = new ol.style.Style({
          image: new ol.style.Icon({
            src: "style/img/105.png",
            anchor: [0.5, 1],
            scale: 0.1,
          }),
        });

        if (layerMarker != null) {
          map.removeLayer(layerMarker);
        }

        layerMarker = new ol.layer.Vector({
          source: new ol.source.Vector({
            features: [iconFeature],
          }),
        });

        layerMarker.setStyle(StileMarker);
        map.addLayer(layerMarker);
        map.getView().setCenter(coordinate);

        const cliccaFuori = new ol.interaction.Select({
          layers: [layerMarker],
          hitTolerance: 5,
        });

        cliccaFuori.on("select", function (e) {
          layerMarker.getSource().clear();
        });

        map.addInteraction(cliccaFuori);
      } else {
        alert("Nessuna corrispondenza trovata per " + indirizzo);
      }
    })

}

function meno(){
  let vista = map.getView();
  let zoom = vista.getZoom();
  vista.setZoom(zoom - 1);
}
function Piu(){
  let vista = map.getView();
  let zoom = vista.getZoom();
  vista.setZoom(zoom + 1);
}