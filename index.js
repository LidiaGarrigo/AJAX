const URLs = {
    countries: 'https://restcountries.eu/rest/v2/all',
    neighbours: 'https://api.geodatasource.com/neighbouring-countries?key=7PUKVKJJCBNQHZQOQO3ZJVBCVHZJHTEP&country_code='
}

let select = document.querySelector('.select-country');

const fetchData = async (url) => {
    try {

        let response = await fetch(url);
        if (response.ok)
            return await response.json();

    } catch (error) {
        throw error;
    }
}

const createElementOption = (country) => {

    let option = new Option(country.name);
    option.value = country.alpha2Code;
    console.log(country);
    return option;
}

const loadCountries = async () => {

    try {

        select.options[0] = new Option("-- selecciona --");

        (await fetchData(URLs.countries))
            .map(country => select.add(createElementOption(country)));

        select.addEventListener('change', loadNeighbours);

    } catch (error) {
        console.log(error);
    }

}

const loadNeighbours = async () => {

    try {
        let parametros = {
            method: 'get',
            mode: 'no-cors',
            cache: 'no-cache',
            credentials: 'include',
            headers: {

                'Access-Control-Allow-Origin': 'https://localhost:3000'
            }
        }
        let countryCode = select.options[select.selectedIndex].value;
        iniciarMap(select.options[select.selectedIndex].latlng[0],select.options[select.selectedIndex].latlng[1]);
        let neighbours = await fetchData(URLs.neighbours.concat(countryCode), parametros);
        console.log(neighbours);

        document.querySelector('#neighbours').innerHTML =
            neighbours.reduce((ac, neighbour) => ac + "\n" + neighbour.country_name, "");

    } catch (error) {
        console.log(error);
    }
}

window.addEventListener('load', loadCountries);

const obtenerLocalizacion = ()=> {
    if(navigator.geolocation) {
        document.getElementById("nivelSoporte").innerHTML =
        navigator.geolocation.getCurrentPosition(updateLocation);
    } 
}    
let lat, lon, pre;

const updateLocation = (position) => {
    console.log("position", position);
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let pre = position.coords.accuracy;
    console.log(lat, lon, pre);
}
window.onload = obtenerLocalizacion;

function iniciarMap(){
    let coord = {lat:lat, lng:lon};
    let map = google.maps.Map(document.getElementById("nivelSoporte"), {
        zoom:10,
        center: coord
    });
}
