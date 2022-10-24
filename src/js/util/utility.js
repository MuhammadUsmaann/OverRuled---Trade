"use strict";

var getQSValue = function(key) {
    var qsParams = [
        {
            key: key,
            value: ""
        }
    ];

    try {
        var qsValues = _getQueryStringParamValues(qsParams);

        var qsObj = _.find(qsValues, function (qs) {
            return qs.key == key;
        });

        if (qsObj) {
            return qsObj.value;
        } else {
            return "";
        }    
    }
    catch (err) {
        var match = RegExp('[?&]' + key + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }
    
};

var _getQueryStringParamValues = function (qsKeyValueArray) {
    var urlParams = new URLSearchParams(window.location.search);
    _.forEach(qsKeyValueArray, function (qsKeyValue) {
        qsKeyValue.value = urlParams.get(qsKeyValue.key);
    });
    return qsKeyValueArray;

};

var setDateText = function (control, value, dateFormat) {
    if (value == null || value == "") {
        $(control).text = "";
    } else {
        $(control).text(kendo.toString(new Date(value), dateFormat));
    }
};

var formatStringForDisplay = function (str, replaceCarriageReturnWithCharacter = "<br/>") {

    if (str == null) {
        return "";
    } else {
        return kendo.htmlEncode(str).replace(/\r\n/g, replaceCarriageReturnWithCharacter).replace(/\n/g, replaceCarriageReturnWithCharacter).replace(/\r/g, replaceCarriageReturnWithCharacter);
    }
};

var formatLongNumberForShortDisplay = function (value) {
    if (value == 0) {
        return 0;
    }
    else {
        // for testing
        //value = Math.floor(Math.random()*1001);

        // hundreds
        if (value <= 999) {
            return value;
        }
        // thousands
        else if (value >= 1000 && value <= 999999) {
            return (value / 1000) + 'K';
        }
        // millions
        else if (value >= 1000000 && value <= 999999999) {
            return (value / 1000000) + 'M';
        }
        // billions
        else if (value >= 1000000000 && value <= 999999999999) {
            return (value / 1000000000) + 'B';
        }
        else
            return value;
    }
};

function loadjscssfile(filename, filetype) {
    if (filetype == "js") { //if filename is a external JavaScript file
        var fileref = document.createElement('script')
        fileref.setAttribute("type", "text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype == "css") { //if filename is an external CSS file
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

module.exports = {
    getQSValue: getQSValue,
    setDateText: setDateText,
    formatStringForDisplay: formatStringForDisplay,
    formatLongNumberForShortDisplay: formatLongNumberForShortDisplay,
    loadjscssfile: loadjscssfile
};