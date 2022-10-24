﻿"use strict";
var cfg = require("./../util/configuration.js");

var getSanction = function (sanctionid, agency) {
    if (!agency) { agency = "ofac";}

    var uri = `./rsc/${agency.toUpperCase()}/Sanctions.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        var sanction = data.details.find(l => l[agency.toUpperCase() + "SanctionID"] == sanctionid);
        promise.resolve(sanction);
    }).fail(function () {
        promise.reject("Unable to get sanction");
    });
    return promise;
};

var getSanctionsByCountryCode = function (countrycode, agency) {
    if (!agency) { agency = "ofac"; }

    var uri = `./rsc/${agency.toUpperCase()}/Sanctions.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
         promise.resolve(data.listings);
    }).fail(function () {
        promise.reject("Unable to get sanctions");
    });
    return promise;
};

var getSanctionsByRegulation = function (regulationID, agency) {
    if (!agency) { agency = "ofac"; }

    var uri = `./rsc/${agency.toUpperCase()}/Sanctions.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data.listings);
    }).fail(function () {
        promise.reject("Unable to get sanctions");
    });
    return promise;
};

var getSanctionsRecent = function (agency) {
   if (!agency) { agency = "ofac"; }

    var uri = `./rsc/${agency.toUpperCase()}/Sanctions.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data.listings);
    }).fail(function () {
        promise.reject("Unable to get sanctions");
    });
    return promise;
};


var getSanctionCases = function (searchParams, agency) {
    var uri = `./rsc/${agency.toUpperCase()}/Sanctions.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data.listings);
    }).fail(function () {
        promise.reject("Unable to get sanctions");
    });
    return promise;
};

var getSanctions = function (sanctionids, agency) {
    if (!agency) { agency = "ofac"; }

    var uri = `./rsc/${agency.toUpperCase()}/Sanctions.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        var sanctions = [];

        sanctionids.forEach((s) => {
            sanctions.push(data.details.find(l => l[agency.toUpperCase() + "SanctionID"] == s));
        });
        promise.resolve(sanctions);
    }).fail(function () {
        promise.reject("Unable to get sanction");
    });
    return promise;
};

var getSanctionsByECCN = function (cclCategory, productGroup, eccn, agency) {

    if (!agency) { agency = "ofac"; }

    var uri = `./rsc/${agency.toUpperCase()}/Sanctions.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data.listings);
    }).fail(function () {
        promise.reject("Unable to get sanctions");
    });
    return promise;
};


var getLatestSanctionUpdate = function (agency) {
    var promise = $.Deferred();

    promise.resolve(Date.now());
    return promise;
};

module.exports = {
    getSanction: getSanction,
    getSanctions: getSanctions,
    getSanctionCases: getSanctionCases,
    getSanctionsRecent: getSanctionsRecent,
    getSanctionsByCountryCode: getSanctionsByCountryCode,
    getSanctionsByRegulation: getSanctionsByRegulation,
    getSanctionsByECCN: getSanctionsByECCN,
    getLatestSanctionUpdate: getLatestSanctionUpdate,

};