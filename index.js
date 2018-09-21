// Startup -------------------------------------------------------------------------------------------------------------------------
var earth = updateEarth();
var cities1000 = [];
var threadWorker = undefined;
var threadWorkerPrimed = false;


var searchCooldown = 1;
var searchCooldownTime;
var selectedIndex;
var searchResults;

var autoRotateActive = true;
var autoRotateCooldown = 7;

var autoRotateSpeedDefault = 10;
var autoRotateSpeed = autoRotateSpeedDefault;
var autoRotateCooldownFunction;

(function() {
    showPage("login");
    document.getElementById("search_results").innerHTML = "<div>" + "Preparing Geolocation" + "</div>";
    getLocation();

    $(document).keyup(function(event) {
        if (event.keyCode == 27) { // escape key
            togglePage("login");
        }
    });
    // $(document).keyup(function(event) {
    //     if (event.keyCode == 81 && document.getElementById("login").style.display == "none") { // q key
    //         earth.updatePins();
    //     }
    // });
    // $(document).keyup(function(event) {
    //     if (event.keyCode == 87 && document.getElementById("login").style.display == "none") { // w key
    //         localStorage.setItem('visitors', '[]');
    //         earth.updatePins();
    //     }
    // });
    // $(document).keyup(function(event) {
    //     if (event.keyCode == 69 && document.getElementById("login").style.display == "none") { // e key
    //         var randomLocation;
    //         for (var index = 0; index < 10; index++) {
    //             randomLocation = getRandomLocation();
    //             saveVisitor("name_first", "name_last", randomLocation.name, getCountryFromCountryCode(randomLocation.countrycode).name, randomLocation.admin1code, randomLocation.latitude, randomLocation.longitude, new Date());
    //         }
    //         earth.updatePins();
    //     }
    // });

    var home_country = document.getElementById('home_country');
    home_country.oninput = function(){searchCooldownTime = searchCooldown; document.getElementById('loader-1').style.display = "block";};
    home_country.onpropertychange = home_country.oninput; // for IE8
    var home_town = document.getElementById('home_town');
    home_town.oninput = function(){searchCooldownTime = searchCooldown; document.getElementById('loader-1').style.display = "block";};
    home_town.onpropertychange = home_town.oninput; // for IE8

    document.getElementById('globe').onclick = function(){closeInfoDrawer()};


    setInterval(onFormChange, 100); // 0.1 sec
    setInterval(autoRotateGlobe, 15); // 0.015 sec

    function refresh() {
        // Add support for dynamic resizing
    }
    window.addEventListener("resize", refresh);
}());
// Startup -------------------------------------------------------------------------------------------------------------------------


