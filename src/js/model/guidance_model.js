"use strict";
var cfg = require("./../util/configuration.js");

var getLatestGuidanceUpdate = function (agency = "OFAC") {
    var promise = $.Deferred();

    promise.resolve(Date.now());
    return promise;
};

var getLatestGuidanceAndFaqUpdate = function (agency = "OFAC") {
    var promise = $.Deferred();

    promise.resolve(Date.now());
    return promise;
};

var getLatestFaqUpdate = function (agency = "OFAC") {
    var promise = $.Deferred();

    promise.resolve(Date.now());
    return promise;
};

var getFAQ = function (faqID, agency = "OFAC") {

    if (!agency) { agency = "ofac"; }

    var uri = `./rsc/${agency.toUpperCase()}/FAQs.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        var faq = data.Details.find(l => l.FaqID == faqID)
        promise.resolve(faq);
    }).fail(function () {
        promise.reject("Unable to get faq");
    });
    return promise;
};

var getFAQs = function (searchParams, agency = "OFAC") {
    if (!agency) { agency = "ofac"; }

    var uri = `./rsc/${agency.toUpperCase()}/FAQs.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data.Details);
    }).fail(function () {
        promise.reject("Unable to get faqs");
    });
    return promise;
};

var getFAQListings = function (searchParams, agency = "OFAC") {
    if (!agency) { agency = "ofac"; }

    var uri = `./rsc/${agency.toUpperCase()}/FAQs.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data.Listings);
    }).fail(function () {
        promise.reject("Unable to get faqs");
    });
    return promise;
};


var getFAQsByCategory = function (categoryID, agency = "OFAC") {
    if (!agency) { agency = "ofac"; }

    var uri = `./rsc/${agency.toUpperCase()}/FAQs.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data.Listings);
    }).fail(function () {
        promise.reject("Unable to get faqs");
    });
    return promise;
};

var getGuidanceDocuments = function (searchParams, agency = "OFAC") {
    if (!agency) { agency = "ofac"; }

    var uri = `./rsc/${agency.toUpperCase()}/Guidance.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data);
    }).fail(function () {
        promise.reject("Unable to get guidance");
    });
    return promise;
};

var getGuidanceDocumentsByRegulation = function (regulation, agency = "OFAC") {
    return getGuidanceDocuments(null, agency);
};


var getGuidanceCategories = function (programID, agency = "OFAC") {
    var uri = `./rsc/lookups/GuidanceCategories.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        switch (agency.toUpperCase()) {
            case "BIS":
                data = data.filter(l => l.UsedInBISFAQs == true || l.UsedInBISGuidance == true );
                break;
            case "DDTC":
                data = data.filter(l => l.UsedInDDTCFAQs == true || l.UsedInDDTCGuidance == true);
                break;
            case "OFAC":
                data = data.filter(l => l.UsedInOFACFAQs == true || l.UsedInOFACGuidance == true);
                break;
            
        }
        promise.resolve(data);
    }).fail(function () {
        promise.reject("Unable to get " + lookupType);
    });


    return promise;
};


var getFAQListingsByCategory = function (categoryID, agency = "OFAC") {
    return getFAQListings(null, agency);
};


var getFAQListingsBySecondaryAuthority = function (authorityid) {
    return getFAQListings(null, "OFAC");

};

var getFAQListingsByRegulation = function (regulation, agency = "OFAC") {
    return getFAQListings(null, agency);

};

var getGuidanceDocumentsByECCN = function (cclCategory, productGroup, eccn, agency = "OFAC") {
    return getGuidanceDocuments(null, agency);

};
var getFAQListingsByECCN = function (cclCategory, productGroup, eccn, agency = "OFAC") {
    return getFAQListings(null, agency);

};

module.exports = {
    getFAQ: getFAQ,
    getFAQs: getFAQs,
    getFAQListings: getFAQListings,
    getGuidanceCategories: getGuidanceCategories,
    getFAQListingsByCategory: getFAQListingsByCategory,
    getFAQListingsBySecondaryAuthority: getFAQListingsBySecondaryAuthority,
    getFAQListingsByRegulation: getFAQListingsByRegulation,
    getFAQListingsByECCN: getFAQListingsByECCN,
    getGuidanceDocuments: getGuidanceDocuments,
    getGuidanceDocumentsByRegulation: getGuidanceDocumentsByRegulation,
    getGuidanceDocumentsByECCN: getGuidanceDocumentsByECCN,
    getLatestGuidanceAndFaqUpdate: getLatestGuidanceAndFaqUpdate,
    getLatestGuidanceUpdate: getLatestGuidanceUpdate,
    getLatestFaqUpdate: getLatestFaqUpdate
};