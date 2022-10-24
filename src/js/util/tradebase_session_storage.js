"use strict";


var setItem = function(key, value) {
    window.sessionStorage.setItem(key, JSON.stringify(value));
};


var getItem = function(key) {
    let data = window.sessionStorage.getItem(key);
    if (data && data != "undefined") {
        return JSON.parse(data);
    } else {
        null;
    }
};

var removeItem = function(key) {
    let data = window.sessionStorage.getItem(key);
    if (data) {
        window.sessionStorage.removeItem(key);
    }
};


var clearSessionStorage = function() {
    window.sessionStorage.clear();
};

module.exports = {
    setItem: setItem,
    getItem: getItem,
    removeItem: removeItem,
    clearSessionStorage: clearSessionStorage
};