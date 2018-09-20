function saveToJson(listOfObjects) {
    download(JSON.stringify(listOfObjects), 'visitors.json', 'text/plain');
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function geolocation(
    geonameid,
    name,
    asciiname,
    alternatenames,
    latitude,
    longitude,
    featureclass,
    featurecode,
    countrycode,
    cc2,
    admin1code,
    admin2code,
    admin3code,
    admin4code,
    population,
    elevation,
    dem,
    timezone,
    modificationdate
) {
    var geolocationObject =
        {
            geonameid : geonameid,
            name : name,
            asciiname : asciiname,
            alternatenames : alternatenames,
            latitude : latitude,
            longitude : longitude,
            featureclass : featureclass,
            featurecode : featurecode,
            countrycode : countrycode,
            cc2 : cc2,
            admin1code : admin1code,
            admin2code : admin2code,
            admin3code : admin3code,
            admin4code : admin4code,
            population : population,
            elevation : elevation,
            dem : dem,
            timezone : timezone,
            modificationdate : modificationdate
        }
    return geolocationObject;
}
