"use strict";

require("bootstrap/js/dist/collapse");

var vmSecondary = require("../viewmodel/vm_secondary");
import FaqResults from "./faqResults";

var evt = require('events');
let events = new evt.EventEmitter();

var searchKeywords;
var container;

var fResults;

class SecondaryResults {
    constructor(targetDiv = "#secondaryPlaceholder") {

        this.container = $(targetDiv);
        this.events = new evt.EventEmitter();

    }

    initializeResults(includeLastUpdateLine = true) {
        var prm = jQuery.Deferred();
        if (this.container.length == 0) {
            prm.reject("No Secondary Sanctions placeholder container was provided");
            return prm;
        }

        const sender = this;
        import('./../../html/common/SecondaryResults.html').then((template) => {
            sender.container.html(template.default);

            if (includeLastUpdateLine) {
                vmSecondary.getLatestSecondaryUpdate().then(function (lu) {
                    $("#secondaryLastUpdated").text("Last updated " + kendo.toString(new Date(lu), "MMMM dd, yyyy"));
                });

            }

            fResults = new FaqResults("OFAC", document.getElementById("faqSecondaryPlaceholder"));

            fResults.initializeResults(false).done(function () {

                prm.resolve(sender.container.html());
            });
        });

        return prm;
    }

    loadPrograms(keywords) {
        var deferred = $.Deferred();

        if (!keywords) { keywords = ""; }

        searchKeywords = keywords;

        const sender = this;
        vmSecondary.getPrograms(keywords).done(function (programs) {

            $("span[name=programCount]").text("(" + programs.length + ")");

            $("#programAccordion").html("");

            if (programs.length == 0) {
                sender.container.hide();
            } else {
                sender.container.show();
                var programTemplate = $("#programItemTemplate").html();
                var programAccordion = $("#programAccordion");
                var programCard;
                $.each(programs, function () {
                    programCard = programTemplate.replace(/PROGRAMID/g, this.ProgramID).replace(/PROGRAMNAME/g, this.Program + (this.ActiveAuthorityCount == 0 ? " (No active authorities)" : ""));

                    programAccordion.append(programCard);
                    var programhead = $("#programHead" + this.ProgramID);
                    var programbody = $("#programBody" + this.ProgramID);
                    //programhead.data("target", "#programBody" + this.ProgramID);
                    programhead.attr("data-target", "#programBody" + this.ProgramID);
                    programhead.attr("aria-controls", "#programBody" + this.ProgramID);
                    programbody.attr("aria-labelledby", "#programHead" + this.ProgramID);
                    programbody.data("programtype", this.ProgramType);
                    programbody.data("loaded", false);

                });

                programAccordion.on('show.bs.collapse', function (e) {
                    var program = $(e.target);
                    if (program.data("loaded") == false) {
                        var prmAuth;
                        kendo.ui.progress(program, true);
                        if (program.data("programtype") == "country") {
                            prmAuth = sender.loadAuthoritiesByCountry(program.data("programid"), searchKeywords);
                        } else {
                            prmAuth = sender.loadAuthoritiesByProgram(program.data("programid"), searchKeywords);
                        }

                        prmAuth.done(function (authorities) {
                            //sender.bindAuthoriesList(authorities, program.data("programid"));
                        }).fail(function () {
                            kendo.alert("An error occurred while laoding the authorities for this program.");
                        }).always(function () {
                            kendo.ui.progress(program, false);
                        });
                        program.data("loaded", true);

                    }
                });

                if (programs.length == 1) {
                    $("#programBody" + programs[0].ProgramID).collapse('show');
                }

                $("a[name=program-header").on("click", function (e) {
                    e.preventDefault();
                });
            }

            events.emit("programsDataBound", programs.length);

            deferred.resolve(programs);
        });

        return deferred;
    }

    
    loadAuthoritiesByCountry(countryCode, keywords) {
        var deferred = $.Deferred();
        const sender = this; 
        kendo.ui.progress(this.container, true);
        vmSecondary.getAuthoritiesByCountry(countryCode, keywords).done(function (authorities) {
            sender.bindAuthoritiesList(authorities, countryCode);
            $("#programBody" + countryCode).collapse('show');
            deferred.resolve(authorities);

            events.emit("authoritiesDataBound", authorities.length);
        }).fail(function () {
            kendo.alert("An error occurred while laoding the authorities for this program.");
        }).always(function () {
            kendo.ui.progress(sender.container, false);
        });

        return deferred;
    }

