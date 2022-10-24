"use strict";
var cfg = require("./../util/configuration.js");

var getLookupItems = function (lookupType, usedIn) {
    if (!usedIn) {
        usedIn = "ALL";
    }
    var uri = `./rsc/lookups/Lookups.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        data = data[lookupType];

        switch (usedIn.toUpperCase()) {
            case "SANCTIONS":
                data = data.filter(l => l.UsedInOFACSanctions == true || l.UsedInBISSanctions == true || l.UsedInDDTCSanctions == true);
                break;
            case "OFACSANCTIONS":
                data = data.filter(l => l.UsedInOFACSanctions == true);
                break;
            case "OFACFAQSANDGUIDANCE":
                data = data.filter(l => l.UsedInOFACFAQs == true || l.UsedInOFACGuidance);
                break;
            case "OFACFAQS":
                data = data.filter(l => l.UsedInOFACFAQs == true);
                break;
            case "OFACGUIDANCE":
                data = data.filter(l => l.UsedInOFACGuidance == true);
                break;
            case "SECONDARYSANCTIONS":
                data = data.filter(l => l.UsedInSecondarySanctions == true);
                break;
            case "BISSANCTIONS":
                data = data.filter(l => l.UsedInBISSanctions == true);
                break;
            case "BISFAQSANDGUIDANCE":
                data = data.filter(l => l.UsedInBISFAQs == true || l.UsedInBISGuidance);
                break;
            case "BISFAQS":
                data = data.filter(l => l.UsedInBISFAQs == true);
                break;
            case "BISGUIDANCE":
                data = data.filter(l => l.UsedInBISGuidance == true);
                break;
            case "DDTCSANCTIONS":
                data = data.filter(l => l.UsedInDDTCSanctions == true);
                break;
            case "DDTCFAQSANDGUIDANCE":
                data = data.filter(l => l.UsedInDDTCFAQs == true || l.UsedInDDTCGuidance);
                break;
            case "DDTCFAQS":
                data = data.filter(l => l.UsedInDDTCFAQs == true);
                break;
            case "DDTCGUIDANCE":
                data = data.filter(l => l.UsedInDDTCGuidance == true);
                break;
            case "OFAC":
                data = data.filter(l => l.UsedInOFACSanctions == true || l.UsedInOFACFAQs == true || l.UsedInOFACuidance);
                break;
            case "BIS":
                data = data.filter(l => l.UsedInDDTCSanctions == true || l.UsedInBISFAQs == true || l.UsedInBISGuidance);
                break;
            case "DDTC":
                data = data.filter(l => l.UsedInDDTCSanctions == true || l.UsedInDDTCFAQs == true || l.UsedInDDTCGuidance);
                break;
        }
        promise.resolve(data);
    }).fail(function () {
        promise.reject("Unable to get " + lookupType);
        });

    
    return promise;
};


var getCountries = function (countryType, agency) {

    if (countryType == "" || countryType == null) { countryType = "ALL"; }


    var uri = `./rsc/lookups/Countries.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        switch (countryType.toUpperCase()) {
            case "OFACSANCTION":
                data = data.filter(c => c.isOFACSanctioned == true);
                break;
            case "OFACDESTINATION":
                data = data.filter(c => c.isOFACDestination == true);
                break;
            case "OFACTRANSHIPMENT":
                data = data.filter(c => c.isOFACTranshipment == true);
                break;
            case "OFACRESPONDENT":
                data = data.filter(c => c.isOFACRespondent == true);
                break;
            case "BISDESTINATION":
                data = data.filter(c => c.isBISDestination == true);
                break;
            case "BISTRANSHIPMENT":
                data = data.filter(c => c.isBISTranshipment == true);
                break;
            case "BISRESPONDENT":
                data = data.filter(c => c.isBISRespondent == true);
                break;
            case "DDTCRESPONDENT":
                data = data.filtere(c => c.isDDTCRespondent == true);
                break;
            case "DDTCSANCTIONED126":
                data = data.filter(c => c.isDDTCSanctioned126 == true);
                break;
            case "DESTINATION":
                data = data.filter(c => c.isOFACDestination == true || c.isBISDestination == true);
                break;
            case "TRANSHIPMENT":
                data = data.filter(c => c.isOFACTranshipment == true || c.isBISTranshipment == true);
                break;
            case "RESPONDENT":
                data = data.filter(c => c.isOFACRespondent == true || c.isBISRespondent == true || c.isDDTCRespondent == true);
                break;
            case "OFAC":
                data = data.filter(c => c.isOFAC == true);
                break;
            case "BIS":
                data = data.filter(c => c.isBIS == true);
                break;
            case "DDTC":
                data = data.filter(c => c.isDDTC == true);
                break;
        }
        promise.resolve(data);
    }).fail(function () {
        promise.reject("Unable to get country list");
    });

    return promise;
};

