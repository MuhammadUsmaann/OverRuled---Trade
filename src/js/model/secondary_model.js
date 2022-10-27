"use strict";
var cfg = require("./../util/configuration.js");

var getSecondaryPrograms = function (keyWord) {
    var uri = `./rsc/Secondary/Programs.json`;

    var promise = $.get(uri);
    return promise;
};

var getSecondaryCountryList = function () {
    
    return getSecondaryPrograms();
};

var getSecondaryNonCountryPrograms = function () {

    return getSecondaryPrograms();
};

var getSecondarySanctions = function (countryCode) {
    
    return getSecondaryPrograms();
};


var getSecondaryAuthoritiesBySanctionID = function (sanctionID, keyword) {
    var uri = `./rsc/Secondary/Authorities.json`;

    var promise = $.get(uri);
    return promise;
};

var getSecondaryAuthoritiesByCountry = function (countryCode, keyword) {
    var uri = `./rsc/Secondary/Authorities.json`;

    var promise = $.get(uri);
    return promise;
};

var getSecondaryAuthority = function (id) {
    var uri = `./rsc/Secondary/Authority.json`;

    var promise = $.get(uri);
    return promise;
};


var getLatestSecondaryUpdate = function () {
    var promise = $.Deferred();

    promise.resolve(Date.now());
    return promise;
};

module.exports = {
    getSecondaryCountryList: getSecondaryCountryList,
    getSecondaryNonCountryPrograms: getSecondaryNonCountryPrograms,
    getSecondarySanctions: getSecondarySanctions,
    getSecondaryAuthoritiesBySanctionID: getSecondaryAuthoritiesBySanctionID,
    getSecondaryAuthoritiesByCountry: getSecondaryAuthoritiesByCountry,
    getSecondaryAuthority: getSecondaryAuthority,
    getLatestSecondaryUpdate: getLatestSecondaryUpdate,
    getSecondaryPrograms: getSecondaryPrograms,
}

