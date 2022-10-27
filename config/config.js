"use strict";
var _ = require("lodash"); 


var common = {
};

var dev = {
    "ENVIRONMENT": JSON.stringify("DEV"),
    "TRADEBASE_SERVER": JSON.stringify("http://localhost"),
    "HOSTNAME": JSON.stringify("localhost"),
    "PROTOCOL": JSON.stringify("http"),
    "IIS_APP_NAME": JSON.stringify("tradebase_v2"),
    "API_NAME": JSON.stringify("api"),
    "DOCUMENTS_LOCATION": JSON.stringify("documents"),
    "BCL_SERVER": JSON.stringify("http://localhost"),
    "CEL_SERVER": JSON.stringify("http://localhost"), // Custom Error Logging API Server
    "ERROR_NOTIFICATION_RECIPIENTS": JSON.stringify("cwaldmann@akingump.com; "),
    "GA_TRACKING_ID": JSON.stringify("")
};


var test = {
    "ENVIRONMENT": JSON.stringify("TEST"),
    "TRADEBASE_SERVER": JSON.stringify("https://agsolutionstest.akingump.com"),
    "IIS_APP_NAME": JSON.stringify("Overruled"),
    "API_NAME": JSON.stringify("api"),
    "DOCUMENTS_LOCATION": JSON.stringify("documents"),
    "CEL_SERVER": JSON.stringify("https://agsolutionstest.akingump.com"), // Custom Error Logging API Server
    "DISPLAY_SCREEN_NAME": JSON.stringify(false),    // displays the screen name (i.e., "Requesting Attorney Inventory Screen") for different pages
    "ERROR_NOTIFICATION_RECIPIENTS": JSON.stringify("cwaldmann@akingump.com"),
    "EMAIL_RELAY_SERVER": JSON.stringify("https://agsolutionstest.akingump.com"),
    "GA_TRACKING_ID": JSON.stringify("")

};



var prod = {
    "ENVIRONMENT": JSON.stringify("PROD"),
    "TRADEBASE_SERVER": JSON.stringify("https://agsolutions"),
    "IIS_APP_NAME": JSON.stringify("Overruled"),
    "API_NAME": JSON.stringify("api"),
    "CEL_SERVER": JSON.stringify("https://agsolutions"),  // Custom Error Logging API Server
    "ERROR_NOTIFICATION_RECIPIENTS": JSON.stringify("itsolutionsdevelopment@akingump.com"),
    "EMAIL_RELAY_SERVER": JSON.stringify("https://agsolutions"),
    "GA_TRACKING_ID": JSON.stringify("G-TG4GMVMR5R")
};


var getEnvironmentVariables = function(mode) {        
    switch (mode) {
        case "dev":
            return _.merge(common, dev);
        case "test":
            return _.merge(common, test);
        case "prod":
            return _.merge(common, prod);
    }
};

module.exports = {
    getEnvironmentVariables: getEnvironmentVariables,

    node: { global: true },
};