var getCurrentUser = function () {

    var promise = $.Deferred();
    promise.resolve("TestUser");
    return promise;
};


var getRegulationsHierarchyLevel = function (usedIn, parentID) {
    if (!usedIn) {
        usedIn = "ALL";
    }
    if (!parentID || parentID <= 0) {
        parentID = null;
    }
    var uri = `./rsc/lookups/RegulatoryProvisions.json`;

    var promise = $.Deferred();

    $.get(uri).done(function (data) {
        var regs = data.filter(l => l.ParentID == parentID || (parentID == -1 && l.ParentID == null));
        switch (usedIn.toUpperCase()) {
            case "SANCTIONS":
                regs = regs.filter(l => l.UsedInOFACSanctions == true || l.UsedInBISSanctions == true || l.UsedInDDTCSanctions == true);
                break;
            case "OFACSANCTIONS":
                regs = regs.filter(l => l.UsedInOFACSanctions == true);
                break;
            case "OFACFAQSANDGUIDANCE":
                regs = regs.filter(l => l.UsedInOFACFAQs == true || l.UsedInOFACGuidance);
                break;
            case "OFACFAQS":
                regs = regs.filter(l => l.UsedInOFACFAQs == true);
                break;
            case "OFACGUIDANCE":
                regs = regs.filter(l => l.UsedInOFACGuidance == true);
                break;
            case "SECONDARYSANCTIONS":
                regs = regs.filter(l => l.UsedInSecondarySanctions == true);
                break;
            case "BISSANCTIONS":
                regs = regs.filter(l => l.UsedInBISSanctions == true);
                break;
            case "BISFAQSANDGUIDANCE":
                regs = regs.filter(l => l.UsedInBISFAQs == true || l.UsedInBISGuidance);
                break;
            case "BISFAQS":
                regs = regs.filter(l => l.UsedInBISFAQs == true);
                break;
            case "BISGUIDANCE":
                regs = regs.filter(l => l.UsedInBISGuidance == true);
                break;
            case "DDTCSANCTIONS":
                regs = regs.filter(l => l.UsedInDDTCSanctions == true);
                break;
            case "DDTCFAQSANDGUIDANCE":
                regs = regs.filter(l => l.UsedInDDTCFAQs == true || l.UsedInDDTCGuidance);
                break;
            case "DDTCFAQS":
                regs = regs.filter(l => l.UsedInDDTCFAQs == true);
                break;
            case "DDTCGUIDANCE":
                regs = regs.filter(l => l.UsedInDDTCGuidance == true);
                break;
            case "OFAC":
                regs = regs.filter(l => l.UsedInOFACSanctions == true || l.UsedInOFACFAQs == true || l.UsedInOFACuidance);
                break;
            case "BIS":
                regs = regs.filter(l => l.UsedInDDTCSanctions == true || l.UsedInBISFAQs == true || l.UsedInBISGuidance);
                break;
            case "DDTC":
                regs = regs.filter(l => l.UsedInDDTCSanctions == true || l.UsedInDDTCFAQs == true || l.UsedInDDTCGuidance);
                break;
        }
        promise.resolve(regs);
    });
    return promise;
};

var getCCLCategories = function (usedIn) {
    var uri = `./rsc/lookups/CCLCategories.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data);
    }).fail(function () {
        promise.reject("Unable to get CCL Categories");
    });
    return promise;
};

var getProductGroups = function (usedIn, cclCategory) {
    var uri = `./rsc/lookups/ProductGroups.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data);
    }).fail(function () {
        promise.reject("Unable to get Product Groups");
    });
    return promise;
};

var getECCNs = function (usedIn, cclCategory, productGroup) {
    var uri = `./rsc/lookups/ECCNs.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data);
    }).fail(function () {
        promise.reject("Unable to get ECCNs");
    });
    return promise;
};

var getLatestRecordUpdate = function (agency = "OFAC", recordType = "ALL") {

    var promise = $.Deferred();

    promise.resolve(new Date(2022, 10, 10));

    return promise;
};


module.exports = {
    getCurrentUser: getCurrentUser,
    getCountries: getCountries,
    getLookupItems: getLookupItems,
    getRegulationsHierarchyLevel: getRegulationsHierarchyLevel,
    getCCLCategories: getCCLCategories,
    getProductGroups: getProductGroups,
    getECCNs: getECCNs,
    getLatestRecordUpdate: getLatestRecordUpdate

}

