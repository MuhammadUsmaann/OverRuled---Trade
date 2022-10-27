"use strict";

var vmRegulations = require("./../../viewmodel/vm_lookups");
var vmGuidance = require("./../../viewmodel/vm_guidance");
var utility = require("./../../util/utility");

import HeaderFooter from "../../components/headerFooter";
import FaqResults from "../../components/faqResults";
import GuidanceResults from "../../components/guidanceResults";
import CaseResults from "../../components/caseResults";

require("@progress/kendo-ui/js/kendo.treeview");
require("@progress/kendo-ui/js/kendo.dropdowntree");


var agency;
var caseResults;
var gResults;
var fResults;

$(document).ready(function () {
    load();

});

async function load() {
    
    kendo.ui.progress($("BODY"), true);
    agency = utility.getQSValue("a");
    if (agency == null) { agency = "OFAC"; }
    agency = agency.toUpperCase();
    
    var promises = [];
    var hf = new HeaderFooter(agency);
    var prmHF = hf.applyPageTemplate(agency + " Regulatory Insights", agency);
    prmHF.done(function () {

        caseResults = new CaseResults(agency, document.getElementById("casePlaceholder"));
        var prmSR = caseResults.initializeResults(false);
        promises.push(prmSR);
        caseResults.events.on("dataBound", function (cnt) {
            $("#caseCount").text("(" + cnt + ")");
        });

        gResults = new GuidanceResults(agency, document.getElementById("guidancePlaceholder"));

        var prmGR = gResults.initializeResults(false);
        promises.push(prmFR);

        gResults.events.on("dataBound", function (cnt) {
            $("#guidanceCount").text("(" + cnt + ")");
        });
        fResults = new FaqResults(agency, document.getElementById("faqPlaceholder"));
        fResults.events.on("dataBound", function (cnt) {
            $("#faqCount").text("(" + cnt + ")");
        });
        var prmFR = fResults.initializeResults(false);
        promises.push(prmFR);
        
        kendo.ui.progress($("BODY"), true);
        var regulationsDS = new kendo.data.HierarchicalDataSource({
            transport: {
                read: function (options) {
                    var regID;
                    if (options.data.ID) {
                        regID = options.data.ID;
                    } else {
                        regID = null;
                    }
                    kendo.ui.progress($("#leftSidebar"), true);
                    var prmRegs = vmRegulations.getRegulations(agency, regID);
                    prmRegs.done(function (data) {

                        options.success(data);
                        kendo.ui.progress($("#leftSidebar"), false);
                    }).fail(function () {
                        kendo.ui.progress($("#leftSidebar"), false);
                        kendo.alert("An error occurred while loading the regulations.");
                    });
                }
            },
            schema: {
                model: {
                    id: "ID",
                    displayName: function () {
                        return this.Value;
                    },
                    hasChildren: "HasChildren"
                }
            }
        });

        $("#regulations").kendoTreeView({
            template: "#: item.displayName() #",
            dataSource: regulationsDS,
            loadOnDemand: true,
            dataValueField: "ID",
            dataTextField: "Value",
            select: function (e) {
                var node = e.node;
                var treeview = $("#regulations").data("kendoTreeView");
                var dataItem = treeview.dataItem(node);
                loadDataByRegulation(dataItem);

            }
        });

        Promise.all([prmSR, prmGR, prmFR]).then(function () {
            kendo.ui.progress($("BODY"), false);

            
            $("#resultsTabs").kendoTabStrip({
                animation: {
                    open: {
                        effects: "fadeIn"
                    }
                },
            });

        });

        $("#regulationTabs").kendoTabStrip({
            animation: {
                open: {
                    effects: "fadeIn"
                }
            },
        });
    });

    promises.push(prmHF);

    Promise.all(promises).then(function () {
        $(".main-content").show();
        
        kendo.ui.progress($("BODY"), false);
    });
}


async function loadDataByRegulation(reg) {
    if (reg == "" || reg == null) {
        return;
    }
    kendo.ui.progress($("#centerDiv"), true);
    var insightPromises = [];

    $("#regulationLabel").addClass("d-lg-block");
    $("#regulation").text(reg.Value);

    insightPromises.push(gResults.getByRegulation(reg.ID));
    insightPromises.push(fResults.getByRegulation(reg.ID));
    insightPromises.push(caseResults.getByRegulation(reg.ID));


    insightPromises[0].done(function (docs) {
        gResults.bindResults(docs, document.getElementById("guidancePlaceholder"), 0);
    });
    insightPromises[1].done(function (faqs) {
        fResults.bindResults(faqs, document.getElementById("faqPlaceholder"), 0, agency == "OFAC" ? true : false);
    });
    insightPromises[2].done(function (cases) {
        caseResults.bindSearchResults(cases);
    });

    Promise.all(insightPromises).then(function () {

        $("#regulationTabs").show();
        $("#centerDiv").scrollTop(0);
        kendo.ui.progress($("#centerDiv"), false);
    }, function (err) {
        kendo.ui.progress($("#centerDiv"), false);

    });
}


