var alertsmodel = require("./../model/alerts_model.js");
var errmodel = require("./../viewmodel/vm_exception_logger.js");


var getCurrentNewsAlerts = function (section, numberOfItems) {
    var deferred = $.Deferred();
    alertsmodel.getCurrentNewsAlerts(section, numberOfItems).then(function (data) {

        deferred.resolve(data);
    }, function (err) {
        try {
            if (!err.responseJSON || ( err.responseJSON.errorLogged && err.responseJSON.errorLogged == false)) {
                erralertsmodel.logException(err.statusText, "GetCurrentNewsAlerts");
            }
        } catch (ex) {
            //do nothing
        }
        deferred.reject(err.statusText);
    });
    return deferred.promise();
};

module.exports = {
    getCurrentNewsAlerts: getCurrentNewsAlerts,
}