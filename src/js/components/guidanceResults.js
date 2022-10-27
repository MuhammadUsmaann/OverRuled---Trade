"use strict";

var evt = require('events');


var cfg = require("../util/configuration");
var vmGuidance = require("../viewmodel/vm_guidance");


class GuidanceResults {
    
    constructor(agency = "OFAC", targetDiv = "#guidancePlaceholder") {

        this.container = $(targetDiv);
        this.agency = agency;
        this.events = new evt.EventEmitter();
        
    }

    initializeResults(includeLastUpdateLine = true) {
        var prm = jQuery.Deferred();
        if (this.container.length == 0) {
            prm.reject("No Guidance placeholder container was provided");
            return prm;
        }

        var sender = this;
        import('./../../html/common/GuidanceResults.html').then((template) => {
            sender.container.html(template.default.replace(/AGENCY/g, sender.agency));

            if (includeLastUpdateLine) {
                vmGuidance.getLatestGuidanceUpdate(sender.agency).then(function (lu) {

                    $("#guidanceLastUpdated" + sender.agency).text("Last updated " + kendo.toString(new Date(lu), "MMMM dd, yyyy"));

                });
            }
            prm.resolve(sender.container.html());
        });

        return prm;
    }

    executeSearch(searchParams) {
        var p = $.Deferred();

        kendo.ui.progress(this.container, true);

        var sender = this;
        vmGuidance.getGuidanceDocuments(searchParams, this.agency).then(function (searchResults) {

            p.resolve(searchResults);
            kendo.ui.progress(sender.container, false);

        }, function (err) {
            kendo.ui.progress(sender.container, false);
            kendo.alert("An error occurred while executing your search:<br/>" + err);
            p.reject(err);
        });


        return p;

    };

    getByRegulation(regulation) {
        var p = $.Deferred();
        kendo.ui.progress(this.container, true);

        var sender = this;
        vmGuidance.getGuidanceDocumentsByRegulation(regulation, this.agency).then(function (searchResults) {

            p.resolve(searchResults);
            kendo.ui.progress(sender.container, false);

        }, function (err) {
            kendo.ui.progress(sender.container, false);
            kendo.alert("An error occurred while executing your search:<br/>" + err);
            p.reject(err);
        });


        return p;
    };

    bindResults(guidance, targetDiv, uniqueId) {
        var p = $.Deferred();
        if (uniqueId == null) {
            uniqueID = 0;
        }

        if (targetDiv == null) {
            p.reject("No target div was provided to bind to.");
        }
        targetDiv = $(targetDiv);
        const agencyUniqueID = this.agency + uniqueId;
        if (!document.getElementById("noGuidance" + agencyUniqueID)) {
            targetDiv.append(document.getElementById("noGuidance" + this.agency + "UNIQUEID").outerHTML.replace(/UNIQUEID/g, uniqueId));
        }
        if (!document.getElementById("guidanceList" + agencyUniqueID)) {
            targetDiv.append(document.getElementById("guidanceList" + this.agency + "UNIQUEID").outerHTML.replace(/UNIQUEID/g, uniqueId));
        }
        
        if (guidance.length == 0) {
            $("#noGuidance" + this.agency + uniqueId).show();
            $("#guidanceList" + this.agency + uniqueId).hide();
        } else {
            var guidanceList = $("#guidanceList" + this.agency + uniqueId);
            $("#noGuidance" + this.agency + uniqueId).hide();
            guidanceList.show();
            guidanceList.html("");

            var guidanceTemplate = $("#guidanceItemTemplate" + this.agency).html().replace(/UNIQUEID/g, uniqueId).replace(/AGENCY/g, this.agency);
            var guidanceCard;
            var guidanceLink;
            $.each(guidance, function () {
                guidanceCard = guidanceTemplate.replace(/GUIDANCEID/g, this.GuidanceID);

                guidanceList.append(guidanceCard);
                guidanceLink = $("#guidanceLink" + this.Agency + uniqueId + "_" + this.GuidanceID);
               
                var link;
                if (!this.LocalSource || this.LocalSource == "") {
                    link = this.Source;
                } else {
                    link = "documents/guidance/" + this.Agency + "/" + this.LocalSource;
                }
                guidanceLink.prop("href", link);
                guidanceLink.text(this.Title);

            });

        }

        this.events.emit("dataBound", guidance.length);
    };
};
export default GuidanceResults;

