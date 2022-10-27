"use strict";


var setItem = function(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
};


var getItem = function(key) {
    let data = window.localStorage.getItem(key);
    if (data) {
        return JSON.parse(data);
    } else {
        null;
    }
};

var removeItem = function(key) {
    let data = window.localStorage.getItem(key);
    if (data) {
        window.localStorage.removeItem(key);
    }
};


var localStorage = function() {
    window.localStorage.clear();
};

module.exports = {
    setItem: setItem,
    getItem: getItem,
    removeItem: removeItem,
    clearLocalStorage: localStorage
};