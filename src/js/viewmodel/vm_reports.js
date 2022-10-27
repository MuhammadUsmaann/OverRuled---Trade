"use strict";

var rptmodel = require("./../model/reports_model.js");
var errmodel = require("./../viewmodel/vm_exception_logger.js");

var getOFACActionsByIndustry = function (yearsToGet) {
    yearsToGet = yearsToGet == null ? 10 : yearsToGet; 
    var deferred = $.Deferred();
    rptmodel.getOFACActionsByIndustry(yearsToGet).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getOFACActionsByIndustry");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getOFACAveragePenaltyByYear = function () {
    var deferred = $.Deferred();
    rptmodel.getOFACAveragePenaltyByYear().then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getOFACAveragePenaltyByYear");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getOFACTotalPenaltyByYear = function (yearsToGet) {
    yearsToGet = yearsToGet == null ? 10 : yearsToGet;
     var deferred = $.Deferred();
    rptmodel.getOFACTotalPenaltyByYear(yearsToGet).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getOFACTotalPenaltyByYear");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getBISActionsByIndustry = function (yearsToGet) {
    yearsToGet = yearsToGet == null ? 10 : yearsToGet; 
    var deferred = $.Deferred();
    rptmodel.getBISActionsByIndustry(yearsToGet).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getBISActionsByIndustry");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getBISAveragePenaltyByYear = function () {
    var deferred = $.Deferred();
    rptmodel.getBISAveragePenaltyByYear().then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getBISAveragePenaltyByYear");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getBISTotalPenaltyByYear = function (yearsToGet) {
    yearsToGet = yearsToGet == null ? 10 : yearsToGet;
    var deferred = $.Deferred();
    rptmodel.getBISTotalPenaltyByYear(yearsToGet).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getBISTotalPenaltyByYear");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};


var getDDTCActionsByIndustry = function (yearsToGet) {
    yearsToGet = yearsToGet == null ? 10 : yearsToGet; 
    var deferred = $.Deferred();
    rptmodel.getDDTCActionsByIndustry(yearsToGet).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getDDTCActionsByIndustry");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getDDTCAveragePenaltyByYear = function () {
    var deferred = $.Deferred();
    rptmodel.getDDTCAveragePenaltyByYear().then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getDDTCAveragePenaltyByYear");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getDDTCTotalPenaltyByYear = function (yearsToGet) {
    yearsToGet = yearsToGet == null ? 10 : yearsToGet;
    var deferred = $.Deferred();
    rptmodel.getDDTCTotalPenaltyByYear(yearsToGet).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getDDTCTotalPenaltyByYear");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};


var getSanctionRiskScores = function () {
    var deferred = $.Deferred();
    rptmodel.getSanctionRiskScores().then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getSanctionRiskScores");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getExportRiskScores = function () {
    var deferred = $.Deferred();
    rptmodel.getExportRiskScores().then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getExportRiskScores");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};


var getOverallRiskScores = function () {
    var deferred = $.Deferred();
    rptmodel.getOverallRiskScores().then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getOverallRiskScores");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getOFACSanctionsHeat = function () {
    var deferred = $.Deferred();
    rptmodel.getOFACSanctionsHeat().then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getCountryRiskScores");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getSDNCountryList = function () {
    var deferred = $.Deferred();
    reportsmodel.getSDNCountryList().then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getCountryList");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();

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
    getSDNCountryList: getSDNCountryList,
    getExportRiskScores: getExportRiskScores,
    getOverallRiskScores: getOverallRiskScores,
    getOFACSanctionsHeat: getOFACSanctionsHeat,
}