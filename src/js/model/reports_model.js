"use strict";
var cfg = require("./../util/configuration.js");

var getOFACActionsByIndustry = function () {
    var uri = `./rsc/OFAC/Reports.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data.ActionsByIndustry);
    }).fail(function () {
        promise.reject("Unable to get Actions by Induxtry");
    });
    return promise;
};

var getOFACAveragePenaltyByYear = function () {
    var uri = `./rsc/OFAC/Reports.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data.AveragePenalties);
    }).fail(function () {
        promise.reject("Unable to get Avg. Penalties By Year");
    });
    return promise;
};

var getOFACTotalPenaltyByYear = function () {

    var uri = `./rsc/OFAC/Reports.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data.TotalPenalties);
    }).fail(function () {
        promise.reject("Unable to get Total Penalties By Year");
    });
    return promise;
};

var getBISActionsByIndustry = function () {
    var uri = `./rsc/BIS/Reports.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data.ActionsByIndustry);
    }).fail(function () {
        promise.reject("Unable to get Actions by Induxtry");
    });
    return promise;
};

var getBISAveragePenaltyByYear = function () {
    var uri = `./rsc/BIS/Reports.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data.AveragePenalties);
    }).fail(function () {
        promise.reject("Unable to get Avg. Penalties By Year");
    });
    return promise;
};

var getBISTotalPenaltyByYear = function () {

    var uri = `./rsc/BIS/Reports.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data.TotalPenalties);
    }).fail(function () {
        promise.reject("Unable to get Total Penalties By Year");
    });
    return promise;
};

var getDDTCActionsByIndustry = function () {
    var uri = `./rsc/DDTC/Reports.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data.ActionsByIndustry);
    }).fail(function () {
        promise.reject("Unable to get Actions by Induxtry");
    });
    return promise;
};

var getDDTCAveragePenaltyByYear = function () {
    var uri = `./rsc/DDTC/Reports.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data.AveragePenalties);
    }).fail(function () {
        promise.reject("Unable to get Avg. Penalties By Year");
    });
    return promise;
};

var getDDTCTotalPenaltyByYear = function () {

    var uri = `./rsc/DDTC/Reports.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data.TotalPenalties);
    }).fail(function () {
        promise.reject("Unable to get Total Penalties By Year");
    });
    return promise;
};

var getSanctionRiskScores = function () {
    var uri = `./rsc/Maps/Sanctions.json`;

    var promise = $.get(uri);
    return promise;
};


var getExportRiskScores = function () {
    var uri = `./rsc/Maps/Exports.json`;

    var promise = $.get(uri);
    return promise;
};


var getOverallRiskScores = function () {
    var uri = `./rsc/Maps/Overall.json`;

    var promise = $.get(uri);
    return promise;
};


module.exports = {
    getOFACActionsByIndustry: getOFACActionsByIndustry,
    getOFACAveragePenaltyByYear: getOFACAveragePenaltyByYear,
    getOFACTotalPenaltyByYear: getOFACTotalPenaltyByYear,
    getBISActionsByIndustry: getBISActionsByIndustry,
    getBISAveragePenaltyByYear: getBISAveragePenaltyByYear,
    getBISTotalPenaltyByYear: getBISTotalPenaltyByYear,
    getDDTCActionsByIndustry: getDDTCActionsByIndustry,
    getDDTCAveragePenaltyByYear: getDDTCAveragePenaltyByYear,
    getDDTCTotalPenaltyByYear: getDDTCTotalPenaltyByYear,
    getSanctionRiskScores: getSanctionRiskScores,
    getExportRiskScores: getExportRiskScores,
    getOverallRiskScores: getOverallRiskScores,
}