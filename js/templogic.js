const url = "http://localhost:5000/api/v1.0/temperature-by-year";

function makeGraphsMarla() {
    d3.json(url).then(j => {
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

        let layout = {
            title: "Annual Global Temperature Anomalies (°C) ",
            xaxis:{title:"Year"},
            yaxis:{title: "Anomalies"},
            hovermode: "closest",
        };
        let trace2 = [{
            x:month,
            y: Anomaly,
            type: 'bar',
            name: 'Global Temperature Anomalies by Month'
        }];
        let layout2 = {
            title: "Monthly Global Temperature Anomalies (°C) ",
            xaxis:{title:"Month"},
            yaxis:{title: "Anomalies"},
            hovermode: "closest",
        };

        graph=[trace]
        graph2=[trace2]

        Plotly.newPlot("temp-graph",graph, layout);
        Plotly.newPlot("month-graph",graph2,layout2)
    });
}
