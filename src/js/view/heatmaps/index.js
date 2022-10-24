"use strict";

var utility = require("./../../util/utility");
var vmReports = require("./../../viewmodel/vm_reports");

import crt from "./../../../html/common/CountryRiskListing.html";
import HeaderFooter from "../../components/headerFooter";
import Map from "../../components/map";

require("./../../../css/flags32-both.css");

var sanctionRiskMap;
var exportRiskMap;
var combinedRiskMap;
var ofacHeatMap;

var mapTabs;
$(document).ready(function () {
    kendo.ui.progress($("BODY"), true);
    var agency = utility.getQSValue("a");
    var pageTitle = "";
    if (agency == null) { agency = "OFAC"; }
    agency = agency.toUpperCase();

    var hf = new HeaderFooter(agency);
    var prmMap = jQuery.Deferred();

    hf.applyPageTemplate("Trade Heat Maps").then(function () {

        hf.setLastDataUpdateDate("ALL");

        var map;
        mapTabs = $("#mapTabs").kendoTabStrip({
            animation: {
                open: {
                    effects: "fadeIn"
                }
            },
            show: function (e) {
                var tabPanel = $(e.contentElement);
                var mapElement;
                if (e.item.classList.contains("sanctionsrisk") && !sanctionRiskMap) {
                    kendo.ui.progress(tabPanel, true);
                    vmReports.getSanctionRiskScores().done(function (countryList) {
                        mapElement = $("#sanctionHeatMap");
                        sanctionRiskMap = new Map(mapElement);
                        prmMap = sanctionRiskMap.sanctionWorldRiskMap(countryList);
                        
                        //mapElement.height(mapElement.parent().height() - 30);
                        $("#sanctionlist_panel").height(mapElement.height());

                        bindCountryRiskListings("sanction", countryList);
                    }).fail(function () {
                        kendo.alert("An error occurred while loading the sanctions risk map data.");
                    }).always(function () {
                        kendo.ui.progress(tabPanel, false);
                    });
                } else {
                    if (e.item.classList.contains("exportsrisk") && !exportRiskMap) {
                        kendo.ui.progress(tabPanel, true);
                        vmReports.getExportRiskScores().done(function (countryList) {
                            mapElement = $("#exportHeatMap");

                            exportRiskMap = new Map(mapElement);
                            prmMap = exportRiskMap.exportWorldRiskMap(countryList).then((mapObj) => {
                                map = mapObj;
                            });
                            //mapElement.height(mapElement.parent().height() - 30);
                            $("#exportlist_panel").height(mapElement.height());

                            bindCountryRiskListings("export", countryList);
                        }).fail(function () {
                            kendo.alert("An error occurred while loading the exports risk map data.");
                        }).always(function () {
                            kendo.ui.progress(tabPanel, false);
                        });
                    } else {
                        if (e.item.classList.contains("combinedrisk") && !combinedRiskMap) {
                            kendo.ui.progress(tabPanel, true);
                            vmReports.getOverallRiskScores().done(function (countryList) {
                                mapElement = $("#combinedHeatMap");
                                combinedRiskMap = new Map(mapElement);
                                prmMap = combinedRiskMap.overallWorldRiskMap(countryList).then((mapObj) => {
                                    map = mapObj;
                                });
                                $("#combinedlist_panel").height(mapElement.height());

                                bindCountryRiskListings("combined", countryList);
                            }).fail(function () {
                                kendo.alert("An error occurred while loading the combined risk map data.");
                            }).always(function () {
                                kendo.ui.progress(tabPanel, false);
                            });
                        }
                    }
                }


            }
        });

        $("span[name=tooltipLink]").kendoTooltip({
        autoHide: false,
        content: kendo.template($("#tooltip-template").html()),
        position: "top",
        showOn: "click",
        show: function (e) { 
            var targetID = this.element.attr("id");
            var tooltip = $("#" + targetID + "_tb_active");
            tooltip.find("[name=tooltipContent]").html($("#" + targetID + "Content").html());

            var close = tooltip.find(".k-tooltip-button");
            close.remove(".k-tooltip-button");
           // close.css("display", "flex");
            //close.css("align-items", "center");
            tooltip.find("span[name=close-wrapper]").append(close);

        }
    });
   
        var mapTabStrip = mapTabs.data("kendoTabStrip");
        mapTabs.parent().height("100%");

        //$(window).resize(function () {
        //    resizeTabs();
        //});

        var defaultTab = utility.getQSValue("t");
    
        if (!defaultTab) {
            defaultTab = "sanctionsrisk";
        } else {
            defaultTab = defaultTab.toLowerCase();
        }
        switch (defaultTab) {
            case "exportsrisk":
            case "export":
            case "exportrisk":
            case "bis":
            case "ddtc":
            case "exports":
                defaultTab = "exportsrisk";
                break;
            case "sanctionsrisk":
            case "sanction":
            case "sanctionrisk":
            case "ofac":
            default:
                defaultTab = "sanctionsrisk";
                break;
        }

    

        $(".main-content").show();

        

        var totalHeight = $(window).height();
        totalHeight += $("#footer").height();
        $("#header").children().each(function () {
            totalHeight += $(this).height();
        });

        $(".map").height(totalHeight - $("#mapTabs").offset().top - $(".k-tabstrip-items-wrapper").height() - $("#disclaimer").height() -100);
            
        mapTabStrip.select($("." + defaultTab));
    }).then(function () {



        kendo.ui.progress($("BODY"), false);
    });


    $("#rightSidebar").on('shown.bs.collapse', function () {
        if ($('BODY').width() > 992) {

            //$('#exportHeatMap').resize();
        }
    });

    $("#rightSidebar").on('hidden.bs.collapse', function () {
        if ($('BODY').width() > 992) {

            $(".center-div").show(0, function () {
                //$('#exportHeatMap').resize();
            });
        }
    });

    $("#showMap").on("click", function () {
        $("#rightSidebar").collapse("hide");
    });

});

