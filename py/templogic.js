const url = "http://localhost:5000/api/v1.0/temperature-by-year";
const url1 = "http://127.0.0.1:5000/api/v1.0/world-disaster-by-year";

function makeGraphsMarla() {
    d3.json(buildURLMarla(false)).then(j => {
        let year = new Array(j.length);
        let month=new Array(j.length);
        let Anomaly = new Array(j.length);
        for (let i = 0; i < j.length; ++i) {
            year[i] = j[i][0];
            month[i]=j[i][1];
            Anomaly[i] = j[i][2];
        }

        let trace = [{
            x: year,
            y: Anomaly,
            type: 'bar',
            name: 'Global Temperature Anomalies by Year'
        }];
        let trace1 = [{
            x:month,
            y: Anomaly,
            type: 'bar',
            name: 'Global Temperature Anomalies by Month'
        }];
        let layout = {
            title: "Annual Global Temperature Anomalies (°C) "
        };

        Plotly.newPlot("temp-graph", trace, layout);
    });
}
function openMap() {
    window.open(buildUrlJason(true));
}