// Earth ---------------------------------------------------------------------------------------------------------------------------
function updateEarth () {

    var s = getScreenSize();
    var width = document.getElementById('globe').clientWidth;
    var height = document.getElementById('globe').clientHeight;

    var targetRotation = [0,0];

    var p1 = [], theta1 = [], p2 = [], theta2 = [0,0];

    var drag = d3.behavior.drag()
        .on("dragstart", function () {
            d3.select(this).style("cursor", "grab");
            var angle = projection.rotate();
            p1[0] = d3.event.sourceEvent.pageX;
            p1[1] = d3.event.sourceEvent.pageY;
            theta1[0] = angle[0];
            theta1[1] = angle[1];
        })
        .on("drag", function () {
            if (p1) {
                p2[0] = d3.event.sourceEvent.pageX;
                p2[1] = d3.event.sourceEvent.pageY;

                var checkRotation = theta1[0] + ((p2[0] - p1[0]) / (4 * zoom.scale()));
                targetRotation[0] = checkRotation;

                checkRotation = theta1[1] + ((p1[1] - p2[1]) / (4 * zoom.scale()))
                // Stop globe from rotation upside down
                if(checkRotation>90) checkRotation=90;
                if(checkRotation<-90) checkRotation=-90;

                targetRotation[1] = checkRotation;

                cooldownAutoRotate();
                projection.rotate(targetRotation);
            }
            svg.selectAll("path").attr("d", path);
        })
        .on("dragend", function () {
            d3.select(this).style("cursor", "default");
        });

    var zoom = d3.behavior.zoom()
        .on("zoom", function () {
            svg.attr("transform", "translate(" + 0 + ")scale(" + d3.event.scale + ")");
        })
        .scaleExtent([1, 10])
        .center([width / 2, height / 2]);

    var projection = d3.geo.orthographic()
        .scale(height / 2.2)
        .translate([width / 2, height / 2])
        .clipAngle(90);

    var path = d3.geo.path()
        .projection(projection)
        .pointRadius(function (d) { return d.radius; });

    var graticule = d3.geo.graticule();
    var xmlSVG = d3.geo.circle();

    function pinPathCubicBezier(width, height) {
    const deltaX = width * Math.sqrt(3)
    const deltaY = height * 4 / 3
    return `M 0,0 C ${-deltaX},${-deltaY} 
        ${deltaX},${-deltaY} 0,0 z`      
    }

    var MScale = d3.scale.linear()
        .range([0.1, 4]);

    if(svg==undefined){
    var svg = d3.select("#globe").append("svg")
        .attr("width", width)
        .attr("height", height);
    }

    if(!tooltip){
        var tooltip = d3.select("#globe").append("div")
            .attr("class", "tooltip")
            .style("display", "none")
            .style("opacity", 0);
    }


    // ------------------------------------------------------------------------------------------------------------------------------------


    function showPinData(data) {

        var pin = data.properties;

        var rotation = [-pin.longitude, -pin.latitude];
        projection.rotate(rotation);
        svg.selectAll("path").attr("d", path);

        setTimeout(function(){
            turnOffAutoRotate(); document.getElementById("info").style.maxWidth = "50%";
            }, 10);
        document.getElementById("info").innerHTML =
            "<span class='info-drawer-title info-drawer-item'>" + "Visitors Center - Visitor" +
            "</span>" +
            "<span class='info-drawer-item'>" + "<b>Name: </b>" + "<p>" + pin.name_first + " " + pin.name_last + "</p>" +
            "</span>" +
            "<span class='info-drawer-item'>" + "<b>Date Visited: </b>" + "<p>" + new Date(pin.date_time).toLocaleDateString("en-US") + "</p>" +
            "</span>" +
            "<span class='info-drawer-item'>" + "<b>Town/City: </b>" + "<p>" + pin.home_town + ", " + pin.home_state + "</p>"  +
            "</span>" +
            "<span class='info-drawer-item'>" + "<b>Country: </b>" + "<p>" + pin.home_country + "</p>" +
            "</span>" +
            "<span class='info-drawer-item'>" + "<b>Longitude: </b>" + "<p>" + parseFloat(pin.longitude).toFixed(4) + "</p>" +
            "</span>" +
            "<span class='info-drawer-item'>" + "<b>Latitude: </b>" + "<p>" + parseFloat(pin.latitude).toFixed(4) + "</p>" +
            "</span>";
        d3.event
    }

    function rotateTo(x, y){
        var rotation = [-x, -y];
        projection.rotate(rotation);
        svg.selectAll("path").attr("d", path);
    }

    function autoRotate(speed){
        var currentRotation = projection.rotate();
        currentRotation[0]+=speed/100;
        projection.rotate(currentRotation);
        svg.selectAll("path").attr("d", path);
    }

    function updatePins(){
        svg.selectAll(".pin").remove();

        createPins();
    }

    function updateEarthPins(error, world) {
        
    }

    d3.queue()
    .defer(d3.json, "data/world-110m.v1.json")
    .await(renderEarth);

    function renderEarth(error, world) {
        if (error) {
            throw new Error("queue/d3.json error");
        }
        else {
            for (var index = 0; index < 200; index++) {
                svg.append("circle")
                    .attr("class", "star")
                    .attr("cx", width / 2 + generateRandomInteger(-width / 2,width / 2))
                    .attr("cy", height / 2 + generateRandomInteger(-height / 2,height / 2))
                    .attr("r", 2);
            }

            svg.append("circle")
                .attr("class", "ocean")
                .attr("cx", width / 2)
                .attr("cy", height / 2)
                .attr("r", height / 2.2);

            svg.append("path")
                .datum(topojson.feature(world, world.objects.land))
                .attr("class", "land")
                .attr("d", path);

            svg.append("path")
                .datum(topojson.mesh(world, world.objects.countries), function (a, b) { return a !== b; })
                .attr("class", "borders")
                .attr("d", path);

            svg.append("path")
                .datum({ type: "Sphere" })
                .attr("class", "drag-zone")
                .attr("d", path)
                .call(drag);

            createPins();

            svg.call(zoom);
            svg.on("mousedown.zoom", null);
            svg.on("dblclick.zoom", null);

            d3.select(".close").on("click", function () {
                d3.select(".legend")
                    .transition()
                    .duration(300)
                    .style("opacity", 0)
                    .remove();
            });
        }
    }


    function createPins() {
        if(localStorage.getItem('visitors')!=null){
        // const pinPath = pinPathCubicBezier(150, 100);
        svg.selectAll("pin")
            .data(JSON.parse(localStorage.getItem('visitors')).map(transformGeoData))
            .enter().append("path")
            .attr("class", "pin")
            .attr("vector-effect", "non-scaling-stroke")
            .attr("d", path)
            .on("click", showPinData);
        }
    }

    function transformGeoData(data, index) {
        var datapoint = xmlSVG
            .origin([data.longitude, data.latitude])
            // .angle(0.3*zoom.scale())();
            .angle(0.4)();
        datapoint.properties = data;
        return datapoint;
    }

    function getScreenSize() {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight || e.clientHeight || g.clientHeight;
        return { width: x, height: y };
    }

    function wait(time) {
    return new Promise(resolve => {
        setTimeout(() => {
        resolve('resolved');
        }, time);
    });
    }

    updatePins();

    return { // Passing functions back to be called outside of updateEarth()
        updatePins: updatePins,
        rotateTo: rotateTo,
        autoRotate: autoRotate
    };
}