function bindCountryRiskListings(type, countryList) {
    countryList.sort(function (a, b) {
        var sort = b.RiskTier - a.RiskTier;
        if (sort == 0) {
            if (a.CountryName < b.CountryName) {
                sort = -1;
            }
            if (a.CountryName > b.CountryName) {
                sort = 1;
            }
        }
        return sort;
    });
    var ulList = $("#" + type + "RiskList");
    countryList.forEach(function (c) {
        ulList.append(crt.replace(/COUNTRYCODE/g, c.CountryCode.toLowerCase()).replace(/COUNTRYNAME/g, c.CountryName).replace(/RISKTIER/g, c.RiskTier));
    });

    $("#" + type + "list_search_input").on('keyup', function (e) {
        var inpt = $(this).val().toUpperCase();
        if (inpt.trim() == "") {
            $('#' + type + 'RiskList > li').show();

        } else {
            var filteredRisk = countryList.filter(ctry => ctry.CountryName.toUpperCase().includes(inpt));
            $('#' + type + 'RiskList > li').hide();
            filteredRisk.forEach(function (f) {
                $("#" + type + "RiskList > li[name=li_" + f.CountryCode.toLowerCase() + "]").show();
            });
        }
    });
}
//function getSanctions(countryCode) {
//    kendo.ui.progress($("BODY"), true);


//    vmSanction.getOFACSanctionsByCountryCode(countryCode).done(function (data) {
        
//        $("#region").data("kendoDropDownList").value(countryCode);
//        caseResults.bindResultsGrid(data).done(function () {

//            //$("#rightSidebar-buttons").show();
//            $('#exportHeatMap').resize();
//            $("#rightSidebar").collapse("show");

//            if ($('BODY').width() >= 992) {
//                $("#rightSidebar-buttons").show();
//            }
//        });
//        sanctionRiskMap.updateSize();
//        kendo.ui.progress($("BODY"), false);
//    }).fail(function (e) {
//        kendo.alert("An error occurred while loading the data.<br/>" + e.statusText);

//        kendo.ui.progress($("BODY"), false);
//    });
//}

var expandContentDivs = function (divs) {
    var visibleDiv = divs.filter(":visible");
    divs.height(mapTabs.innerHeight()
        - mapTabs.children("").outerHeight()
        - parseFloat(visibleDiv.css("padding-top"))
        - parseFloat(visibleDiv.css("padding-bottom"))
        - parseFloat(visibleDiv.css("border-top-width"))
        - parseFloat(visibleDiv.css("border-bottom-width"))
        - parseFloat(visibleDiv.css("margin-bottom")));
    // all of the above padding/margin/border calculations can be replaced by a single hard-coded number for improved performance
};

var resizeTabs = function () {
    expandContentDivs(mapTabs.children(".k-content"));
};

var resizeMaps = function () {
   
    //exportRiskMap.updateSize();
};
