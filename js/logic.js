const url3 = "http://127.0.0.1:5000/api/v1.0/world-disaster-by-year"

// ----------------------
// Jason's function area
// ----------------------

function makeGraphsJason() {
    d3.json(buildUrlJason(false)).then(j => {
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
            title: `Number of ${$('#disaster-type option:selected').text()} Disasters, ${years[0]}-${years[years.length-1]}`,
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

function makeGraphsMarla() {
    
}

// ----------------------
// Ryan's function area
// ----------------------

function makeGraphsRyan() {
    
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
}

function onFormatDropdownChanged(val) {
    $('.submit').hide();
    $(`.submit.${val}`).show();
}
