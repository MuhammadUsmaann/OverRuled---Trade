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
var expandedNode;

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
        hf.setLastDataUpdateDate("ALL");

        hf.setLastDataUpdateDate("ALL");
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
                    var parentID;
                    if (options.data.ID) {
                        parentID = options.data.ID;
                    } else {
                        parentID = null;
                    }
                    kendo.ui.progress($("#leftSidebar"), true);
                    var prmRegs;

                    if (parentID == null) {
                        prmRegs = vmRegulations.getRegulations(agency, parentID);
                        prmRegs.done(function (data) {
                            var itemInserted = false;
                            var ecc = { ID: -1,
                                    Value: "Export Control Classifiications",
                                    ObjectType: "ControlClassification",
                                    HasChildren: true
                                };
                            for (var idx = 0; idx < data.length - 1; idx++) {
                                //debugger;
                                if (data[idx].Value.localeCompare(ecc.Value) < 0 &&
                                    data[idx + 1].Value.localeCompare(ecc.Value) >= 0) {
                                    data.splice(idx + 1, 0, ecc);
                                    itemInserted = true;
                                    break;
                                }
                            }
                            if (!itemInserted) {
                                data.push(ecc);
                            }
                            options.success(data);

                            kendo.ui.progress($("#leftSidebar"), false);

                        }).fail(function () {
                            kendo.ui.progress($("#leftSidebar"), false);
                            kendo.alert("An error occurred while loading the regulations.");
                        });
                    } else {
                        var ObjectType;
                        if (expandedNode != null) {
                            var treeview = $("#regulations").data("kendoTreeView");
                            var dataItem = treeview.dataItem(expandedNode);
                            ObjectType = dataItem.ObjectType;
                        }
                        switch (ObjectType) {
                            case "ControlClassification":
                                prmRegs = vmRegulations.getCCLCategories(agency);
                                break;
                            case "CCLCategory":
                                prmRegs = vmRegulations.getProductGroups(agency, parentID);
                                break;
                            case "ProductGroup":
                                console.log("Parent: " + parentID);
                                prmRegs = vmRegulations.getECCNs(agency, parentID.substring(0, 1), parentID.substring(1, 2));

                                break;
                            case "Regulation":
                            default:
                                prmRegs = vmRegulations.getRegulations(agency, parentID);
                                break;
                        }
                        prmRegs.done(function (data) {
                           
                            options.success(data);

                            kendo.ui.progress($("#leftSidebar"), false);

                        }).fail(function () {
                            kendo.ui.progress($("#leftSidebar"), false);
                            kendo.alert("An error occurred while loading the regulations.");
                        });
                    }
                    expandedNode = null;
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
                var parent = this.parent(node);
                //var treeview = $("#regulations").data("kendoTreeView");
                //var dataItem = this.dataItem(node);

                loadDataByRegulation(this.dataItem(node), this.dataItem(parent));

            },
            expand: function (e) {
                expandedNode = e.node;
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


async function loadDataByRegulation(reg, parent) {
    if (reg == "" || reg == null) {
        return;
    }
    kendo.ui.progress($("#centerDiv"), true);
    var insightPromises = [];

    
    switch (reg.ObjectType) {
        case "Regulation":
            insightPromises.push(gResults.getByRegulation(reg.ID));
            insightPromises.push(fResults.getByRegulation(reg.ID));
            insightPromises.push(caseResults.getByRegulation(reg.ID));

            break;
        case "CCLCategory":
            insightPromises.push(gResults.getByECCN(reg.ID));
            insightPromises.push(fResults.getByECCN(reg.ID));
            insightPromises.push(caseResults.getByECCN(reg.ID));

            break;
        case "ProductGroup":
            insightPromises.push(gResults.getByECCN(reg.ID.substring(0, 1), reg.ID.substring(1, 2)));
            insightPromises.push(fResults.getByECCN(reg.ID.substring(0, 1), reg.ID.substring(1, 2)));
            insightPromises.push(caseResults.getByECCN(reg.ID.substring(0, 1), reg.ID.substring(1, 2)));
            break;
        case "ECCN":
            insightPromises.push(gResults.getByECCN(reg.ID.substring(0, 1), reg.ID.substring(1, 2), reg.ID));
            insightPromises.push(fResults.getByECCN(reg.ID.substring(0, 1), reg.ID.substring(1, 2), reg.ID));
            insightPromises.push(caseResults.getByECCN(reg.ID.substring(0, 1), reg.ID.substring(1, 2), reg.ID));
            break;
        default:
            return;
    }
    
    $("#regulationLabel").addClass("d-lg-block");
    $("#regulation").text(reg.Value);

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


