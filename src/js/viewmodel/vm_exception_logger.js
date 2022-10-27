"use strict";

var model = require("../model/exception_logger_model.js");
var auth = require("./../util/auth");

var logException = function (message, stackTrace) {
    debugger;
    var un;
    var prmUser = auth.getCurrentUser().done(function (d) {
        un = d;
    }).fail(function () {
       un = "";
    });
    prmUser.always(function () {
        model.logException(message, stackTrace, un).fail(function (e) {
            console.log(e);
        });
    });
};

module.exports = {
    logException: logException
}