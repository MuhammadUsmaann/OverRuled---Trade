"use strict";

var guidancemodel = require("./../model/guidance_model.js");
var errmodel = require("./../viewmodel/vm_exception_logger.js");
var vmSearch = require("./vm_search");

var getFAQ = function (faqID, agency) {
    var deferred = $.Deferred();
    guidancemodel.getFAQ(faqID, agency).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "GetFAQ");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getFAQs = function (programID, categoryID, keywords, agency) {
    var deferred = $.Deferred();
    guidancemodel.getFAQs(programID, categoryID, keywords, agency).then(function (data) {
        if (keywords.length != 0) {
            vmSearch.addRecentSearch(keywords);
        }
        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "GetFAQs");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getFAQListings = function (searchParams, agency) {
    var deferred = $.Deferred();
    guidancemodel.getFAQListings(searchParams, agency).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "GetFAQListings");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getGuidanceDocuments = function (searchParams, agency) {
    var deferred = $.Deferred();
    guidancemodel.getGuidanceDocuments(searchParams, agency).then(function (data) {
        if (searchParams.KeyWords && searchParams.KeyWords.length != 0) {
            vmSearch.addRecentSearch(searchParams.KeyWords);
        }
        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getGuidanceDocuments");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getGuidanceDocumentsByRegulation = function (regulation, agency) {
    var deferred = $.Deferred();
    guidancemodel.getGuidanceDocumentsByRegulation(regulation, agency).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getGuidanceDocumentsByRegulation");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getGuidanceDocumentsByECCN = function (cclCategory, productGroup, eccn, agency) {
    var deferred = $.Deferred();
    guidancemodel.getGuidanceDocumentsByECCN(cclCategory, productGroup, eccn, agency).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getGuidanceDocumentsByRegulation");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getGuidanceCategories = function (programID, agency) {
    var deferred = $.Deferred();
    guidancemodel.getGuidanceCategories(programID, agency).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getGuidanceCategories");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getFAQListingsByCategory = function (categoryid, agency) {
    var deferred = $.Deferred();
    guidancemodel.getFAQListingsByCategory(categoryid, agency).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getFAQListingsByCategory");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getFAQListingsBySecondaryAuthority = function (authorityid) {
    var deferred = $.Deferred();
    guidancemodel.getFAQListingsBySecondaryAuthority(authorityid).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getFAQListingsBySecondaryAuthority");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getFAQListingsByRegulation = function (regulation, agency) {
    var deferred = $.Deferred();
    guidancemodel.getFAQListingsByRegulation(regulation, agency).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getFAQListingsByRegulation");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getFAQListingsByECCN = function (cclCategory, productGroup, eccn, agency) {
    var deferred = $.Deferred();
    guidancemodel.getFAQListingsByECCN(cclCategory, productGroup, eccn, agency).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getFAQListingsByRegulation");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

var getLatestGuidanceUpdate = function (agency) {
    var deferred = $.Deferred();
        guidancemodel.getLatestGuidanceUpdate(agency).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getLatestGuidanceUpdate");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred;
}

var getLatestFaqUpdate = function (agency) {
    var deferred = $.Deferred();
    guidancemodel.getLatestFaqUpdate(agency).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "getLatestGuidanceUpdate");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred;
}

module.exports = {
    getFAQ: getFAQ,
    getFAQListings: getFAQListings,
    getGuidanceCategories: getGuidanceCategories,
    getFAQListingsByCategory: getFAQListingsByCategory,
    getFAQListingsBySecondaryAuthority: getFAQListingsBySecondaryAuthority,
    getFAQListingsByRegulation: getFAQListingsByRegulation,
    getFAQListingsByECCN: getFAQListingsByECCN,
    getGuidanceDocuments: getGuidanceDocuments,
    getGuidanceDocumentsByRegulation: getGuidanceDocumentsByRegulation,
    getGuidanceDocumentsByECCN: getGuidanceDocumentsByECCN,
    getLatestGuidanceUpdate: getLatestGuidanceUpdate,
    getLatestFaqUpdate: getLatestFaqUpdate
}