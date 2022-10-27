"use strict";

var model = require("../model/tradebase_model.js");

var getConfiguration = function() {
    var promise = model.getConfiguration();
    return promise;
};


module.exports = {
    getConfiguration: getConfiguration
};