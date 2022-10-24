"use strict";

var utilmodel = require("./../model/utility_model.js");
var session = require("./../util/tradebase_session_storage");

var getLookupItems = function (lookupType, usedIn) {

    var deferred = $.Deferred();
    if (session.getItem(lookupType + ":" + usedIn) != null) {
        deferred.resolve(session.getItem(lookupType + ":" + usedIn));
    } else {
        utilmodel.getLookupItems(lookupType, usedIn).done(function (data) {
            session.setItem(lookupType + ":" + usedIn, data);
            deferred.resolve(data);
        }).fail(function (err) {
            deferred.resolve([]);
        });
    }
    return deferred.promise();
};

var getCountries = function (countryType) {

    var deferred = $.Deferred();
    if (session.getItem(countryType) != null) {
        deferred.resolve(session.getItem(countryType));
    } else {
        utilmodel.getCountries(countryType).done(function (data) {
            session.setItem(countryType, data);
            deferred.resolve(data);
        }).fail(function (err) {
            deferred.resolve([]);
        });
    }
    return deferred.promise();
};


var getRegulations = function (usedIn, parentID) {

    var deferred = $.Deferred();
    utilmodel.getRegulationsHierarchyLevel(usedIn, parentID).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getRegulations");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getCCLCategories = function (usedIn) {

    var deferred = $.Deferred();
    utilmodel.getCCLCategories(usedIn).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getCCLCategories");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};


var getProductGroups = function (usedIn, CCLCategory) {

    var deferred = $.Deferred();
    utilmodel.getProductGroups(usedIn, CCLCategory).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getCCLCategories");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getECCNs = function (usedIn, CCLCategory, ProductGroup) {
    var deferred = $.Deferred();
    utilmodel.getECCNs(usedIn, CCLCategory, ProductGroup).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getCCLCategories");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getLatestRecordUpdate = function (agency, recordType) {
    var deferred = $.Deferred();
    utilmodel.getLatestRecordUpdate(agency, recordType).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getLatestRecordUpdate");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

module.exports = {
    getLookupItems: getLookupItems,
    getCountries: getCountries,
    getRegulations: getRegulations,
    getCCLCategories: getCCLCategories,
    getProductGroups: getProductGroups,
    getECCNs: getECCNs,
    getLatestRecordUpdate: getLatestRecordUpdate
};

