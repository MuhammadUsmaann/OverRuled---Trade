"use strict";

var utilitymodel = require("./../model/utility_model");
var session = require("./../util/tradebase_session_storage");

var getCurrentUser = function () {

    var deferred = $.Deferred();

    if (session.getItem("UserName") != null) {
        deferred.resolve(session.getItem("UserName"));
    } else {
        utilitymodel.getCurrentUser().done(function (data) {
            session.setItem("UserName", data);
            deferred.resolve(data);
        }).fail(function (err) {
            deferred.reject(err);
            session.setItem("UserName", "");
            });
    }
    return deferred.promise();
};


module.exports = {
    getCurrentUser: getCurrentUser
}