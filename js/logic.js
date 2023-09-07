const url = "http://localhost:5000/api/v1.0/disasters-by-year"
const url2 = "http://localhost:5000/api/v1.0/disasters-by-date?start=2003&col=fy_declared,declaration_type,count(distinct(disaster_number))&groups=fy_declared,declaration_type&order=fy_declared,declaration_type"
const url3 = "http://127.0.0.1:5000/api/v1.0/world-disaster-by-year"

d3.json(url).then(j => {
    trace = {
        x: j.map(e => e[0]),
        y: j.map(e => e[1]),
        type: 'bar'
    };
    Plotly.newPlot("graph", [trace]);
});

d3.json(url2).then(j => {
    // j = list[tuple[year, type, count]]
    let fm = {};
    let dr = {};
    let em = {};
    j.forEach(e => {
        switch (e[1]) {
            case 'FM':
                fm[e[0]] = e[2];
                break;
            case 'DR':
                dr[e[0]] = e[2];
                break;
            case 'EM':
                em[e[0]] = e[2];
                break;
        }
    });
    trace1 = {
        x: Object.keys(fm),
        y: Object.values(fm),
        name: 'Fire Management',
        type: 'bar'
    };
    trace2 = {
        x: Object.keys(dr),
        y: Object.values(dr),
        name: 'Major Disaster Declaration',
        type: 'bar'
    };
    trace3 = {
        x: Object.keys(em),
        y: Object.values(em),
        name: 'Emergency Declaration',
        type: 'bar'
    };
    layout = {
        title: "Declaration numbers by type, from 2003-2023"
    }
    Plotly.newPlot("graph2", [trace1, trace2, trace3], layout);
});