function turnOnAutoRotate(){
    autoRotateActive = true;
    // console.log("Rotation Active: "+autoRotateActive);
}

function turnOffAutoRotate(){
    autoRotateActive = false;
    // console.log("Rotation Active: "+autoRotateActive);
}

function cooldownAutoRotate(){
    if(autoRotateSpeed!=0){
    autoRotateSpeed=0;
    autoRotateCooldownFunction = setTimeout(function(){autoRotateSpeed = autoRotateSpeedDefault}, autoRotateCooldown*1000)
    }else{
        clearTimeout(autoRotateCooldownFunction);
        autoRotateCooldownFunction = setTimeout(function(){autoRotateSpeed = autoRotateSpeedDefault}, autoRotateCooldown*1000)
    }
}

function autoRotateGlobe(){
    if(autoRotateSpeed!=0 && autoRotateActive) earth.autoRotate(autoRotateSpeed);
}
// Earth ---------------------------------------------------------------------------------------------------------------------------


// Login ---------------------------------------------------------------------------------------------------------------------------
function logVisit(){
    var logvisitform = document.getElementById("log_visit_form");
    if(
        logvisitform.name_first.value.length>0&&
        logvisitform.name_last.value.length>0&&
        logvisitform.home_town.value.length>0&&
        logvisitform.home_country.value.length>0
    ){
        hidePage('login');
        var currentVisitorLocation;
        if(selectedIndex!=null) currentVisitorLocation = searchResults[selectedIndex];
        else currentVisitorLocation = getLocation()[0];
        // else currentVisitorLocation = getLocation(logvisitform.home_country.value, logvisitform.home_town.value)[0];

        saveVisitor(
            logvisitform.name_first.value,
            logvisitform.name_last.value,
            currentVisitorLocation.name,
            currentVisitorLocation.countrycode,
            currentVisitorLocation.admin1code,
            currentVisitorLocation.latitude,
            currentVisitorLocation.longitude,
            new Date(),
        );

        earth.updatePins();
        earth.rotateTo(currentVisitorLocation.longitude, currentVisitorLocation.latitude,);

        cooldownAutoRotate();
    } else {
        document.getElementById("search_results").innerHTML =
            "<div style='background-color: #b00020; color: #fff;'>" +
            "Please fill out all fields. :D" +
            "</div>";

        console.log("Please fill out all fields. :D");
    }
}

function setInputFields(index){
    selectedIndex = index;

    var results = document.getElementById("search_results").children;
    for (i=0; i<results.length; i++){
        results[i].style.backgroundColor = "#fff";
    }

    document.getElementById("search_result_"+index).style.backgroundColor = "#eee";

    document.getElementById("home_country").value = getCountryFromCountryCode(searchResults[index].countrycode).name;
    document.getElementById("home_state").value = searchResults[index].admin1code;
    document.getElementById("home_town").value = searchResults[index].name;
}
// Login ---------------------------------------------------------------------------------------------------------------------------


