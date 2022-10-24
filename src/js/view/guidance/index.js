"use strict";

var utility = require("./../../util/utility");
//var templates = require("./../../util/templates");
var vmGuidance = require("./../../viewmodel/vm_guidance.js");
var vmLookups = require("./../../viewmodel/vm_lookups");

import HeaderFooter from "../../components/headerFooter";
import FaqResults from "../../components/faqResults";
import GuidanceResults from "../../components/guidanceResults";


var programID = null, categoryID = null, keyWords = "";
var agency;
var gResults;
var fResults;

$(document).ready(function () {
    keyWords = "";

    kendo.ui.progress($("BODY"), true);

    agency = utility.getQSValue("a");
    var pageTitle = "";
    if (agency == null) { agency = "OFAC"; }
    agency = agency.toUpperCase();

    switch (agency) {
        case "OFAC":
            $("#programLabel").html("Sanctions Program");
            break;
        case "DDTC":
        case "BIS":
            $("#programLabel").html("Type of Guidance");
            break;

    }
    var promises = [];
    var prmProg = jQuery.Deferred();
    promises.push(prmProg);
    var prmCat = jQuery.Deferred();
    promises.push(prmCat);
    var prmGuidance = jQuery.Deferred();
    promises.push(prmGuidance);


    var hf = new HeaderFooter(agency);
    var prmHF = hf.applyPageTemplate(agency + " Guidance", agency);
    //var prmHF = templates.loadPageTemplate(agency + " Guidance", agency);
    promises.push(prmHF);

    gResults = new GuidanceResults(agency, document.getElementById("guidancePlaceholder"));
    gResults.events.on("dataBound", function (cnt) {
        $("#guidanceCount").text("(" + cnt + ")");
    });
    var prmGR = gResults.initializeResults(true);
    promises.push(prmGR);

    fResults = new FaqResults(agency, document.getElementById("faqPlaceholder"));
    fResults.events.on("dataBound", function (cnt) {
        $("#faqCount").text("(" + cnt + ")");
    });
    var prmFR = fResults.initializeResults(true);
    promises.push(prmFR);

    prmHF.done(() => {

        hf.setLastDataUpdateDate("FAQANDGUIDANCE");
    });
    Promise.all([prmHF, prmGR, prmFR]).then(function () {
        
        vmLookups.getLookupItems("SanctionsProgram", agency + "FAQSANDGUIDANCE").done(function (data) {
            $("input[name='Guidance Category']").kendoDropDownList({
                optionLabel: "All",
                value: null,
                dataTextField: "Category",
                dataValueField: "CategoryID",
                change: function (e) {
                    categoryID = this.value();
                    loadGuidanceAndFaqs();
                }
            });

            $("input[name='Sanctions Program']").kendoDropDownList({
                optionLabel: "All",
                value: null,
                dataTextField: "Value",
                dataValueField: "ID",
                dataSource: data,
                change: function (e) {
                    var prm;
                    programID = this.value();
                    categoryID = null;
                    if (this.value() == "") {
                        prm = vmGuidance.getGuidanceCategories(null, agency);
                    } else {
                        prm = vmGuidance.getGuidanceCategories(programID, agency);
                    }
                    prm.done(function (data) {
                        
                        bindCategoryList(data);
                        loadGuidanceAndFaqs();
                    }).fail(function () {
                        kendo.alert("An error occurred while loading the guidance categories.");
                        });


                }
            });

            vmGuidance.getGuidanceCategories(null, agency).done(function (data) {

                bindCategoryList(data);
                prmCat.resolve();

                //prmGuidance.resolve();
                loadGuidanceAndFaqs().done(function (data) {
                    prmGuidance.resolve();
                }).fail(function () {
                    kendo.alert("An error occurred while loading the guidance.");
                    prmGuidance.resolve();
                    });

            }).fail(function () {
                kendo.alert("An error occurred while loading the guidance categories.");
                prmCat.resolve();
                });

            prmProg.resolve();
        }).fail(function () {
            kendo.alert("An error occurred while loading the sanctions programs.");
            prmProg.resolve();
        });
        
        $("#guidanceTabs").kendoTabStrip({
            animation: {
                open: {
                    effects: "fadeIn"
                }
            },
        });

        $("a[name=aSearchGuidance]").on("click", function (e) {
            e.preventDefault();
            keyWords = $("#searchGuidanceKeyword").val();
            //alert(keyWords);
            loadGuidanceAndFaqs();
        });
        $("input[name=guidanceKeyword]").on('keydown', function (e) {
            var keyCode = e.keyCode || e.which;
            if (keyCode == 13) {
                keyWords = $(this).val();
                loadGuidanceAndFaqs();
            }
        });



    });


    Promise.all(promises).then(function () {
        $(".main-content").show();
        kendo.ui.progress($("BODY"), false);
    });
});

function bindCategoryList(categories) {
    
    $("input[name='Guidance Category']").data("kendoDropDownList").setDataSource(categories);
    $("input[name='Guidance Category']").data("kendoDropDownList").value(null);
    categoryID = null;

    $("#categoryList").html("");
    $("#categoryList").append('<li class="list-group-item list-group-item-action active" data-category="-1">All</li>');
    
    $.each(categories, function () {
        $("#categoryList").append('<li class="list-group-item list-group-item-action" data-category="' + this.CategoryID + '">' + this.Category + '</li>');
        
    });
    $("#categoryList li.list-group-item").on("click", function (e) {
        $("#categoryList li.list-group-item").removeClass("active");
        var cat = $(this);
        cat.addClass("active");

        categoryID = cat.data("category");
        loadGuidanceAndFaqs();

    });
    

}



function loadGuidanceAndFaqs() {
    var prm = $.Deferred();

    if (categoryID < 0) { categoryID = null; }

    if (keyWords != "" && keyWords.length < 3) {
        kendo.alert("Please enter a valid search term, minimum 3 letters long.");
        p.reject(err);

    } else {
        var prmSearch = [];

        var params = new Object({
            CategoryID: categoryID,
            SanctionsProgramID: programID,
            KeyWords: keyWords
        });

        prmSearch.push(fResults.executeSearch(params));
        prmSearch[0].done(function (faqs) {
            fResults.bindResults(faqs, document.getElementById("faqPlaceholder"), 0, agency == "OFAC" ? true : false);
        });
        prmSearch.push(gResults.executeSearch(params));
        prmSearch[1].done(function (docs) {
            gResults.bindResults(docs, document.getElementById("guidancePlaceholder"), 0);
        });

        Promise.all(prmSearch).then(function () {
            $("#centerDiv").show();
            $("#centerDiv").scrollTop(0, 0);
            prm.resolve();
        });
    }


    
    return prm;
}


