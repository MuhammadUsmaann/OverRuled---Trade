"use strict";
var cfg = require("./../util/configuration.js");


var getCurrentNewsAlerts = function (section, numberOfItems) {
    var uri = `./rsc/Alerts/news.json`;

    var promise = $.get(uri);
    return promise;
};

module.exports = {
    getCurrentNewsAlerts: getCurrentNewsAlerts
}