// GEOLocation ---------------------------------------------------------------------------------------------------------------------
function getLocation(){
    if(cities1000.length<=1){
        document.getElementById('loader-1').style.display = "block";
        $.getJSON('data/cities1000.json', function(data) {
            cities1000 = data;
            searchResults = startWorkerThread(); // Using threading to run searches

            // searchResults = searchCities();
            return searchResults;
        });
    } else{
        searchResults = startWorkerThread(); // Using threading to run searches


        // searchResults = searchCities();
        return searchResults;
    }
}

function getRandomLocation(){
    if(cities1000.length<=1){
        $.getJSON('data/cities1000.json', function(data) {
            cities1000 = data;
            return cities1000[generateRandomInteger(0,cities1000.length)];
        });
    } else{
        return cities1000[generateRandomInteger(0,cities1000.length)];
    }
}

function getRandomCity() {

}

function searchCities() {
    var logvisitform = document.getElementById("log_visit_form");
    var homeCountry = logvisitform.home_country.value;
    var homeTown = logvisitform.home_town.value;
    console.log("Searching locations for " + homeTown  +", "+ homeCountry);
        var countryResults = [];
        var searchMatches = [];
        if(homeCountry.length>0){ // If they have entered a value for home country
            countryResults = getCountryCodes(homeCountry); // See if we recognize it and grab possible country codes
            for(i=0; i, i<cities1000.length; i++){
                if(countryResults.length!=0){ // If there are any countries we know of
                    // console.log("CountryCodes Found Checking City For Codes"+countryResults[0].code);
                    countryResults.forEach(country => {if(country.code.match(cities1000[i].countrycode)!=null){ // See if this city is in those countries
                        if(cities1000[i].name.toLowerCase().match(homeTown.toLowerCase())!=null)searchMatches.push(cities1000[i]); //Check to see if the city/town matches the users value
                        else if (cities1000[i].asciiname.toLowerCase().match(homeTown.toLowerCase())!=null)searchMatches.push(cities1000[i]);
                        else if (cities1000[i].alternatenames.toLowerCase().match(homeTown.toLowerCase())!=null)searchMatches.push(cities1000[i]);
                    }
                    });
                }

                if(searchMatches.length>5) break;
            }
        }else if(homeTown.length>0){ //for every country look for city
            console.log("Searching ALL Countries");
            for(i=0; i, i<cities1000.length; i++){
                if (cities1000[i].name.toLowerCase().match(homeTown.toLowerCase()) != null) searchMatches.push(cities1000[i]); //Check to see if the city/town matches the users value
                else if (cities1000[i].asciiname.toLowerCase().match(homeTown.toLowerCase()) != null) searchMatches.push(cities1000[i]);
                else if (cities1000[i].alternatenames.toLowerCase().match(homeTown.toLowerCase()) != null) searchMatches.push(cities1000[i]);

                if(searchMatches.length>5) break;
            };
        }

        if(searchMatches.length==0) {
            console.log("No Matches")
            document.getElementById("search_results").innerHTML = "<div>" + "No Matches" + "</div>";
        }
        else {
            console.log(searchMatches.length);
            console.log(searchMatches);

            // var results = document.getElementById("search_results").innerHTML;
            // results = "";

            var text = "";
            for (i=0; i<searchMatches.length && i<5; i++) {
                var country = "'"+searchMatches[i].countrycode+"'";
                var city = "'"+searchMatches[i].name+"'";

                text +=
                    "<div id='search_result_" + i + "' " +
                        // "class='result' " +
                        "onClick='setInputFields(" + i + ")'> " +
                        "<div>" + "<b>- </b>" + "</div>" +
                        "<div>" + searchMatches[i].name + "</div>" +
                        "<div>" + ", " + "</div>" +
                        "<div>" + searchMatches[i].admin1code + "</div>" +
                        "<div>" + " " + "</div>" +
                        "<div>" + getCountryFromCountryCode(searchMatches[i].countrycode).name + "</div>" +
                    "</div>"
            }
            document.getElementById("search_results").innerHTML = text;
        }

        return searchMatches;
}

function getCountryCodes(homeCountry) {
    var matches = [];
    countryCodes.forEach(function(country) {
        if(country.name.toLowerCase().match(homeCountry.toLowerCase())!=null)matches.push(country);
    }, this);
    return matches;
}

function getCountryFromCountryCode(countryCode) {
    var match;
    countryCodes.forEach(function(country) {
        if(country.code.toLowerCase().match(countryCode.toLowerCase())!=null)match=country;
    }, this);
    return match;
}

function onFormChange(){
    if(searchCooldownTime>0){
        searchCooldownTime-=0.1;
        // console.log(searchCooldownTime);
        if(!(searchCooldownTime>0)){
            getLocation();
        }
    }
}

