// GEOLocation ---------------------------------------------------------------------------------------------------------------------

var cities1000 = [];

self.addEventListener('message', function(event) {
    var input = event.data; // Not used, but how we get it if we want it

    if(cities1000.length<=1){
        console.log("event.data[0] Size: " + event.data[0].length);
        cities1000 = event.data[0];
    }

    var findSolutions = function() {
        var returnData = searchCities(event.data[1],event.data[2]);
        self.postMessage(returnData);
    };
    findSolutions(event.data);

}, false);

function searchCities(homeCountry, homeTown) {
    // var logvisitform = document.getElementById("log_visit_form");
    // var homeCountry = logvisitform.home_country.value;
    // var homeTown = logvisitform.home_town.value;
    console.log("Searching locations for " + homeTown  +", "+ homeCountry);
    console.log("Cities1000 Size: " + cities1000.length);
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

    var text = "";

    if(searchMatches.length==0) {
        console.log("No Matches")
        text = "<div>" + "No Matches" + "</div>";
        // document.getElementById("search_results").innerHTML = "<div>" + "No Matches" + "</div>";
    }
    else {
        console.log(searchMatches.length);
        console.log(searchMatches);

        // var results = document.getElementById("search_results").innerHTML;
        // results = "";

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
        // document.getElementById("search_results").innerHTML = text;
    }

    // if(threadWorker != "undefined") {threadWorker.postMessage(searchMatches);}
    return [searchMatches, text];
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

// GEOLocation ---------------------------------------------------------------------------------------------------------------------

var countryCodes = [
    {'name': 'Afghanistan', 'code': 'AF'},
    {'name': 'land Islands', 'code': 'AX'},
    {'name': 'Albania', 'code': 'AL'},
    {'name': 'Algeria', 'code': 'DZ'},
    {'name': 'American Samoa', 'code': 'AS'},
    {'name': 'AndorrA', 'code': 'AD'},
    {'name': 'Angola', 'code': 'AO'},
    {'name': 'Anguilla', 'code': 'AI'},
    {'name': 'Antarctica', 'code': 'AQ'},
    {'name': 'Antigua and Barbuda', 'code': 'AG'},
    {'name': 'Argentina', 'code': 'AR'},
    {'name': 'Armenia', 'code': 'AM'},
    {'name': 'Aruba', 'code': 'AW'},
    {'name': 'Australia', 'code': 'AU'},
    {'name': 'Austria', 'code': 'AT'},
    {'name': 'Azerbaijan', 'code': 'AZ'},
    {'name': 'Bahamas', 'code': 'BS'},
    {'name': 'Bahrain', 'code': 'BH'},
    {'name': 'Bangladesh', 'code': 'BD'},
    {'name': 'Barbados', 'code': 'BB'},
    {'name': 'Belarus', 'code': 'BY'},
    {'name': 'Belgium', 'code': 'BE'},
    {'name': 'Belize', 'code': 'BZ'},
    {'name': 'Benin', 'code': 'BJ'},
    {'name': 'Bermuda', 'code': 'BM'},
    {'name': 'Bhutan', 'code': 'BT'},
    {'name': 'Bolivia', 'code': 'BO'},
    {'name': 'Bosnia and Herzegovina', 'code': 'BA'},
    {'name': 'Botswana', 'code': 'BW'},
    {'name': 'Bouvet Island', 'code': 'BV'},
    {'name': 'Brazil', 'code': 'BR'},
    {'name': 'British Indian Ocean Territory', 'code': 'IO'},
    {'name': 'Brunei Darussalam', 'code': 'BN'},
    {'name': 'Bulgaria', 'code': 'BG'},
    {'name': 'Burkina Faso', 'code': 'BF'},
    {'name': 'Burundi', 'code': 'BI'},
    {'name': 'Cambodia', 'code': 'KH'},
    {'name': 'Cameroon', 'code': 'CM'},
    {'name': 'Canada', 'code': 'CA'},
    {'name': 'Cape Verde', 'code': 'CV'},
    {'name': 'Cayman Islands', 'code': 'KY'},
    {'name': 'Central African Republic', 'code': 'CF'},
    {'name': 'Chad', 'code': 'TD'},
    {'name': 'Chile', 'code': 'CL'},
    {'name': 'China', 'code': 'CN'},
    {'name': 'Christmas Island', 'code': 'CX'},
    {'name': 'Cocos (Keeling) Islands', 'code': 'CC'},
    {'name': 'Colombia', 'code': 'CO'},
    {'name': 'Comoros', 'code': 'KM'},
    {'name': 'Congo', 'code': 'CG'},
    {'name': 'Congo, The Democratic Republic of the', 'code': 'CD'},
    {'name': 'Cook Islands', 'code': 'CK'},
    {'name': 'Costa Rica', 'code': 'CR'},
    {'name': "Cote D'Ivoire", 'code': 'CI'},
    {'name': 'Croatia', 'code': 'HR'},
    {'name': 'Cuba', 'code': 'CU'},
    {'name': 'Cyprus', 'code': 'CY'},
    {'name': 'Czech Republic', 'code': 'CZ'},
    {'name': 'Denmark', 'code': 'DK'},
    {'name': 'Djibouti', 'code': 'DJ'},
    {'name': 'Dominica', 'code': 'DM'},
    {'name': 'Dominican Republic', 'code': 'DO'},
    {'name': 'Ecuador', 'code': 'EC'},
    {'name': 'Egypt', 'code': 'EG'},
    {'name': 'El Salvador', 'code': 'SV'},
    {'name': 'Equatorial Guinea', 'code': 'GQ'},
    {'name': 'Eritrea', 'code': 'ER'},
    {'name': 'Estonia', 'code': 'EE'},
    {'name': 'Ethiopia', 'code': 'ET'},
    {'name': 'Falkland Islands (Malvinas)', 'code': 'FK'},
    {'name': 'Faroe Islands', 'code': 'FO'},
    {'name': 'Fiji', 'code': 'FJ'},
    {'name': 'Finland', 'code': 'FI'},
    {'name': 'France', 'code': 'FR'},
    {'name': 'French Guiana', 'code': 'GF'},
    {'name': 'French Polynesia', 'code': 'PF'},
    {'name': 'French Southern Territories', 'code': 'TF'},
    {'name': 'Gabon', 'code': 'GA'},
    {'name': 'Gambia', 'code': 'GM'},
    {'name': 'Georgia', 'code': 'GE'},
    {'name': 'Germany', 'code': 'DE'},
    {'name': 'Ghana', 'code': 'GH'},
    {'name': 'Gibraltar', 'code': 'GI'},
    {'name': 'Greece', 'code': 'GR'},
    {'name': 'Greenland', 'code': 'GL'},
    {'name': 'Grenada', 'code': 'GD'},
    {'name': 'Guadeloupe', 'code': 'GP'},
    {'name': 'Guam', 'code': 'GU'},
    {'name': 'Guatemala', 'code': 'GT'},
    {'name': 'Guernsey', 'code': 'GG'},
    {'name': 'Guinea', 'code': 'GN'},
    {'name': 'Guinea-Bissau', 'code': 'GW'},
    {'name': 'Guyana', 'code': 'GY'},
    {'name': 'Haiti', 'code': 'HT'},
    {'name': 'Heard Island and Mcdonald Islands', 'code': 'HM'},
    {'name': 'Holy See (Vatican City State)', 'code': 'VA'},
    {'name': 'Honduras', 'code': 'HN'},
    {'name': 'Hong Kong', 'code': 'HK'},
    {'name': 'Hungary', 'code': 'HU'},
    {'name': 'Iceland', 'code': 'IS'},
    {'name': 'India', 'code': 'IN'},
    {'name': 'Indonesia', 'code': 'ID'},
    {'name': 'Iran, Islamic Republic Of', 'code': 'IR'},
    {'name': 'Iraq', 'code': 'IQ'},
    {'name': 'Ireland', 'code': 'IE'},
    {'name': 'Isle of Man', 'code': 'IM'},
    {'name': 'Israel', 'code': 'IL'},
    {'name': 'Italy', 'code': 'IT'},
    {'name': 'Jamaica', 'code': 'JM'},
    {'name': 'Japan', 'code': 'JP'},
    {'name': 'Jersey', 'code': 'JE'},
    {'name': 'Jordan', 'code': 'JO'},
    {'name': 'Kazakhstan', 'code': 'KZ'},
    {'name': 'Kenya', 'code': 'KE'},
    {'name': 'Kiribati', 'code': 'KI'},
    {'name': "Korea, Democratic People'S Republic of", 'code': 'KP'},
    {'name': 'Korea, Republic of', 'code': 'KR'},
    {'name': 'Kuwait', 'code': 'KW'},
    {'name': 'Kyrgyzstan', 'code': 'KG'},
    {'name': "Lao People'S Democratic Republic", 'code': 'LA'},
    {'name': 'Latvia', 'code': 'LV'},
    {'name': 'Lebanon', 'code': 'LB'},
    {'name': 'Lesotho', 'code': 'LS'},
    {'name': 'Liberia', 'code': 'LR'},
    {'name': 'Libyan Arab Jamahiriya', 'code': 'LY'},
    {'name': 'Liechtenstein', 'code': 'LI'},
    {'name': 'Lithuania', 'code': 'LT'},
    {'name': 'Luxembourg', 'code': 'LU'},
    {'name': 'Macao', 'code': 'MO'},
    {'name': 'Macedonia, The Former Yugoslav Republic of', 'code': 'MK'},
    {'name': 'Madagascar', 'code': 'MG'},
    {'name': 'Malawi', 'code': 'MW'},
    {'name': 'Malaysia', 'code': 'MY'},
    {'name': 'Maldives', 'code': 'MV'},
    {'name': 'Mali', 'code': 'ML'},
    {'name': 'Malta', 'code': 'MT'},
    {'name': 'Marshall Islands', 'code': 'MH'},
    {'name': 'Martinique', 'code': 'MQ'},
    {'name': 'Mauritania', 'code': 'MR'},
    {'name': 'Mauritius', 'code': 'MU'},
    {'name': 'Mayotte', 'code': 'YT'},
    {'name': 'Mexico', 'code': 'MX'},
    {'name': 'Micronesia, Federated States of', 'code': 'FM'},
    {'name': 'Moldova, Republic of', 'code': 'MD'},
    {'name': 'Monaco', 'code': 'MC'},
    {'name': 'Mongolia', 'code': 'MN'},
    {'name': 'Montenegro', 'code': 'ME'},
    {'name': 'Montserrat', 'code': 'MS'},
    {'name': 'Morocco', 'code': 'MA'},
    {'name': 'Mozambique', 'code': 'MZ'},
    {'name': 'Myanmar', 'code': 'MM'},
    {'name': 'Namibia', 'code': 'NA'},
    {'name': 'Nauru', 'code': 'NR'},
    {'name': 'Nepal', 'code': 'NP'},
    {'name': 'Netherlands', 'code': 'NL'},
    {'name': 'Netherlands Antilles', 'code': 'AN'},
    {'name': 'New Caledonia', 'code': 'NC'},
    {'name': 'New Zealand', 'code': 'NZ'},
    {'name': 'Nicaragua', 'code': 'NI'},
    {'name': 'Niger', 'code': 'NE'},
    {'name': 'Nigeria', 'code': 'NG'},
    {'name': 'Niue', 'code': 'NU'},
    {'name': 'Norfolk Island', 'code': 'NF'},
    {'name': 'Northern Mariana Islands', 'code': 'MP'},
    {'name': 'Norway', 'code': 'NO'},
    {'name': 'Oman', 'code': 'OM'},
    {'name': 'Pakistan', 'code': 'PK'},
    {'name': 'Palau', 'code': 'PW'},
    {'name': 'Palestinian Territory, Occupied', 'code': 'PS'},
    {'name': 'Panama', 'code': 'PA'},
    {'name': 'Papua New Guinea', 'code': 'PG'},
    {'name': 'Paraguay', 'code': 'PY'},
    {'name': 'Peru', 'code': 'PE'},
    {'name': 'Philippines', 'code': 'PH'},
    {'name': 'Pitcairn', 'code': 'PN'},
    {'name': 'Poland', 'code': 'PL'},
    {'name': 'Portugal', 'code': 'PT'},
    {'name': 'Puerto Rico', 'code': 'PR'},
    {'name': 'Qatar', 'code': 'QA'},
    {'name': 'Reunion', 'code': 'RE'},
    {'name': 'Romania', 'code': 'RO'},
    {'name': 'Russian Federation', 'code': 'RU'},
    {'name': 'RWANDA', 'code': 'RW'},
    {'name': 'Saint Helena', 'code': 'SH'},
    {'name': 'Saint Kitts and Nevis', 'code': 'KN'},
    {'name': 'Saint Lucia', 'code': 'LC'},
    {'name': 'Saint Pierre and Miquelon', 'code': 'PM'},
    {'name': 'Saint Vincent and the Grenadines', 'code': 'VC'},
    {'name': 'Samoa', 'code': 'WS'},
    {'name': 'San Marino', 'code': 'SM'},
    {'name': 'Sao Tome and Principe', 'code': 'ST'},
    {'name': 'Saudi Arabia', 'code': 'SA'},
    {'name': 'Senegal', 'code': 'SN'},
    {'name': 'Serbia', 'code': 'RS'},
    {'name': 'Seychelles', 'code': 'SC'},
    {'name': 'Sierra Leone', 'code': 'SL'},
    {'name': 'Singapore', 'code': 'SG'},
    {'name': 'Slovakia', 'code': 'SK'},
    {'name': 'Slovenia', 'code': 'SI'},
    {'name': 'Solomon Islands', 'code': 'SB'},
    {'name': 'Somalia', 'code': 'SO'},
    {'name': 'South Africa', 'code': 'ZA'},
    {'name': 'South Georgia and the South Sandwich Islands', 'code': 'GS'},
    {'name': 'Spain', 'code': 'ES'},
    {'name': 'Sri Lanka', 'code': 'LK'},
    {'name': 'Sudan', 'code': 'SD'},
    {'name': 'Suriname', 'code': 'SR'},
    {'name': 'Svalbard and Jan Mayen', 'code': 'SJ'},
    {'name': 'Swaziland', 'code': 'SZ'},
    {'name': 'Sweden', 'code': 'SE'},
    {'name': 'Switzerland', 'code': 'CH'},
    {'name': 'Syrian Arab Republic', 'code': 'SY'},
    {'name': 'Taiwan, Province of China', 'code': 'TW'},
    {'name': 'Tajikistan', 'code': 'TJ'},
    {'name': 'Tanzania, United Republic of', 'code': 'TZ'},
    {'name': 'Thailand', 'code': 'TH'},
    {'name': 'Timor-Leste', 'code': 'TL'},
    {'name': 'Togo', 'code': 'TG'},
    {'name': 'Tokelau', 'code': 'TK'},
    {'name': 'Tonga', 'code': 'TO'},
    {'name': 'Trinidad and Tobago', 'code': 'TT'},
    {'name': 'Tunisia', 'code': 'TN'},
    {'name': 'Turkey', 'code': 'TR'},
    {'name': 'Turkmenistan', 'code': 'TM'},
    {'name': 'Turks and Caicos Islands', 'code': 'TC'},
    {'name': 'Tuvalu', 'code': 'TV'},
    {'name': 'Uganda', 'code': 'UG'},
    {'name': 'Ukraine', 'code': 'UA'},
    {'name': 'United Arab Emirates', 'code': 'AE'},
    {'name': 'United Kingdom', 'code': 'GB'},
    {'name': 'United States', 'code': 'US'},
    {'name': 'United States Minor Outlying Islands', 'code': 'UM'},
    {'name': 'Uruguay', 'code': 'UY'},
    {'name': 'Uzbekistan', 'code': 'UZ'},
    {'name': 'Vanuatu', 'code': 'VU'},
    {'name': 'Venezuela', 'code': 'VE'},
    {'name': 'Viet Nam', 'code': 'VN'},
    {'name': 'Virgin Islands, British', 'code': 'VG'},
    {'name': 'Virgin Islands, U.S.', 'code': 'VI'},
    {'name': 'Wallis and Futuna', 'code': 'WF'},
    {'name': 'Western Sahara', 'code': 'EH'},
    {'name': 'Yemen', 'code': 'YE'},
    {'name': 'Zambia', 'code': 'ZM'},
    {'name': 'Zimbabwe', 'code': 'ZW'}
]
