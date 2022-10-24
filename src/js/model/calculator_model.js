"use strict";
var cfg = require("./../util/configuration.js");
var execSimpleCalculator = function (transValue, transDate, violationCount, statute, agency) {
    if (!agency) { agency = "ofac"; }

    var uri = `./rsc/${agency.toUpperCase()}/Calculator.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data.Simple);
    }).fail(function () {
        promise.reject("Unable to get calculation results");
    });
    return promise;
};

var execComplexCalculator = function (transactions, agency) {
    if (!agency) { agency = "ofac"; }

    var uri = `./rsc/${agency.toUpperCase()}/Calculator.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data.Complex);
    }).fail(function () {
        promise.reject("Unable to get calculation results");
    });
    return promise;
};

var getLatestPenaltyScheduleUpdate = function (agency) {
    if(!agency) { agency = "ofac"; }

    var uri = `./rsc/${agency.toUpperCase()}/Calculator.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data.LastUpdate);
    }).fail(function () {
        promise.reject("Unable to get calculation results");
    });
    return promise;
};


var getEgregiousPrediction = function (agency, factors) {
    if (!agency) { agency = "ofac"; }

    var uri = `./rsc/Calculator/Egregious.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data);
    }).fail(function () {
        promise.reject("Unable to get calculation results");
    });
    return promise;
}

var getMitigationPrediction = function (agency, factors) {
    if (!agency) { agency = "ofac"; }

	var uri = `./rsc/Calculator/Mitigation.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data);
    }).fail(function () {
        promise.reject("Unable to get calculation results");
    });
    return promise;
}

module.exports = {
    execSimpleCalculator: execSimpleCalculator,
    execComplexCalculator: execComplexCalculator,
    getLatestPenaltyScheduleUpdate: getLatestPenaltyScheduleUpdate,
    getEgregiousPrediction: getEgregiousPrediction,
    getMitigationPrediction: getMitigationPrediction,
}