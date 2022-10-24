"use strict";
require("bootstrap/js/dist/collapse");
var vmGuidance = require("../viewmodel/vm_guidance");
var evt = require('events');

var errmodel = require("./../viewmodel/vm_exception_logger.js");

class FaqResults {
    constructor(agency = "OFAC", targetDiv = "#faqPlaceholder") {

        this.container = $(targetDiv);
        this.agency = agency;
        this.events = new evt.EventEmitter();

    }

    initializeResults(includeLastUpdateLine = true) {
        var prm = jQuery.Deferred();
        if (this.container.length == 0) {
            prm.reject("No FAQ placeholder container was provided");
            return prm;
        }

        var sender = this;
        import('./../../html/common/FAQResults.html').then((template) => {
            sender.container.html(template.default.replace(/AGENCY/g, sender.agency));

            if (includeLastUpdateLine) {
                vmGuidance.getLatestGuidanceUpdate(sender.agency).then(function (lu) {

                    $("#faqsLastUpdated" + sender.agency).text("Last updated " + kendo.toString(new Date(lu), "MMMM dd, yyyy"));

                });
            }
            prm.resolve(sender.container.html());
        });

        return prm;
    }

    executeSearch(searchParams) {
        kendo.ui.progress(this.container, true);
        var p = $.Deferred();

        const sender = this;
        vmGuidance.getFAQListings(searchParams, this.agency).then(function (searchResults) {

            kendo.ui.progress(sender.container, false);
            p.resolve(searchResults);
        }, function (err) {

            kendo.ui.progress(sender.container, true);
            kendo.alert("An error occurred while getting the related FAQs:<br/>" + err);
            p.reject(err);
        });
        return p;
    };

    getByRegulation(regulation) {
        var p = $.Deferred();

        kendo.ui.progress(this.container, true);
        const sender = this;
        vmGuidance.getFAQListingsByRegulation(regulation, this.agency).then(function (searchResults) {
            p.resolve(searchResults);
            kendo.ui.progress(sender.container, false);
        }, function (err) {
            kendo.ui.progress(sender.container, false);
            kendo.alert("An error occurred while executing your search:<br/>" + err);
            p.reject(err);
        });


        return p;
    };

    getByECCN(cclCategory, productGroup, eccn) {
        var p = $.Deferred();

        kendo.ui.progress(this.container, true);
        const sender = this;
        vmGuidance.getFAQListingsByECCN(cclCategory, productGroup, eccn, this.agency).then(function (searchResults) {
            p.resolve(searchResults);
            kendo.ui.progress(sender.container, false);
        }, function (err) {
            kendo.ui.progress(sender.container, false);
            kendo.alert("An error occurred while executing your search:<br/>" + err);
            p.reject(err);
        });


        return p;
    };

    getBySecondarySanctionAuthority(authorityID) {

        kendo.ui.progress(this.container, true);
        var p = $.Deferred();

        const sender  = this;
        vmGuidance.getFAQListingsBySecondaryAuthority(authorityID).then(function (searchResults) {

            kendo.ui.progress(sender.container, false);
            p.resolve(searchResults);
        }, function (err) {

            kendo.ui.progress(sender.container, true);
            kendo.alert("An error occurred while getting the related FAQs:<br/>" + err);
            p.reject(err);
        });


        return p;
    };

    bindResults(faqs, targetDiv, uniqueId, showFaqNumbers = false) {
        var p = $.Deferred();
        if (targetDiv == null) {
            p.reject("No target was provided to bind to.");
        }
        targetDiv = $(targetDiv);

        const agencyUniqueID = this.agency + uniqueId;
        //if (!document.getElementById("noFaqs" + agencyUniqueID)){
        //    targetDiv.append(document.getElementById("noFaqs" + this.agency + "UNIQUEID").outerHTML.replace(/UNIQUEID/g, uniqueId));
        //}
        if (!document.getElementById("faqAccordionWrapper" + agencyUniqueID)){
            targetDiv.append(document.getElementById("faqAccordionWrapper" + this.agency + "UNIQUEID").outerHTML.replace(/UNIQUEID/g, uniqueId));
        }
        
        if (!uniqueId) { uniqueId = 0; }

        var targetAccordion = $("#faqAccordion" + this.agency + uniqueId);
        targetAccordion.html("");

        var noFaqs = targetDiv.children("div[name=noFaqs]");
        if (faqs.length == 0) {
            noFaqs.show();
            targetAccordion.hide();
        } else {
            noFaqs.hide();
            $("#faqAccordionWrapper" + this.agency + uniqueId).show();

            var faqTemplate = $("#faqTemplate").html().replace(/UNIQUEID/g, uniqueId);
            var faqCard;
            const sender = this;
            $.each(faqs, function () {
                try {
                    faqCard = faqTemplate.replace(/FAQID/g, this.FaqID);

                    targetAccordion.append(faqCard);
                    var faqhead = $("#faqHead" + this.Agency + uniqueId + "_" + this.FaqID);
                    var faqbody = $("#faqBody" + this.Agency + uniqueId + "_" + this.FaqID);
                    var head;
                    if (showFaqNumbers) {
                        head = this.FaqID + ". " + this.Question;
                    } else {
                        head = this.Question;
                    }
                    faqhead.find("[name=faq-header]").text(head);
                    faqbody.data("faqid", this.FaqID);
                    faqbody.data("loaded") == false;
                } catch (error) {
                    console.error(error);
                    errmodel.logException(error, "BindFaqResults");
                    kendo.alert("An error occurred while binding the FAQ results");
                }

                
            });

            targetAccordion.show();

            targetAccordion.on('show.bs.collapse', function (e) {
                e.stopPropagation();

                var faqbody = $(e.target);
                if (faqbody.data("loaded") == false) {

                    kendo.ui.progress(faqbody, true);
                    vmGuidance.getFAQ(faqbody.data("faqid"), sender.agency).done(function (data) {
                        var fb = faqbody.children("[name=faq-body]");
                        fb.html(data.Answer);
                        if (data.FaqDate != null) {
                            fb.append("[" + kendo.toString(new Date(data.FaqDate), "d") + "]");
                        }
                        faqbody.data("loaded", true);
                    }).always(function () {

                        kendo.ui.progress(faqbody, false);

                    });
                }
            });

            $("a[name=faq-header").on("click", function (e) {
                e.preventDefault();
            });
        }

        this.events.emit("dataBound", faqs.length);
    }
}

export default FaqResults;

