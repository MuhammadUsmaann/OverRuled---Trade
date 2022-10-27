"use strict";
var utility = require("./../../util/utility");

import HeaderFooter from "../../components/headerFooter";
import FaqResults from "../../components/faqResults";
import GuidanceResults from "../../components/guidanceResults";
import CaseResults from "../../components/caseResults";

var caseResults;
var gResults;
var fResults;

var agency;

$(document).ready(function () {
    load();

});

async function load() {
    kendo.ui.progress($("BODY"), true);
    agency = utility.getQSValue("a");
    if (agency == null) { agency = "OFAC"; }
    agency = agency.toUpperCase();

    
    var mainPromises = [];
    var hf = new HeaderFooter(agency);
    var prmHF = hf.applyPageTemplate("Search " + agency, agency);
    mainPromises.push(prmHF);

    caseResults = new CaseResults(agency, document.getElementById("casePlaceholder"));
    var prmSR = caseResults.initializeResults(true);
    mainPromises.push(prmSR);
    caseResults.events.on("dataBound", function (cnt) {
        $("#caseCount").text("(" + cnt + ")");
    });

    gResults = new GuidanceResults(agency, document.getElementById("guidancePlaceholder"));
    gResults.events.on("dataBound", function (cnt) {
        $("#guidanceCount").text("(" + cnt + ")");
    });
    var prmGR = gResults.initializeResults(false);
    mainPromises.push(prmGR);

    fResults = new FaqResults(agency, document.getElementById("faqPlaceholder"));
    fResults.events.on("dataBound", function (cnt) {
        $("#faqCount").text("(" + cnt + ")");
    });
    var prmFR = fResults.initializeResults(false);
    mainPromises.push(prmFR);



    Promise.all(mainPromises).then(function () {

        $("#caseDetails").append($("#" + agency.toLowerCase() + "CaseDetails"));

        $("#resultsTabs").kendoTabStrip({
            animation: {
                open: {
                    effects: "fadeIn"
                }
            },
        });

        $(".main-content").show();

        kendo.ui.progress($("BODY"), false);
        if (utility.getQSValue("e") == "y" && utility.getQSValue("k") != "") {
            $("#searchOverruledKeyword").val(utility.getQSValue("k"));

            executeSearch();
        }

        $("a[name=aKeyword]").on("click", function (e) {
            e.preventDefault();
            executeSearch();
        });
        $("#searchOverruledKeyword").on('keydown', function (e) {
            var keyCode = e.keyCode || e.which;
            if (keyCode == 13) {
                executeSearch();
            }
        });

    });
}
function executeSearch() {
    var p = $.Deferred();
    var searchPromises = [];
    var searchparams = new Object();

    if ($("#searchOverruledKeyword").val().length <= 3) {
        kendo.alert("Please provide valid search criteria.");
        p.resolve("invalid criteria");
        return p;
    }
    searchparams.KeyWords = $("#searchOverruledKeyword").val();

    kendo.ui.progress($("#docs"), true);
    kendo.ui.progress($("#faqs"), true);
    kendo.ui.progress($("#cases"), true);

    searchPromises.push(gResults.executeSearch(searchparams));
    searchPromises.push(fResults.executeSearch(searchparams));
    searchPromises.push(caseResults.executeSearch(searchparams));

    $("#results").show();

    searchPromises[0].done(function (docs) {
        gResults.bindResults(docs, document.getElementById("guidancePlaceholder"), 0);
    });

    searchPromises[1].done(function (faqs) {
        fResults.bindResults(faqs, document.getElementById("faqPlaceholder"), 0, agency == "OFAC" ? true : false);
    });

    searchPromises[2].done(function (cases) {
        caseResults.bindSearchResults(cases);
        
    });

    Promise.all(searchPromises).then(function () {
        $("#results").scrollTop(0, 0);

        kendo.ui.progress($("#docs"), false);
        kendo.ui.progress($("#faqs"), false);
        kendo.ui.progress($("#cases"), false);
        //kendo.ui.progress($("BODY"), false);
        p.resolve();
    },
        function (err) {

            kendo.ui.progress($("#docs"), false);
            kendo.ui.progress($("#faqs"), false);
            kendo.ui.progress($("#cases"), false);
            p.reject(err);
        }
    );

    return p;
}