    loadAuthoritiesByProgram(programID, keywords) {
        var deferred = $.Deferred();
        const sender = this;
        kendo.ui.progress(this.container, true);
        vmSecondary.getAuthoritiesBySanctionID(programID, keywords).done(function (authorities) {
            sender.bindAuthoritiesList(authorities, programID);
            $("#programBody" + programID).collapse('show');

            deferred.resolve(authorities);

            events.emit("authoritiesDataBound", authorities.length);

        }).fail(function () {
            kendo.alert("An error occurred while laoding the authorities for this program.");
        }).always(function () {
            kendo.ui.progress(sender.container, false);
        });

        return deferred;
    }

    bindAuthoritiesList(authorities, programid) {
        var authoritiesTemplate = $("#authorityItemTemplate").html();
        var authorityAccordion = $("#authorityAccordion" + programid);
        authorityAccordion.html("");

        var authorityCard;
        $.each(authorities, function () {
            authorityCard = authoritiesTemplate.replace(/AUTHORITYID/g, this.AuthorityID).replace(/AUTHORITYNAME/g, this.Authority + (this.Status != 1 ? " (No longer in effect)" : "")).replace(/SOURCE/g, this.Source).replace(/PROGRAMID/g, programid);

            authorityAccordion.append(authorityCard);
            var authorityhead = $("#authorityHead" + this.AuthorityID);
            var authoritybody = $("#authorityBody" + this.AuthorityID);
            //programhead.data("target", "#programBody" + this.AuthorityID);
            authorityhead.attr("data-target", "#authorityBody" + this.AuthorityID);
            authorityhead.attr("aria-controls", "#authorityBody" + this.AuthorityID);
            authoritybody.attr("aria-labelledby", "#authorityHead" + this.AuthorityID);
            authoritybody.data("loaded", false);

            if (this.FaqCount == 0) {
                $("#faqsLink" + this.AuthorityID).addClass("hide");
            }
            $("#faqsLink" + this.AuthorityID).on("click", function (e) {
                var target = $(this);
                var authid = target.data('authorityid');
                if ($("#authorityBody" + authid).hasClass("show")) {
                    e.stopPropagation();
                }
                $("#basisLink" + authid).removeClass("hide");
                $("#basis" + authid).addClass("hide");
                target.addClass("hide");
                $("#faqs" + authid).removeClass("hide");
            });
            $("#basisLink" + this.AuthorityID).on("click", function (e) {
                var target = $(this);
                var authid = target.data('authorityid');
                if ($("#authorityBody" + authid).hasClass("show")) {
                    e.stopPropagation();
                }
                $("#faqsLink" + authid).removeClass("hide");
                $("#faqs" + authid).addClass("hide");
                target.addClass("hide");
                $("#basis" + authid).removeClass("hide");
            });
        });

        const sender = this;
        authorityAccordion.on('show.bs.collapse', function (e) {
            e.stopPropagation();

            var authority = $(e.target);
            if (authority.data("loaded") == false) {
                //var prmBasis;
                kendo.ui.progress(authority, true);
                sender.bindAuthorityDetails(authority.data("authorityid")).then(function () {
                    kendo.ui.progress(authority, false);
                });

                authority.data("loaded", true);
            }
        });

        if (authorities.length == 1) {
            $("#authorityBody" + authorities[0].AuthorityID).collapse('show');
        }

        $("a[name=program-header").on("click", function (e) {
            e.preventDefault();
        });
    }

    bindAuthorityDetails(authorityID) {

        var deferred = jQuery.Deferred();


        vmSecondary.getAuthority(authorityID).done(function (authority) {

            var basisTemplate = $("#basisItemTemplate").html();
            $.each(authority.Sections, function (section) {

                $("#basis" + authorityID).append(basisTemplate.replace(/SECTIONTITLE/g, this.Section).replace(/BASIS/g, this.Basis).replace(/KNOWLEDGEQUALFIER/g, this.KnowledgeQualifier == true ? "Yes" : this.KnowledgeQualifier == false ? "No" : "Unknown").replace(/CONSEQUENCES/g, this.Consequence));

            });

            fResults.getBySecondarySanctionAuthority(authorityID).done(function (faqs) {
                fResults.bindResults(faqs, $("#faqs" + authorityID), authorityID, true);

            });

            events.emit("authorityDataBound");

            deferred.resolve(authority);

        }).fail(function (jqXHR, textStatus, errorThrown) {
            kendo.alert("An error occurred while loading the data.<br/>" + textStatus);
            deferred.reject();

        });

        return deferred;
    }
}

export default SecondaryResults;