"use strict";

var cfg = require("./../util/configuration.js");

import load from 'remote-script';


load("https://www.googletagmanager.com/gtag/js?id=${googleTrackingID}");


var gtag = function () {
    dataLayer.push(arguments);
};

var addAnalytics = function () {
    console.log("GATrack: " + cfg.googleTrackingID)
    if (cfg.googleTrackingID && cfg.googleTrackingID != "") {
        window.dataLayer = window.dataLayer || [];
        gtag('js', new Date());

        gtag('config', cfg.googleTrackingID);
    }
}; 

//module.exports = {
//    addAnalytics: addAnalytics
//};

export { addAnalytics };