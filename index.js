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
    option.id = country.alpha2Code;

    // Los UM, CD daban problemas, si las coordenadas están vacías, se les da 0
    (country.latlng[0] == undefined ? country.latlng[0] = 0 : country.latlng[0]);
    (country.latlng[1] == undefined ? country.latlng[1] = 0 : country.latlng[1]);

    option.value = `${country.latlng[0]},${country.latlng[1]}`;

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

const loadNeighbours = async () => { // aquí

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

        let countryCode = select.options[select.selectedIndex].id;
        let coordenades = select.options[select.selectedIndex].value.split(',');

        let latitud = coordenades[0];
        let longitud = coordenades[1];

        if (latitud && longitud) {
            iniciarMap(latitud, longitud);
        }


        let neighbours = await fetchData(URLs.neighbours.concat(countryCode), parametros);
        console.log("URL: " + neighbours);

        document.querySelector('#neighbours').innerHTML =
            neighbours.reduce((ac, neighbour) => ac + "\n" + neighbour.country_name, "");

    } catch (error) {
        console.log(error);
    }
}

const obtenerLocalizacion = () => {
    if (navigator.geolocation) {
        document.getElementById("nivelSoporte").innerHTML =
            navigator.geolocation.getCurrentPosition(updateLocation);
    }
}


let lat, lon, pre;

const updateLocation = (position) => {
    // console.log("position", position);
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    pre = position.coords.accuracy;
    // console.log(lat, lon, pre);
}


function iniciarMap(latitud, longitud) {
    let map = new google.maps.Map(document.getElementById("nivelSoporte"), {
        center: { lat: Number.parseFloat(latitud), lng: Number.parseFloat(longitud) },
        zoom: 5,
    });
}


window.addEventListener('load', loadCountries);
window.onload = obtenerLocalizacion;
