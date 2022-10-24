"use strict";
var cfg = require("./../util/configuration.js");

var getRecentSearches = function () {
    var uri = `./rsc/Search/Searches.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data.Recent);
    }).fail(function () {
        promise.reject("Unable to get Actions by Induxtry");
    });
    return promise;
};

var getSavedSearches = function () {
    var uri = `./rsc/Search/Searches.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data.SavedList);
    }).fail(function () {
        promise.reject("Unable to get Actions by Induxtry");
    });
    return promise;
};

var getSavedSearch = function (searchid) {
    var uri = `./rsc/Search/Searches.json`;

    var promise = $.Deferred();
    $.get(uri).done(function (data) {
        promise.resolve(data.SavedSearches.find(l => l.SavedSearchID == searchid));
    }).fail(function () {
        promise.reject("Unable to get Actions by Induxtry");
    });
    return promise;
};

var saveSearch = function (saveOptions) {

    var promise = $.Deferred();

    promise.resolve();
    return promise;
};

module.exports = {
    getRecentSearches: getRecentSearches,
    getSavedSearches: getSavedSearches,
    getSavedSearch: getSavedSearch,
    saveSearch: saveSearch
}