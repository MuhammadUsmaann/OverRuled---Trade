"use strict";

var $ = require("jquery");
var _ = require("lodash");

var logException = function (message, trace, username) {
    var promise = $.Deferred();
    promise.resolve();
    return promise; 
};


module.exports = {
    logException: logException
};