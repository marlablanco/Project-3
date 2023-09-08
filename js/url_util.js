function buildUrlJason(map) {
    let start = $('#start-year').val();
    let end = $('#end-year').val();
    let check = $('#disaster-type option:selected').text();
    let type = check !== 'All' ? `&type=${check}` : '';
    if (map) {
        return mapUrlJason(start, end, type);
    }
    return graphUrlJason(start, end, type);
}

function mapUrlJason(start, end, type) {
    return `map.html?start=${start}&end=${end}${type}&add_temp=${$('#overlay-temp')[0].checked ? 1 : 0}`;
}

function graphUrlJason(start, end, type) {
    return `http://127.0.0.1:5000/api/v1.0/us-disasters-by-year?start=${start}&end=${end}${type}&add_temp=${$('#overlay-temp')[0].checked ? 1 : 0}`;
}
