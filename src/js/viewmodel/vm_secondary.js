"use strict";

var secondarymodel = require("./../model/secondary_model.js");
var errmodel = require("./../viewmodel/vm_exception_logger.js");

var getPrograms = function (keyWord) {
    var deferred = $.Deferred();
    secondarymodel.getSecondaryPrograms(keyWord).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsecondarymodel.logException(err.statusText, "getSecondaryNonCountryPrograms");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};


var getCountryList = function () {
    var deferred = $.Deferred();
    secondarymodel.getSecondaryCountryList().then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsecondarymodel.logException(err.statusText, "getCountryList");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getNonCountryPrograms = function () {
    var deferred = $.Deferred();
    secondarymodel.getSecondaryNonCountryPrograms().then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsecondarymodel.logException(err.statusText, "getSecondaryNonCountryPrograms");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getSecondarySanctions = function (countryCode) {
    var deferred = $.Deferred();
    secondarymodel.getSecondarySanctions(countryCode).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsecondarymodel.logException(err.statusText, "getSecondarySanctions");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getAuthoritiesBySanctionID = function (sanctionID, keyWord) {
    var deferred = $.Deferred();
    secondarymodel.getSecondaryAuthoritiesBySanctionID(sanctionID, keyWord).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsecondarymodel.logException(err.statusText, "getSecondaryAuthoritiesBySanctionID");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getAuthoritiesByCountry = function (countryCode, keyWord) {
    var deferred = $.Deferred();
    secondarymodel.getSecondaryAuthoritiesByCountry(countryCode, keyWord).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsecondarymodel.logException(err.statusText, "getSecondaryAuthoritiesByCountry");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};
var getAuthority = function (id) {
    var deferred = $.Deferred();
    secondarymodel.getSecondaryAuthority(id).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsecondarymodel.logException(err.statusText, "getSecondaryAuthority");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getLatestSecondaryUpdate = function () {
    var deferred = $.Deferred();
    secondarymodel.getLatestSecondaryUpdate().then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsecondarymodel.logException(err.statusText, "getLatestSecondaryUpdate");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred;
}

module.exports = {
    getPrograms: getPrograms,
    getCountryList: getCountryList,
    getNonCountryPrograms: getNonCountryPrograms,
    getSecondarySanctions: getSecondarySanctions,
    getAuthoritiesBySanctionID: getAuthoritiesBySanctionID,
    getAuthoritiesByCountry: getAuthoritiesByCountry,
    getAuthority: getAuthority,
    getLatestSecondaryUpdate: getLatestSecondaryUpdate
};