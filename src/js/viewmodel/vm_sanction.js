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

var getOFACSanction = function (sanctionID) {
    var deferred = $.Deferred();
    sanctionsmodel.getSanction(sanctionID, "ofac").then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsanctionsmodel.logException(err.statusText, "getOFACSanction");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getOFACSanctionsByCountryCode = function (countryCode) {
    var deferred = $.Deferred();
    sanctionsmodel.getSanctionsByCountryCode(countryCode, "ofac").then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsanctionsmodel.logException(err.statusText, "getOFACSanctionsByCountryCode");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getOFACSanctionsByRegulation = function (regulation) {
    var deferred = $.Deferred();
    sanctionsmodel.getSanctionsByRegulation(regulation, "ofac").then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsanctionsmodel.logException(err.statusText, "getOFACSanctionsByRegulation");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getOFACSanctionsRecent = function () {
    var deferred = $.Deferred();

    sanctionsmodel.getSanctionsRecent("ofac").then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsanctionsmodel.logException(err.statusText, "getOFACSanctionsRecent");
            }
        } catch (ex) {
            //do nothing
        }

        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getOFACLatestUpdate = function () {
    var deferred = $.Deferred();
    sanctionsmodel.getLatestSanctionUpdate("OFAC").done(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsanctionsmodel.logException(err.statusText, "getLatestOFACUpdate");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred;
};


var getBISSanction = function (sanctionID) {
    var deferred = $.Deferred();
    sanctionsmodel.getSanction(sanctionID, "bis").then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsanctionsmodel.logException(err.statusText, "getBISSanction");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getBISSanctionsByCountryCode = function (countryCode) {
    var deferred = $.Deferred();
    sanctionsmodel.getSanctionsByCountryCode(countryCode, "bis").then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsanctionsmodel.logException(err.statusText, "getBISSanctionsByCountryCode");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getBISSanctionsByRegulation = function (regulation) {
    var deferred = $.Deferred();
    sanctionsmodel.getSanctionsByRegulation(regulation, "bis").then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsanctionsmodel.logException(err.statusText, "getBISSanctionsByRegulation");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getBISSanctionsRecent = function () {
    var deferred = $.Deferred();
    sanctionsmodel.getSanctionsRecent("bis").then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsanctionsmodel.logException(err.statusText, "getBISSanctionsRecent");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getBISLatestUpdate = function () {
    var deferred = $.Deferred();
    sanctionsmodel.getLatestSanctionUpdate("BIS").then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsanctionsmodel.logException(err.statusText, "getLatestBISUpdate");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred;
};

var getDDTCSanction = function (sanctionID) {
    var deferred = $.Deferred();
    sanctionsmodel.getSanction(sanctionID, "ddtc").then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsanctionsmodel.logException(err.statusText, "getDDTCSanction");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getDDTCSanctionsByCountryCode = function (countryCode) {
    var deferred = $.Deferred();
    sanctionsmodel.getSanctionsByCountryCode(countryCode, "ddtc").then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsanctionsmodel.logException(err.statusText, "getDDTCSanctionsByCountryCode");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getDDTCSanctionsByRegulation = function (regulation) {
    var deferred = $.Deferred();
    sanctionsmodel.getSanctionsByRegulation(regulation, "ddtc").then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsanctionsmodel.logException(err.statusText, "getDDTCSanctionsByRegulation");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getDDTCSanctionsRecent = function () {
    var deferred = $.Deferred();
    sanctionsmodel.getSanctionsRecent("ddtc").then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsanctionsmodel.logException(err.statusText, "getDDTCSanctionsRecent");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getDDTCLatestUpdate = function () {
    var deferred = $.Deferred();
    sanctionsmodel.getLatestSanctionUpdate("DDTC").then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errsanctionsmodel.logException(err.statusText, "getLatestDDTCUpdate");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred;
};

module.exports = {
    getOFACLatestUpdate: getOFACLatestUpdate,
    getOFACSanction: getOFACSanction,
    getOFACSanctionsByCountryCode: getOFACSanctionsByCountryCode,
    getOFACSanctionsByRegulation: getOFACSanctionsByRegulation,
    getOFACSanctionsRecent: getOFACSanctionsRecent,
    getBISLatestUpdate: getBISLatestUpdate,
    getBISSanction: getBISSanction,
    getBISSanctionsByCountryCode: getBISSanctionsByCountryCode,
    getBISSanctionsByRegulation: getBISSanctionsByRegulation,
    getBISSanctionsRecent: getBISSanctionsRecent,
    getDDTCLatestUpdate: getDDTCLatestUpdate,
    getDDTCSanction: getDDTCSanction,
    getDDTCSanctionsByCountryCode: getDDTCSanctionsByCountryCode,
    getDDTCSanctionsByRegulation: getDDTCSanctionsByRegulation,
    getDDTCSanctionsRecent: getDDTCSanctionsRecent,
    searchSanctions: searchSanctions
};