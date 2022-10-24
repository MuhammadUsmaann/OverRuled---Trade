"use strict";

var sanctionsmodel = require("./../model/sanctions_model");
var vmSearch = require("./vm_search");


var searchSanctions = function (searchParams, agency) {
    var deferred = $.Deferred();
    sanctionsmodel.getSanctionCases(searchParams, agency).then(function (data) {
        if (searchParams.Keywords && searchParams.Keywords.length != 0) {
            vmSearch.addRecentSearch(searchParams.Keywords);
        }
        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsanctionsmodel.logException(err.statusText, "searchSanctions");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred;
};

var getSanction = function (sanctionID, agency){
    var deferred = $.Deferred();
    sanctionsmodel.getSanction(sanctionID, agency).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsanctionsmodel.logException(err.statusText, "get" + agency + "Sanction");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
}

var getSanctions = function (sanctionIDs, agency) {
    var deferred = $.Deferred();
    sanctionsmodel.getSanctions(sanctionIDs, agency).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsanctionsmodel.logException(err.statusText, "get" + agency + "Sanctions");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
}


var getSanctionsByCountryCode = function (countryCode, agency) {
    var deferred = $.Deferred();
    sanctionsmodel.getSanctionsByCountryCode(countryCode, agency).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsanctionsmodel.logException(err.statusText, "get" + agency +"SanctionsByCountryCode");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getSanctionsByRegulation = function (regulation, agency) {
    var deferred = $.Deferred();
    sanctionsmodel.getSanctionsByRegulation(regulation, agency).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsanctionsmodel.logException(err.statusText, "get" + agency +"SanctionsByRegulation");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getSanctionsByECCN = function (cclCategory, productGroup, eccn, agency) {
    var deferred = $.Deferred();
    sanctionsmodel.getSanctionsByECCN(cclCategory, productGroup, eccn, agency).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsanctionsmodel.logException(err.statusText, "get" + agency +"SanctionsByRegulation");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getSanctionsRecent = function (agency) {
    var deferred = $.Deferred();

    sanctionsmodel.getSanctionsRecent(agency).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsanctionsmodel.logException(err.statusText, "get" + agency +"SanctionsRecent");
            }
        } catch (ex) {
            //do nothing
        }

        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getLatestUpdate = function (agency) {
    var deferred = $.Deferred();
    sanctionsmodel.getLatestSanctionUpdate(agency).done(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsanctionsmodel.logException(err.statusText, "getLatest" + agency +"SanctionUpdate");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred;
};




module.exports = {
    getLatestUpdate: getLatestUpdate,
    getSanction: getSanction,
    getSanctions: getSanctions,
    getSanctionsByCountryCode: getSanctionsByCountryCode,
    getSanctionsByRegulation: getSanctionsByRegulation,
    getSanctionsByECCN: getSanctionsByECCN,
    getSanctionsRecent: getSanctionsRecent,
    searchSanctions: searchSanctions
};