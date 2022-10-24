"use strict";
var utility = require("./../../util/utility");
var vmSanction = require("./../../viewmodel/vm_sanction");


import HeaderFooter from "../../components/headerFooter";
import CaseResults from "../../components/caseResults";
import CaseParameters from "../../components/caseParameters";



$(document).ready(function () {
    load();
});

var caseResults;
var caseParameters;

async function load() {
    kendo.ui.progress($("BODY"), true);

    var agency = utility.getQSValue("a");
    var pageTitle = "";
    if (agency == null) { agency = "OFAC"; }
    agency = agency.toUpperCase();

    //let params = await import("../" + agency.toLowerCase() + "cases/caseParameters");
    //let results = await import("../" + agency.toLowerCase() + "cases/caseResults");
    
    var mainPromises = [];
    var hf = new HeaderFooter(agency);
    var prmHF = hf.applyPageTemplate(agency + " Enforcement Cases", agency);
    mainPromises.push(prmHF);

    //var prmSP = templates.loadCaseParametersTemplate(agency, document.getElementById("searchParameters"));
    //mainPromises.push(prmSP);
    
    //var prmSR = templates.loadCaseResultsTemplate(agency, document.getElementById("resultsDiv"));
    //mainPromises.push(prmSR);
    caseParameters = new CaseParameters(agency, document.getElementById("searchParameters"));
    var prmSP = caseParameters.initializeParameters();
    mainPromises.push(prmSP);

    caseResults = new CaseResults(agency, document.getElementById("resultsDiv"));
    var prmSR = caseResults.initializeResults(true);
    mainPromises.push(prmSR);

    prmHF.done(function () {
        hf.setLastDataUpdateDate("SANCTION");

        $("#leftSidebar").collapse("show");

        $("a[name=modifyCaseFilters]").on("click", function (e) {
            e.preventDefault();
            $("#centerDiv").hide();
            $("#leftSidebar").collapse("show");
        });
    });
    

    prmSP.done(function () {
        $("#searchParameters").show();
        caseParameters.events.on("searchExecuted", function () {
            executeSearch().then(function () {
                kendo.ui.progress($("BODY"), false);
            }).fail(function (err) {
                kendo.ui.progress($("BODY"), false);
            });
        });
    });
   

    Promise.all(mainPromises)
        .then(function () {

            $(".main-content").show();

            kendo.ui.progress($("BODY"), false);


            $("[data-role=slider]").resize();
            if (utility.getQSValue("e") == "y" && utility.getQSValue("k")) {
                caseParameters.SearchParameters.KeyWords = utility.getQSValue("k");
                caseParameters.bindSearchParameters();

                kendo.ui.progress($("BODY"), true);
                executeSearch().then(function () {
                    kendo.ui.progress($("BODY"), false);
                }).fail(function (err) {
                    kendo.ui.progress($("BODY"), false);
                });
            } else {
                var sanctionID = utility.getQSValue("id");
                if (sanctionID) {
                    var s = new Object({ "SanctionID": sanctionID });
                    caseResults.bindCaseDetails(s).done(function () {
                        $("#centerDiv").show();
                        $("#centerDiv").scrollTop(0, 0);
                        if ($('BODY').width() < 992) {
                            $("#leftSidebar").collapse("hide");
                        }
                    });

                } else {
                    if (utility.getQSValue("e") == "y" && utility.getQSValue("ed").toLowerCase() == "recent") {
                        caseParameters.SearchParameters.EnforcementDateSelection = -6;
                        caseParameters.bindSearchParameters();
                        kendo.ui.progress($("BODY"), true);
                        executeSearch().then(function () {
                            kendo.ui.progress($("BODY"), false);
                        }).fail(function (err) {
                            kendo.ui.progress($("BODY"), false);
                        });
                    }
                }
            }
        });


    $("#executeSearch").on("click", function () {
       executeSearch().then(function () {
        //    setTimeout(() => {
        //        document.querySelector('#ofacCaseResults').querySelectorAll('tr').forEach(ab => {
        //            ab.onclick = () => {
        //                document.querySelector('.sliding-case-details').style.visibility = 'visible'
        //                document.querySelector('.fade-bg').style.visibility = 'visible'
        //            }
        //        })
        //    }, 1000);

        //    document.querySelector('#btn-case-detail-hide').onclick = () => {
        //        document.querySelector('.sliding-case-details').style.visibility = 'hidden'
        //        document.querySelector('.fade-bg').style.visibility = 'hidden'
        //    }
        //}).fail(function (err) {
        });
    });

    $("#saveSearch").on("click", function () {
        var ddSS = $("#savedSearches").data("kendoDropDownList");
        if (ddSS.value() == null || ddSS.value() == "") {
            $("#saveAs").hide();
            $("#SavedSearchID").val("");
            $("#SearchName").val("");
        } else {
            $("#saveAs").show();
            $("#SavedSearchID").val(ddSS.value());
            $("#SearchName").val(ddSS.text());
        }

        $("#sidebar-left-main").slideToggle(500);
        $("#sidebar-left-save-search").slideToggle(500);
    });

    $("#saveChange").on("click", function () {
        var saveOptions = new Object();
        saveOptions.SavedSearchID = $("#SavedSearchID").val();
        saveSearch(saveOptions);
    });

    $("#saveAs").on("click", function () {
        var saveOptions = new Object();
        saveOptions.SavedSearchID = 0;
        saveSearch(saveOptions);
    });

    $("#cancelSave").on("click", function () {

        $("#SearchName").val("");
        $("#sidebar-left-main").slideToggle(500);
        $("#sidebar-left-save-search").slideToggle(500);
    });

    $("#clearSearch").on("click", function () {
        caseParameters.clearSearchParameters();

    });
}

function executeSearch() {
    var p = $.Deferred();
    var searchparams = caseParameters.getSearchParameters();
    
    if (!caseParameters.isValidCriteria(searchparams)) {
        kendo.alert("Please provide at least 1 search criteria to continue.");
        p.reject("invalid criteria");
        return p;
    } 

    $("#centerDiv").show();
    var prmSearch = caseResults.executeSearch(searchparams);
    $.when(prmSearch).then(function (results) {
        caseResults.bindSearchResults(results);

        $("#centerDiv").scrollTop(0, 0);
        if ($('BODY').width() < 992) {
            $("#leftSidebar").collapse("hide");
        }
        p.resolve(results.SearchLogID);
    },
        function (err) {
            p.reject(err);
        }
    );

    return p;
}

function saveSearch(saveOptions) {

    if ($("#SearchName").val().trim() == "") {
        kendo.alert("Please provide a name for the search.");
        return;
    }
    kendo.ui.progress($("BODY"), true);

    var pSearch = executeSearch();

    $.when(pSearch).then(function (logID) {

        saveOptions.SearchName = $("#SearchName").val();
        saveOptions.BasedOnSearchLogID = logID;

        var pSave = caseParameters.saveSearch(saveOptions);

        $.when(pSave).done(function (data) {
            if (saveOptions.SavedSearchID == 0) {
                saveOptions.SavedSearchID = data.SavedSearchID;

            }

            caseParameters.reloadSavedSearches(saveOptions.SavedSearchID, saveOptions.SearchName).done(function () {

                $("#sidebar-left-main").slideToggle(500);
                $("#sidebar-left-save-search").slideToggle(500);
            });
        }).fail(function (err) {
            kendo.alert("An error occurred while saving the search parameters.<br/>" + err);
        }).always(function () {
            kendo.ui.progress($("BODY"), false);
        });
    }).fail(function (err) {
        kendo.ui.progress($("BODY"), false);
    });

   
}
