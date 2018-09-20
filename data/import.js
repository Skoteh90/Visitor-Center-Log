(function () {init();})

function init() {

    var listOfObjects = [];

    fetch("data/cities1000.txt").then(
            response => response.text()
        ).then(
            text => {
                text = text.split("\n");
                for (var index = 0; index < text.length; index++) {
                    if(!text[index])continue;
                    var element = text[index].split("\t");
                    
                    var location = geolocation(
                            element[0],
                            element[1],
                            element[2],
                            element[3],
                            element[4],
                            element[5],
                            element[6],
                            element[7],
                            element[8],
                            element[9],
                            element[10],
                            element[11],
                            element[12],
                            element[13],
                            element[14],
                            element[15],
                            element[16],
                            element[17]
                        );

                    listOfObjects.push(location);
                }
                // console.log(location);
            download(JSON.stringify(listOfObjects), 'cities1000.json', 'text/plain');
            }
    )
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
