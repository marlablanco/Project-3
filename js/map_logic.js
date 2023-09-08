const url = `http://127.0.0.1:5000/api/v1.0/us-disasters-by-year-and-location${window.location.search}`;
const colors = [
    "rgb(91, 255, 99)",
    "rgb(146, 237, 47)",
    "rgb(182, 217, 0)",
    "rgb(210, 195, 0)",
    "rgb(233, 171, 0)",
    "rgb(250, 145, 0)",
    "rgb(255, 117, 11)",
    "rgb(255, 87, 50)",
    "rgb(255, 53, 77)",
    "rgb(255, 0, 102)"
]
let disasterTiers = new Int32Array(9);

function disasterCountToColor(count) {
    for (let x = 0; x < disasterTiers.length; ++x) {
        if (count < disasterTiers[x]) {
            return colors[x];
        }
    }
    return colors[9];
}

d3.json(url).then(async d => {
    disasterCounts = {};

    for (let [state, county] of d) {
        if (state === 68 | county === 0) { continue; }
        let code = state * 1000 + county;
        if (!disasterCounts[code]) {
            disasterCounts[code] = 0;
        }
        ++disasterCounts[code];
    }
    
    let countsValues = Object.values(disasterCounts)
    let mean = countsValues.reduce((agg, d) => agg + d, 0) / countsValues.length;
    let maxCount = Math.max(countsValues);
    let minCount = 0;
    let tierWidth = 0;
    if (maxCount - mean < minCount + mean) {
        tierWidth = Math.round((maxCount - mean) / 5);
        for (let x = 0; x < disasterTiers.length; ++x) {
            disasterTiers[disasterTiers.length - (x + 1)] = Math.ceil(maxCount - tierWidth * (x + 1))
        }
    }
    else {
        tierWidth = Math.round((minCount + mean) / 5);
        for (let x = 0; x < disasterTiers.length; ++x) {
            disasterTiers[x] = Math.floor(minCount + tierWidth * (x + 1))
        }
    }

    while (!geojsonData.features) {
        await new Promise(r => setTimeout(r, 100));
    }
    let mapGeojson = {"type": "FeatureCollection", "features": new Array(countsValues.length)}
    let idx = 0;
    for (const [fips, count] of Object.entries(disasterCounts)) {
        try {
            mapGeojson.features[idx] = geojsonData.features[fipsToGeojsonIdx[parseInt(fips)]];
            mapGeojson.features[idx++].properties.disasterCount = count;
        } catch {}
    }
    mapGeojson.features = mapGeojson.features.filter(Boolean);

    L.geoJson(mapGeojson, {
      style: function(feature) {
        return {
          color: "white",
          fillColor: disasterCountToColor(feature.properties.disasterCount),
          fillOpacity: 0.5,
          weight: 1.5
        };
      },
      onEachFeature: function(feature, layer) {
        layer.on({
          mouseover: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.9
            });
          },
          mouseout: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.5
            });
          },
          //click: function(event) {
          //  usaMap.fitBounds(event.target.getBounds());
          //}
        });
        layer.bindPopup(`<h1>${feature.properties.NAME}, ${stateFipsData[feature.properties.STATEFP]}</h1><h2>Number of disasters: ${feature.properties.disasterCount}</h2>`);
      }
    }).addTo(usaMap);
    
    let legend = L.control({position: 'bottomright'});
    legend.onAdd = (map) => {
        let div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        div.setAttribute('style', 'width:80px;background-color:white;padding:5px;border-radius:5px;');
        let legendHtmlArray = ["<b>Number of disasters:</b>"];
        let categories = [
            `< ${disasterTiers[0]}`,
            `${disasterTiers[0]}-${disasterTiers[1]}`,
            `${disasterTiers[1]}-${disasterTiers[2]}`,
            `${disasterTiers[2]}-${disasterTiers[3]}`,
            `${disasterTiers[3]}-${disasterTiers[4]}`,
            `${disasterTiers[4]}-${disasterTiers[5]}`,
            `${disasterTiers[5]}-${disasterTiers[6]}`,
            `${disasterTiers[6]}-${disasterTiers[7]}`,
            `${disasterTiers[7]}-${disasterTiers[8]}`,
            `> ${disasterTiers[8]}`
        ];

        for (let x = 0; x < categories.length; ++x) {
            legendHtmlArray.push(`<div style='height:1em;width:1em;display:inline-block;background-color:${colors[x]}'></div>&nbsp;${categories[x]}`);
        }

        div.innerHTML = legendHtmlArray.join("<br>");
        return div;
    };
    legend.addTo(usaMap);
})
