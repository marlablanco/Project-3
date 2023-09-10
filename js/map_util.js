let fipsToGeojsonIdx = {};
let geojsonData = {};
let stateFipsData = {};
const geojsonUrl = 'http://127.0.0.1:5000/api/v1.0/geojson-counties';
const stateFipsUrl = 'http://127.0.0.1:5000/api/v1.0/fips-to-state';
const usaMap = L.map("map", {
    center: [38.71980474264239, -97.60253906250001],
    zoom: 5
  });

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(usaMap);

$.getJSON(geojsonUrl, data => {
    geojsonData = data;
    for (let i = 0; i < data.features.length; ++i) {
        let feature = data.features[i];
        fipsToGeojsonIdx[parseInt(feature.properties.GEOID)] = i;
    }
});

$.getJSON(stateFipsUrl, j => {
    stateFipsData = j;
});