// GEOLocation ---------------------------------------------------------------------------------------------------------------------

// Navigation ----------------------------------------------------------------------------------------------------------------------
function showPage(pageID) {
    // console.log("Show");
    document.getElementById(pageID).style.display = "block";
}

function hidePage(pageID) {
    // console.log("Hide");
    document.getElementById(pageID).style.display = "none";
}

function togglePage(pageID) {
    // console.log("Toggle");
    if(document.getElementById(pageID).style.display == "none")showPage(pageID) 
    else
    if(document.getElementById(pageID).style.display == "block")hidePage(pageID);
}

function closeInfoDrawer() {
    turnOnAutoRotate();
    document.getElementById("info").style.maxWidth = "0px";
}
// Navigation ----------------------------------------------------------------------------------------------------------------------

function generateRandomInteger(min, max) {
return Math.floor(min + Math.random()*(max+1 - min))
}

// Converts numeric degrees to radians
function toRad(Value) 
{
    return Value * Math.PI / 180;
}

// File Management -----------------------------------------------------------------------------------------------------------------
function addVisitorToLocalStorage(visitor){
    if (typeof(Storage) !== "undefined") { // Browser support
        if (!localStorage.getItem('visitors')||localStorage.getItem('visitors')==null) { // Has this been created
            localStorage.setItem('visitors', '[]');
            console.log("Creating Local Visitors");
        } else {
            console.log("Local Visitors Found");
            // console.log("Local Visitors Found: " + localStorage.getItem('visitors'));
        }
        // Retrieve
        var visitors = JSON.parse(localStorage.getItem('visitors'));
        // Add visitor
        visitors.push(visitor);
        // Store
        localStorage.setItem('visitors', JSON.stringify(visitors));
    } else {
        console.log("Sorry! No Web Storage support..");
    }
}

function saveVisitor(name_first, name_last, home_town, home_country, home_state, latitude, longitude, date_time){
    var currentVisitorObject = visitor(
        name_first,
        name_last,
        home_town,
        home_country,
        home_state,
        latitude,
        longitude,
        date_time,
    );

    addVisitorToLocalStorage(currentVisitorObject);

    function visitor(
        name_first,
        name_last,
        home_town,
        home_country,
        home_state,
        latitude,
        longitude,
        date_time,
    ) {
        var visitorObject =
        {
            name_first : name_first,
            name_last : name_last,
            home_town : home_town,
            home_country : home_country,
            home_state : home_state,
            latitude : latitude,
            longitude : longitude,
            date_time : date_time,
        }
        return visitorObject;
    }
}

function downloadUsers(){
    saveToJson(localStorage.getItem('visitors'));
}

function saveToFile(text, filename){
    var a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(text));
    a.setAttribute('download', filename);
    a.click()
}
 // File Management -----------------------------------------------------------------------------------------------------------------

// Multi Threading -------------------------------------------------------------------------------------------------------------------
function startWorkerThread() {
    if(typeof(Worker) !== "undefined") {
        if(typeof(threadWorker) == "undefined") {
            threadWorker = new Worker("scripts/threadWorker.js");

            threadWorker.addEventListener('message', function(event) {
                searchResults=event.data[0];
                document.getElementById("search_results").innerHTML=event.data[1];
                // console.log("Thread Worker Message: " + event.data);

                document.getElementById('loader-1').style.display = "none";

                if(!threadWorkerPrimed){
                    document.getElementById("search_results").innerHTML = "<div>" + "Geolocation Ready" + "</div>";
                    threadWorkerPrimed = true;
                }
            }, false);
        }

        var logvisitform = document.getElementById("log_visit_form");
        var homeCountry = logvisitform.home_country.value;
        var homeTown = logvisitform.home_town.value;
        document.getElementById('loader-1').style.display = "block";
        if(!threadWorkerPrimed){
            threadWorker.postMessage([cities1000, homeCountry, homeTown]);
        } else {
            threadWorker.postMessage([[], homeCountry, homeTown]);
        }

            // threadWorker = new Worker("scripts/threadWorker.js");
    } else {
        console.log("Sorry, your browser does not support Web Workers...");
        searchCities();
    }
}
// Multi Threading -------------------------------------------------------------------------------------------------------------------

function lerp(a, b, t) {
    return (a + t * (b - a));
}
function toDegrees (angle) {
    return angle * (180 / Math.PI);
}
