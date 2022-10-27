"use strict";

import crt from "./../../../html/common/CountryRiskListing.html";

var utility = require("./../../util/utility");

import HeaderFooter from "../../components/headerFooter";
import Carousel from "../../components/carousel";

import Map from "../../components/map";

var vmSanction = require("./../../viewmodel/vm_sanction");
var vmAlerts = require("./../../viewmodel/vm_alerts");
var vmReports = require("./../../viewmodel/vm_reports");



require("@progress/kendo-ui/js/kendo.dataviz.chart");

require("./../../../css/flags32-both.css");


$(document).ready(function () {
    kendo.ui.progress($("BODY"), true);
    var promises = [];

    var agency = utility.getQSValue("a");
    var pageTitle = "";
    if (agency == null) { agency = "OFAC"; }
    agency = agency.toUpperCase();
    switch (agency) {
        case "BIS":
            pageTitle = "BIS Export Controls";
            $("#mapTitle").text("Overruled Export Risk Index");
            $("#mapLink").attr("href", "heatmaps.html?a=" + agency + "&t=exportsrisk");
            break;
        case "DDTC":
            pageTitle = "DDTC Export Controls";
            $("#mapTitle").text("Overruled Export Risk Index");
            $("#mapLink").attr("href", "heatmaps.html?a=" + agency + "&t=exportsrisk");
            break;
        case "OFAC":
        default:
            pageTitle = "OFAC Sanctions";
            $("#mapTitle").text("Overruled Sanction Risk Index");
            $("#mapLink").attr("href", "heatmaps.html?a=" + agency + "&t=sanctionsrisk");
            break;
    }
    $("a[name=recentCasesLink]").attr("href", "cases.html?a=" + agency + "&e=y&ed=recent");


    var hf = new HeaderFooter(agency);
    hf.applyPageTemplate(pageTitle).done(function () {
        //make sure links, titles and labels are referencing the correct agency and that all t
        //$("[name=agencyLabel]").forEach(l => {
        //    l.text(agency + l.text());
        //});
        $("[name=agencyLabel]").text(agency);

        kendo.ui.progress($("BODY"), false);
        $("#whatIs").show();
        $(".main-content").show();
        
        kendo.ui.progress($("#mapPanel"), true);
        switch (agency) {
            case "BIS":
            case "DDTC":
                promises.push(vmReports.getExportRiskScores());
                break;
            case "OFAC":
            default:
                promises.push(vmReports.getSanctionRiskScores());
                break;
        }
        promises[0].done(function (riskLevels) {
            switch (agency) {
                case "BIS":
                case "DDTC":
                    $("#mapTitle").text("Overruled Export Risk Index");
                    var exportMap = new Map($("#worldMap"));
                    exportMap.exportWorldRiskMap(riskLevels);
                    //maps.exportRiskMap($("#worldMap"), riskLevels);
                    break;
                case "OFAC":
                default:
                    $("#mapTitle").text("Overruled Sanction Risk Index");
                    var sanctionMap = new Map($("#worldMap"));
                    sanctionMap.sanctionWorldRiskMap(riskLevels);

                    //maps.sanctionRiskMap($("#worldMap"), riskLevels);
                    break;
            }

            riskLevels.sort(function (a, b) {
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
            var ulList = $("#riskList");
            var riskLine;
            riskLevels.forEach(function (c) {
                riskLine = crt.replace(/COUNTRYCODE/g, c.CountryCode.toLowerCase()).replace(/COUNTRYNAME/g, c.CountryName).replace(/RISKTIER/g, c.RiskTier);
                ulList.append(riskLine);
            });

            $("#countrylist_search_input").on('keyup', function (e) {
                var inpt = $(this).val().toUpperCase();
                if (inpt.trim() == "") {
                    $('#riskList > li').show();

                } else {
                    var filteredRisk = riskLevels.filter(ctry => ctry.CountryName.toUpperCase().includes(inpt));
                    $('#riskList > li').hide();
                    filteredRisk.forEach(function (f) {
                        $("#riskList > li[name=li_" + f.CountryCode.toLowerCase() + "]").show();
                    });
                }
            });
            

        }).fail(function () {
            kendo.alert("An error occurred while loading the map data.");
            
            }).always(function () {
                kendo.ui.progress($("#mapPanel"), false);

            });

        kendo.ui.progress($("#recentCasePanel_desktop"), true);
        kendo.ui.progress($("#recentCasePanel_mobile"), true);

        var caseCarousel = new Carousel(document.getElementById("recentCaseCarousel_desktop"), 4000);

        switch (agency) {
            case "BIS":
                promises.push(vmSanction.getBISSanctionsRecent());
                break;
            case "DDTC":
                promises.push(vmSanction.getDDTCSanctionsRecent());
                break;
            case "OFAC":
            default:    
                promises.push(vmSanction.getOFACSanctionsRecent());
                break;
        }
        promises[1].done(function (data) {
            if (data.Results.length == 0) { return;}
            var caseItems = $("#recentCaseCarousel_desktop").children(".tb-carousel-item");
            var caseTemplate = $("#" + agency + "-actions-template").html();
            for (var i = 0; i < caseItems.length; i++) {
                var citm = $(caseItems[i]);
                citm.html(caseTemplate);

                citm.find("span[name=enforcementDate]").text(kendo.toString(new Date(data.Results[i].EnforcementDate), "dd MMM yyyy"));
                citm.find("a[name=sanctionLink]").attr("href", "./cases.html?a=" + agency + "&id=" + data.Results[i].SanctionID);
                citm.find("span[name=companyName]").text(data.Results[i].RespondentName);
                citm.find("span[name=industries]").text(data.Results[i].Industries || "Unknown Industry");
                citm.find("span[name=numberOfViolations]").text(data.Results[i].NumberOfViolations == null ? "Unknown" : data.Results[i].NumberOfViolations);
                citm.find("span[name=settlementAmount]").text(data.Results[i].SettlementAmount == null ? "Unknown" : kendo.toString(data.Results[i].SettlementAmount, "c0"));
                citm.find("span[name=targetedPersons]").text(data.Results[i].TargetedPersons == null ? "Unknown" : data.Results[i].TargetedPersons);
                citm.find("span[name=program]").text(data.Results[i].StatutoryRegimes == null ? "Unknown" : data.Results[i].StatutoryRegimes);
                citm.find("span[name=denialOrder]").text(data.Results[i].DenialOrderDisplay);

                var countryCodes = data.Results[i].RespondentCountryCodes.split("|");
                var countryNames = data.Results[i].RespondentCountryCodes.split(";");

                citm.find("div[name=respondentFlags]").addClass(countryCodes[0].trim().toLowerCase());
                citm.find("div[name=respondentFlagToolTip]").text("");

            }
            $("#recentCaseCarousel_mobile").html($("#recentCaseCarousel_desktop").html());
            var caseMobileCarousel = new Carousel(document.getElementById("recentCaseCarousel_mobile"), 4000);

        }).fail(function (e) {
			console.log(e);
			debugger;
            kendo.alert("An error occurred while loading the latest OFAC cases.");

        }).always(function () {
             kendo.ui.progress($("#recentCasePanel_desktop"), false);
            kendo.ui.progress($("#recentCasePanel_mobile"), false);

        });

        kendo.ui.progress($("#alertsCarousel_desktop"), true);
        kendo.ui.progress($("#alertsCarousel_mobile"), true);
        promises.push(vmAlerts.getCurrentNewsAlerts("trade", 3));
        promises[2].done(function (newsAlerts) {

            var alertsCarousel = new Carousel(document.getElementById("alertsCarousel_desktop"), 4500);
            var alertItems = $("#alertsCarousel_desktop").children(".tb-carousel-item");
            var alertTemplate = $("#alerts-template").html();
            for (var i = 0; i < alertItems.length; i++) {
                var aitm = $(alertItems[i]);
                aitm.html(alertTemplate);
                aitm.find("a[name=alertLink]").attr("href", newsAlerts[i].Link);
                aitm.find("span[name=alertTitle]").text(newsAlerts[i].Title);
                aitm.find("span[name=alertDate]").text(kendo.toString(new Date(newsAlerts[i].AlertDate), "MMMM d, yyyy"));

            }
            $("#alertsCarousel_mobile").html($("#alertsCarousel_desktop").html());
            var alertsMobileCarousel = new Carousel(document.getElementById("alertsCarousel_mobile"), 4500);

            kendo.ui.progress($("#alertsCarousel_desktop"), false);
            kendo.ui.progress($("#alertsCarousel_mobile"), false);
        }).fail(function () {
            kendo.alert("An error occurred while loading the current news items.");

        }).always(function () {
            kendo.ui.progress($("#alertsCarousel_desktop"), false);
            kendo.ui.progress($("#alertsCarousel_mobile"), false);

            });

        
        var legendPosition = "bottom";
        var categoryRotation = 0;
        if ($('BODY').width() < 559) {

            legendPosition = "bottom";
            categoryRotation = 45;
        }
        var penaltiesByYearLegend = $("#penaltiesByYearColors").children(".gli-color");
        $("#penaltiesByYear").kendoChart({
            dataSource: {
                model: {
                    fields: {
                        Year: { type: "date" },
                        TotalSettlementsUS: { type: "number" },
                        TotalSettlementsNonUS: { type: "number" },
                        TotalActionsUS: { type: "number" },
                        TotalActionsNonUS: { type: "number" },
                    }
                },
                transport: {
                    read: function (operation) {
                        kendo.ui.progress($("#totalPenaltiesPanel"), true);

                        var yearsToGet = $("#ddlPenaltiesYears .custom-option.selected").data("value");

                        var prmPBY;
                        switch (agency) {
                            case "BIS":
                                prmPBY = vmReports.getBISTotalPenaltyByYear(yearsToGet);
                                break;
                            case "DDTC":
                                prmPBY = vmReports.getDDTCTotalPenaltyByYear(yearsToGet);
                                break;
                            case "OFAC":
                            default:
                                prmPBY = vmReports.getOFACTotalPenaltyByYear(yearsToGet);
                                 break;
                        }
                        prmPBY.done(function (rpt) {
                            if (yearsToGet == 1) {
                                $("#penaltiesByYear").data("kendoChart").setOptions(
                                    {
                                        categoryAxis:
                                        {
                                            baseUnit: "months",
                                        }
                                    }
                                );
                            } else {
                                $("#penaltiesByYear").data("kendoChart").setOptions(
                                    {
                                        categoryAxis:
                                        {
                                            baseUnit: "years",
                                        }
                                    }
                                );
                            }
                            operation.success(rpt.Table);
                        }).fail(function () {
                            kendo.alert("An error occurred while loading penalty history.");

                        }).always(function () {
                            kendo.ui.progress($("#totalPenaltiesPanel"), false);

                        });
                    }
                }
            },
            chartArea: { background: "transparent" },
            legend: {
                position: legendPosition, 
            },
            seriesDefaults: {
                type: "column",
                stack: false
            },
            //seriesColors: colors,
            series:
                [
                    {
                        field: "TotalSettlementsUS",
                        name: "U.S. Penalties",
                        color: $(penaltiesByYearLegend[0]).css("background-color"),
                        axis: "penalties",
                        stack: true,
                        labels: {
                            visible: false,
                            background: "transparent"
                        },
                    },
                    {
                        field: "TotalSettlementsNonUS",
                        name: "non-U.S. Penalties",
                        color: $(penaltiesByYearLegend[1]).css("background-color"),
                        axis: "penalties",
                        stack: true,
                        labels: {
                            visible: false,
                            background: "transparent"
                        },
                    },
                    {
                        field: "TotalActionsUS",
                        name: "U.S. Cases",
                        color: $(penaltiesByYearLegend[2]).css("background-color"),
                        type: "line",
                        axis: "cases",
                        labels: {
                            visible: false,
                            background: "transparent",
                        },
                    },
                    {
                        field: "TotalActionsNonUS",
                        name: "non-U.S. Cases",
                        color: $(penaltiesByYearLegend[3]).css("background-color"),
                        type: "line",
                        axis: "cases",
                        labels: {
                            visible: false,
                            background: "transparent",
                            step: 2
                        },
                    },

                ],
            valueAxes: [
                {
                    name: "penalties",
                    labels: {
                        visible: true,
                        template: "#= formatLongNumberForShortDisplay(value) #",
                        step: 2
                    }
                },
                {
                    name: "cases",
                    format: "N0",
                    //visible: false
                }
            ],
            categoryAxis: {
                axisCrossingValues: [0, 32],
                field: 'Year',
                type: "date",
                baseUnit: "years",
                labels: {
                    dateFormats: {
                        years: "yyyy",
                        months: "MMM-yy"
                    },
                    rotation: categoryRotation,
                },
                majorGridLines: {
                    visible: false
                }
            },
            tooltip: {
                visible: true,
                format: "N0"
            }
        });
        $("#ddlPenaltiesYears .custom-option").on("click", function () {
            
            $("#penaltiesByYear").data("kendoChart").dataSource.read();
        });

        
        var donutColors = [];

        var industryColors = $("#industryLegend").find("div.gli-color").sort(function (a, b) {

            var aNum = $(a).data("item-number");
            var bNum = $(b).data("item-number");
            if (aNum < bNum) {
                return -1;
            } else {
                if (aNum == bNum) {
                    return 0;
                } else {
                    return 1;
                }
            }
        });
        $.each(industryColors, function () {
            donutColors.push($(this).css("background-color"));
        });

        $("#casesByIndustry").kendoChart({
            dataSource: {
                transport: {
                    read: function (operation) {
                        kendo.ui.progress($("#industriesPanel"), true);

                        var yearsToGet = $("#ddlIndustryYears .custom-option.selected").data("value");

                        var prmPBI;
                        switch (agency) {
                            case "BIS":
                                prmPBI = vmReports.getBISActionsByIndustry(yearsToGet);
                                break;
                            case "DDTC":
                                prmPBI = vmReports.getDDTCActionsByIndustry(yearsToGet);
                                break;
                            case "OFAC":
                            default:
                                prmPBI = vmReports.getOFACActionsByIndustry(yearsToGet);
                                break;
                        }
                        prmPBI.done(function (rpt) {
                            $("#industryLegend .graph-legend-text").text("");

                            $.each(rpt.Table, function (i) {
                                $("#industry" + (i + 1)).children(".graph-legend-text").text(this.Industry + " " + (this.IndustryPercent * 100).toFixed(2) + "%");
                            });

                            $(".industry-legend-container").find(".graph-legend-text:not(:empty)").each(function () {
                                $(this).parent().show();
                            });
                            $(".industry-legend-container").find(".graph-legend-text:empty").each(function () {
                                $(this).parent().hide();
                            });
                            operation.success(rpt.Table);
                        }).fail(function () {
                            kendo.alert("An error occurred while loading the cases by industry.");

                        }).always(function () {
                            kendo.ui.progress($("#industriesPanel"), false);

                        });
                    }
                }
            },
            chartArea: { background: "transparent" },
            legend: {
                position: "right",
                visible: false
            },
            seriesColors: donutColors,
            seriesDefaults: {
                type: "donut",
                startAngle: 150
            },
            //seriesColors: colors,
            series: [{
                type: "donut",
                field: "IndustryPercent",
                categoryField: "Industry",
            }],
            tooltip: {
                visible: true,
                template: "${  category }"
            }
        });


        $("#ddlIndustryYears .custom-option").on("click", function () {
            $("#casesByIndustry").data("kendoChart").dataSource.read();
        });

        


        kendo.ui.progress($("#recentCasePanel_desktop"), true);
        kendo.ui.progress($("#recentCasePanel_mobile"), true);

        //Promise.all(promises).then(function () {

        //    kendo.ui.progress($("BODY"), false);
        //});


    });
    
});
