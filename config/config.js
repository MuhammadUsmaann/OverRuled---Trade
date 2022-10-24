"use strict";
var _ = require("lodash"); 


var common = {
};

var dev = {
    "ENVIRONMENT": JSON.stringify("DEV"),
    "TRADEBASE_SERVER": JSON.stringify("http://localhost"),
    "HOSTNAME": JSON.stringify("localhost"),
    "PROTOCOL": JSON.stringify("http"),
    "IIS_APP_NAME": JSON.stringify("api"),
    "CLIENT_NAME": JSON.stringify(""),
    "API_NAME": JSON.stringify("api"),
    "DOCUMENTS_LOCATION": JSON.stringify("documents"),
    "BCL_SERVER": JSON.stringify("http://localhost"),
    "CEL_SERVER": JSON.stringify("http://localhost"), // Custom Error Logging API Server
    "ERROR_NOTIFICATION_RECIPIENTS": JSON.stringify("cwaldmann@akingump.com; "),
    "GA_TRACKING_ID": JSON.stringify("")
};


var getEnvironmentVariables = function(mode) {        
    switch (mode) {
        case "dev":
            return _.merge(common, dev);
        case "test":
            return _.merge(common, dev);
        case "prod":
            return _.merge(common, dev);
    }
};

module.exports = {
    getEnvironmentVariables: getEnvironmentVariables,

    node: { global: true },
};