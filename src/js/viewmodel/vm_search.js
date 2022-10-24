"use strict";
var searchmodel = require("./../model/search_model.js");
var errmodel = require("./../viewmodel/vm_exception_logger.js");
var session = require("./../util/tradebase_session_storage");
//var $ = require("jquery");


var getRecentSearches = function () {
    var deferred = $.Deferred();
    var c = 1;

    if (session.getItem("RecentSearches") != null) {
        deferred.resolve(session.getItem("RecentSearches"));
    } else {
        searchmodel.getRecentSearches().then(function (data) {
            session.setItem("RecentSearches", data);
            deferred.resolve(data);
        }, function (err) {
            try {
                if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                    errmodel.logException(err.statusText, "GetRecentSearches");
                }
            } catch (ex) {
                //do nothing
            }
            deferred.reject(err.statusText);
        });
    }
    
    return deferred.promise();
};

var getSavedSearches = function () {
    var deferred = $.Deferred();
    searchmodel.getSavedSearches().then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "GetSavedSearches");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred;
};

var getSavedSearch = function (searchID) {
    var deferred = $.Deferred();
    searchmodel.getSavedSearch(searchID).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "GetSavedSearches");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred;
};

var saveSearch = function (saveOptions) {
    var deferred = $.Deferred();
    searchmodel.saveSearch(saveOptions).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || (err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                errmodel.logException(err.statusText, "SaveSearch");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred;
};


var addRecentSearch = function addRecentSearch(searchTerm) {
     if (session.getItem("RecentSearches") == null) {
        session.setItem("RecentSearches", []);
    }
    var searches = session.getItem("RecentSearches");
    if (searches.indexOf(searchTerm) == -1) {
        searches.push(searchTerm);
        session.setItem("RecentSearches", searches);
    }
}
module.exports = {
    saveSearch: saveSearch,
    getSavedSearches: getSavedSearches,
    getSavedSearch: getSavedSearch,
    getRecentSearches: getRecentSearches,
    addRecentSearch: addRecentSearch,
};