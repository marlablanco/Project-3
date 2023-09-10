
// ----------------------
// Jason's function area
// ----------------------

function makeGraphsJason() {
    $.getJSON(buildUrlJason(false), j => {
        // j = list[tuple[year, count]]
        let hasTemp = j[0].length === 3;
        let years = new Array(j.length);
        let counts = new Array(j.length);
        let temps = new Array(j.length);
        for (let i = 0; i < j.length; ++i) {
            years[i] = j[i][0];
            counts[i] = j[i][1];
            if (hasTemp) {
                temps[i] = j[i][2];
            }
        }
        let traces = [{
            x: years,
            y: counts,
            type: 'bar',
            name: 'Number of Disasters'
        }];
        if (hasTemp) {
            traces.push({
                x: years,
                y: temps,
                type: 'line',
                name: 'Temperature Anomaly',
                yaxis: 'y2'
            });
        }
        layout = {
            title: `Number of ${$('#disaster-type option:selected').text()} Disasters, ${years[0]}-${years[years.length - 1]}`,
            yaxis: {},
            yaxis2: {
                overlaying: 'y',
                side: 'right'
            }
        }
        Plotly.newPlot("graph-area", traces, layout);
    });
}

function openMap() {
    window.open(buildUrlJason(true));
}

// ----------------------
// Marla's function area
// ----------------------
const months=['','January','February','March','April','May','June','July','August','September','October','November','December']
function makeGraphsMarla() {
    if ($('#dropdown-format').val()==='year-graph') { makeYearGraph() }
    else { makeMonthGraph() }
}
function makeYearGraph() {
    const url = `http://127.0.0.1:5000/api/v1.0/temperature-by-year?start_year=${$('#year-start').val()}&end_year=${$('#year-end').val()}`;


    $.getJSON(url, j => {
        let year = new Array(j.length);
        let Anomaly = new Array(j.length);
        for (let i = 0; i < j.length; ++i) {
            year[i] = j[i][0];
            Anomaly[i] = j[i][1];
        }

        let trace = [{
            x: year,
            y: Anomaly,
            type: 'bar',
            name: 'Global Temperature Anomalies by Year'
        }];

        let layout = {
            title: "Annual Global Temperature Anomalies (°C) ",
            xaxis: { title: "Year" },
            yaxis: { title: "Anomalies" },
            hovermode: "closest",
        };

        Plotly.newPlot("graph-area", trace, layout);
    });

}

function makeMonthGraph() {
    const url = `http://127.0.0.1:5000/api/v1.0/temperature-by-month?selected_year=${$('#year-month').val()}`;


    $.getJSON(url, j => {
        let month = new Array(j.length);
        let Anomaly = new Array(j.length);
        for (let i = 0; i < j.length; ++i) {
            month[i] = months[j[i][0]];
            Anomaly[i] = j[i][1];
        }
        
        let trace2 = [{
            x: month,
            y: Anomaly,
            type: 'bar',
            name: 'Global Temperature Anomalies by Month'
        }];
        let layout2 = {
            title: "Monthly Global Temperature Anomalies (°C) ",
            xaxis: { title: "Month" },
            yaxis: { title: "Anomalies" },
            hovermode: "closest",
        };

        Plotly.newPlot("graph-area", trace2, layout2)
    });
}



// ----------------------
// Ryan's function area
// ----------------------

const url3 = "http://127.0.0.1:5000/api/v1.0/world-disaster-by-year?start_year=1970&end_year=2021"

function makeGraphsRyan() {
    // Fetch JSON data from a URL returned by url3 using D3.js
    d3.json(url3).then(j => {
        // Check if the JSON data contains the year
        let hasYear = j[0].length === 4;
        let hasDisasterType = j[0].length=== 20;

        // Create arrays to store years, type, and deaths (if available)
        let years = new Array(j.length);
        let disaster_type = new Array(j.length);
        let deaths = new Array(j.length);

        // Extract year, type, and deaths data from JSON
        for (let i = 0; i < j.length; ++i) {
            years[i] = j[i][0];
            disaster_type[i] = j[i][1];
            deaths[i] = j[i][2];
        }

        // Define Plotly traces for the bar chart and line chart 
        let traces = [{
            x: years,
            y: disaster_type,
            type: 'bar',
            name: 'Natural Disaster Deaths per Year'
        }];

        // Define the layout for the chart, including the title and y-axes configuration
        let layout = {
            title: 'Global Death Tolls of Natural Disasters',
            xaxis: {
                title: 'Year' // Label for the x-axis
            },
            yaxis: {
                title: 'Number of Deaths' // Label for the y-axis
            },
            yaxis2: {
                overlaying: 'y',
                side: 'right'
            }
        };

        // Create the chart using Plotly and display it in the HTML element with ID "graph-area"
        Plotly.newPlot("graph-area", traces, layout);
    });
}
// ----------------------
// HTML listeners & helpers
// ----------------------

const graphFunctions = {
    "jason": makeGraphsJason,
    "marla": makeGraphsMarla,
    "ryan": makeGraphsRyan
}

function onStudentDropdownChanged(val) {
    $('.dropdowns').hide();
    $(`.dropdowns.${val}`).show();
    $('#format-dropdown>option:eq(0)').prop('selected', true);
    $('#format-dropdown').change();
    $('#dropdown-format>option:eq(0)').prop('selected', true);
    $('#dropdown-format').change();
}

function onFormatDropdownChanged(val) {
    $('.submit').hide();
    $(`.submit.${val}`).show();
}

function onTimeFormatDropdownChanged(val) {
    $('.time-drop-down').hide();
    $(`.time-drop-down.${val}`).show();
}
