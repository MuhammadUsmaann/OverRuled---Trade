"use strict";

var calcmodel = require("./../model/calculator_model.js");
var errmodel = require("./../viewmodel/vm_exception_logger.js");


var execSimpleCalculator = function (transValue, transDate, violationCount, statute, agency) {
    var deferred = $.Deferred();
    calcmodel.execSimpleCalculator(transValue, transDate, violationCount, statute, agency).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "SimpleCalculator");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred;
};


var execComplexCalculator = function (transactions) {
    var deferred = $.Deferred();
    calcmodel.execComplexCalculator(transactions).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "ComplexCalculator");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred;
};

var getLatestPenaltyScheduleDate = function (agency) {
    var deferred = $.Deferred();
    calcmodel.getLatestPenaltyScheduleUpdate(agency).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "GetLatestPenaltySchedules");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred;
}

var getEgregiousPrediction = function (agency, factors) {
    var deferred = $.Deferred();
    calcmodel.getEgregiousPrediction(agency, factors).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "EgregiousCasePrediction");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred;
};

var getMitigationPrediction = function (agency, factors) {
    var deferred = $.Deferred();
    calcmodel.getMitigationPrediction(agency, factors).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "EgregiousCasePrediction");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred;
};


module.exports = {
    execSimpleCalculator: execSimpleCalculator,
    execComplexCalculator: execComplexCalculator,
    getLatestPenaltyScheduleDate: getLatestPenaltyScheduleDate,
    getEgregiousPrediction: getEgregiousPrediction,
    getMitigationPrediction: getMitigationPrediction
};

