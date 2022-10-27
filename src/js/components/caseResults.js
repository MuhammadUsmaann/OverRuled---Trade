"use strict";
var util = require("./../util/utility");
var _ = require("lodash");
var evt = require('events');

var vmLookups = require("./../viewmodel/vm_lookups");

var vmSanction = require("./../viewmodel/vm_sanction")

require("@progress/kendo-ui/js/kendo.grid.js");

require("./../../css/flags32-both.css");

import mft from './../../html/common/MultiFlagTemplate.html';
import cft from './../../html/common/CountryFlagTemplate.html';
import mpt from './../../html/common/MultiPanelTemplate.html';
import greenli from './../../html/common/GreenListItemTemplate.html';
import orangeli from './../../html/common/OrangeListItemTemplate.html';
import greyli from './../../html/common/GreyListItemTemplate.html';
import greybi from './../../html/common/GreyListBlockItemTemplate.html';

class CaseResults {
    #gridColumns = []; 
    #resultsGrid = null;
    #detailsShown = false;
    #sortedData = null;
    #currentRowID = null;

    constructor(agency = "OFAC", targetDiv = "#casesPlaceholder") {

        this.container = $(targetDiv);
        this.agency = agency.toUpperCase();
        this.events = new evt.EventEmitter();
        this.searchLogID = null;
        

    }

    initializeResults(includeLastUpdateLine = true) {
        
        var prm = jQuery.Deferred();
        if (this.container.length == 0) {
            prm.reject("No case placeholder container was provided");
            return prm;
        }

        var sender = this;
        import('./../../html/common/' + this.agency + 'CaseResults.html').then((html) => {
            
            sender.container.html(html.default);
            if (includeLastUpdateLine) {
                var prmLU;
                switch (sender.agency) {
                    case "OFAC":
                        prmLU = vmSanction.getOFACLatestUpdate();
                        break;
                    case "DDTC":
                        prmLU = vmSanction.getDDTCLatestUpdate();
                        break;
                    case "BIS":
                        prmLU = vmSanction.getBISLatestUpdate();
                        break;
                    default:
                        prmLU = vmSanction.getOFACLatestUpdate();
                        break;
                }
                prmLU.done(function (lu) {

                    sender.container.find("[name=lastUpdate]").text("Last updated " + kendo.toString(new Date(lu), "MMMM dd, yyyy"));

                });
            }

            switch (sender.agency) {
                case "OFAC":
                    sender.#gridColumns = [
                        {
                            field: "RespondentName", title: "Respondent", width: "20%%",
                            attributes: {
                                style: "vertical-align: middle;"
                            },
                            template: kendo.template($("#ofacRespondentColumn").html())
                        },
                        { field: "EnforcementDate", title: "Date", width: "12%", format: "{0:dd MMM yyyy}" },
                        { field: "Industries", title: "Industry", width: "12%" },
                        { field: "TargetedPersons", title: "Sanction Target", width: "15%" },
                        { field: "VoluntaryDisclosureDisplay", title: "VSD", width: "7%" },
                        { field: "EgregiousCaseDisplay", title: "Egregious", width: "9%" },
                        {
                            field: "SettlementAmount", title: "Penalty", width: "12%", template: function (dataItem) {
                                if (dataItem.SettlementAmount == null) {
                                    return "Finding of violation";
                                } else {
                                    return kendo.toString(dataItem.SettlementAmount, "c0");
                                }
                            }
                        },
                        {
                            field: "Source", title: "Source", width: "12%",
                            template: function (dataItem) {
                                if (!dataItem.LocalSource || dataItem.LocalSource == "") {
                                    return "<a href='" + dataItem.Source + "' target='_blank'></a>";
                                } else {
                                    return "<a href='documents/sanctions/ofac/" + dataItem.LocalSource + "' target='_blank'></a>";
                                }

                            }
                        },

                    ];
                    break;
                case "BIS":
                    sender.#gridColumns = [
                        {
                            field: "RespondentName", title: "Respondent", width: "20%%",
                            attributes: {
                                style: "vertical-align: middle;"
                            },
                            template: kendo.template($("#bisRespondentColumn").html())
                        },
                        { field: "EnforcementDate", title: "Date", width: "12%", format: "{0:dd MMM yyyy}" },
                        { field: "Industries", title: "Industry", width: "12%" },
                        { field: "ItemTypes", title: "Items", width: "12%" },
                        { field: "VoluntaryDisclosureDisplay", title: "VSD", width: "7%" },
                        {
                            field: "SettlementAmount", title: "Penalty", width: "12%", template: function (dataItem) {
                                if (dataItem.SettlementAmount == null) {
                                    return "Finding of violation";
                                } else {
                                    return kendo.toString(dataItem.SettlementAmount, "c0");
                                }
                            }
                        },
                        { field: "DenialOrderDisplay", title: "Denial Order", width: "9%" },
                        {
                            field: "Source", title: "Source", width: "12%",
                            template: function (dataItem) {
                                if (!dataItem.LocalSource || dataItem.LocalSource == "") {
                                    return "<a href='" + dataItem.Source + "' target='_blank'></a>";
                                } else {
                                    return "<a href='documents/sanctions/bis/" + dataItem.LocalSource + "' target='_blank'></a>";
                                }

                            }
                        },

                    ];
                    break;
                case "DDTC":
                    sender.#gridColumns = [
                        {
                            field: "RespondentName", title: "Respondent", width: "20%%",
                            attributes: {
                                style: "vertical-align: middle;"
                            },
                            template: kendo.template($("#bisRespondentColumn").html())
                        },
                        { field: "EnforcementDate", title: "Date", width: "12%", format: "{0:dd MMM yyyy}" },
                        { field: "Industries", title: "Industry", width: "12%" },
                        { field: "ItemTypes", title: "Items", width: "12%" },
                        { field: "VoluntaryDisclosureDisplay", title: "VSD", width: "7%" },
                        {
                            field: "SettlementAmount", title: "Penalty", width: "12%", template: function (dataItem) {
                                if (dataItem.SettlementAmount == null) {
                                    return "Finding of violation";
                                } else {
                                    return kendo.toString(dataItem.SettlementAmount, "c0");
                                }
                            }
                        },
                        { field: "DenialOrderDisplay", title: "Denial Order", width: "9%" },
                        {
                            field: "Source", title: "Source", width: "12%",
                            template: function (dataItem) {
                                if (!dataItem.LocalSource || dataItem.LocalSource == "") {
                                    return "<a href='" + dataItem.Source + "' target='_blank'></a>";
                                } else {
                                    return "<a href='documents/sanctions/ddtc/" + dataItem.LocalSource + "' target='_blank'></a>";
                                }

                            }
                        },

                    ];
                    break;
            }


            sender.#resultsGrid = sender.container.find("[name=caseResultsGrid]").kendoGrid({
                dataSource: {
                    transport: {
                        read: function (operation) {
                            var data = operation.data.data || [];

                            sender.events.emit("dataBound", data.Results.length);

                            operation.success(data);
                        }
                    },
                    schema: {
                        data: function (response) {
                            sender.searchLogID = response.SearchLogID;
                            return response.Results; // twitter's response is { "statuses": [ /* results */ ] }
                        },
                        total: function (response) {
                            return response.Results.length;
                        },
                        model: {
                            id: "SanctionID",
                            fields: {
                                SanctionID: { type: "number" },
                                SanctionNumber: { type: "string" },
                                SanctionType: { type: "string" },
                                EnforcementDate: { type: "date" },
                                RespondentName: { type: "string" },
                                StatutoryRegimes: { type: "string" },
                                RespondenetCountryCodes: { type: "string" },
                                RespondentNationalities: { type: "string" },
                                RegulatoryProvisions: { type: "string" },
                                NumberOfViolations: { type: "number" },
                                VoluntaryDisclosure: { type: "number" },
                                VoluntaryDisclosureDisplay: { type: "string" },
                                EgregiousCase: { type: "number" },
                                EgregiousCaseDisplay: { type: "string" },
                                SettlementAmount: { type: "number" },
                                Source: { type: "string" },
                                LocalSource: { type: "string" },

                            },
                            LocalLink: function () {
                                //return "AAAAAAAAA";
                                if (!this.LocalSource || this.LocalSource == "") {
                                    return this.Source;
                                } else {
                                    return "documents/sanctions/" + sender.agency + "/" + this.LocalSource;

                                }
                            },
                        }
                    },
                    serverPaging: false,
                    serverFilterning: false,
                    serverSorting: false,
                    sort: [
                        { field: "EnforcementDate", dir: "desc" }
                    ]
                },
                width: "100%",
                pageable: false,
                scrollable: {
                    mode: "single",
                    allowUnsort: false
                },
                selectable: "row",
                change: function (e) {

                    var selectedRows = this.select();
                    var rowData = this.dataItem(selectedRows[0]);


                    var df = sender.bindCaseDetails(rowData);


                },
                dataBound: function (e) {
                    $(e.sender.element).show();

                },
                autoBind: false,
                groupable: false,
                sortable: true,
                filterable: false,
                noRecords: true,
                columns: sender.#gridColumns
                //rowTemplate: kendo.template($("#ofacCaseRow").html())
            }).data("kendoGrid");

            sender.container.find("a.record-nav[data-role=next]").on("click", function () {
                sender.moveNextRecord();
            });

            sender.container.find("a.record-nav[data-role=prev]").on("click", function () {
                sender.movePreviousRecord();

            });

            sender.container.find('a[data-role=hide]').on("click", function () {
                sender.hideCaseDetails();
            });

            $(".fade-bg").on("click", function () {
                sender.hideCaseDetails();
            });

            $(document).keydown(function (event) {
                if (event.keyCode == 27 && sender.#detailsShown == true) {
                sender.hideCaseDetails();
            }
        });


        if (document.getElementById("caseDetailsForTabs")) {
            var cdForTabs = $("#caseDetailsForTabs");
            cdForTabs.html(this.container.find("div[name=caseDetails]").html())
            this.container.children("div[name=caseDetails]").remove();

            cdForTabs.find("a.record-nav[data-role=next]").on("click", function () {
                sender.moveNextRecord();
            });

            cdForTabs.find("a.record-nav[data-role=prev]").on("click", function () {
                sender.movePreviousRecord();

            });

            cdForTabs.find('a[data-role=hide]').on("click", function () {
                sender.hideCaseDetails();
            });
        }
        prm.resolve(sender.container.html());

        });
        
        
        //$.get("common/" + this.agency + "CaseResults.html").done(function (template) {
            
            
        //}).fail(function () {
        //    prm.reject("An error occurred loading the guidance results template");
        //});


        return prm;
    }

hideCaseDetails() {
    var caseDetails;
    if (document.getElementById("caseDetailsForTabs")) {
        caseDetails = $("#caseDetailsForTabs");
    } else {
        caseDetails = this.container.find("div[name=caseDetails]");
    }
    caseDetails.removeClass("show");
        $('.fade-bg').removeClass("show");
        this.#detailsShown = false;
    }

showCaseDetails() {
    var caseDetails;
    if (document.getElementById("caseDetailsForTabs")) {
        caseDetails = $("#caseDetailsForTabs");
    } else {
        caseDetails = this.container.find("div[name=caseDetails]");
    }
        caseDetails.addClass("show");
        caseDetails.css("z-index", 999999999);
        $('.fade-bg').addClass("show");
            this.#detailsShown = true;
            caseDetails.animate({
                scrollTop: 0
            }, 1000);
            this.#detailsShown = true;

        }

moveNextRecord(){

    var ds = this.#resultsGrid.dataSource;
    var selectedSanction = ds.get(this.#currentRowID);
    var rowCount = ds.total();

    var rowIndex = this.#sortedData.indexOf(selectedSanction);

    if (rowIndex + 1 == rowCount) {
        selectedSanction = this.#sortedData[0];
    } else {
        selectedSanction = this.#sortedData[rowIndex + 1];
    }
    this.bindCaseDetails(selectedSanction);

}

movePreviousRecord(){

    var ds = this.#resultsGrid.dataSource;
    var selectedSanction = ds.get(this.#currentRowID);

    var rowIndex = this.#sortedData.indexOf(selectedSanction);

    if (rowIndex == 0) {
        selectedSanction = this.#sortedData[ds.total() - 1];
    } else {
        selectedSanction = this.#sortedData[rowIndex - 1];
    }
    this.bindCaseDetails(selectedSanction);
}
    executeSearch(searchParams) {
        var p = $.Deferred();

        var sender = this;
        kendo.ui.progress(this.container, true);
        vmSanction.searchSanctions(searchParams, this.agency).then(function (searchResults) {
            
            kendo.ui.progress(sender.container, false);
            p.resolve(searchResults);
        }, function (err) {
            kendo.alert("An error occurred while executing your search:<br/>" + err);
            kendo.ui.progress(sender.container, false);
            p.reject(err);
        });


        return p;
    }

    getByRegulation(regulation) {
        var p = $.Deferred();
    var prmS;
    var sender = this;
    switch (this.agency) {
        case "OFAC":
            prmS = vmSanction.getOFACSanctionsByRegulation(regulation);
            break;
        case "BIS":
            prmS = vmSanction.getBISSanctionsByRegulation(regulation);
            break;
        case "DDTC":
            prmS = vmSanction.getDDTCSanctionsByRegulation(regulation);
            break;

    }
    prmS.then(function (searchResults) {

        kendo.ui.progress(sender.container, false);
        p.resolve(searchResults);
    }, function (err) {
        kendo.alert("An error occurred while executing your search:<br/>" + err);
        kendo.ui.progress(sender.container, false);
        p.reject(err);
    });


        return p;
}
    bindSearchResults(searchResults) {
        var pRead;
        var sender = this;
        pRead = sender.#resultsGrid.dataSource.read({ data: searchResults });
        $.when(pRead).then(function () {
            if (sender.#resultsGrid.dataSource.total() > 0) {
                sender.#resultsGrid.dataSource.query({ page: 1, sort: sender.#resultsGrid.dataSource.sort() });

            }
                
            var data = sender.#resultsGrid.dataSource.data();
            var sort = sender.#resultsGrid.dataSource.sort();
                var query = new kendo.data.Query(data);
                sender.#sortedData = query.sort(sort).data;
            
        }, function (err) {
            kendo.alert("An error occurred while binding your search results:<br/>" + err);
            // p.reject(err);
        });
        return pRead;
    }


bindCaseDetails(caseSummary) {
        switch (this.agency) {
            case "OFAC":
                return this.#bindOFACCaseDetails(caseSummary);
                break;
            case "DDTC":
                return this.#bindDDTCCaseDetails(caseSummary);
                break;
            case "BIS":
                return this.#bindBISCaseDetails(caseSummary);
                break;

        }

    }

    #bindOFACCaseDetails(caseSummary) {
        var sender = this;
        this.#currentRowID = caseSummary.SanctionID;
        var p = jQuery.Deferred();
        $("#ofacFlag").html("");
        $("#ofacRespondentName").html("");
        $("#ofacEnforcementDate").html("");
        $("#ofacIndustry").html("");
        $("#ofacSource").attr("href", "#");
        $("#ofacKeyFacts").html("");
        $("#ofacStatutoryMax").html("");
        $("#ofacBasePenalty").html("");
        $("#ofacSettlementAmount").html("");
        $("#ofacNumberOfViolations").html("");
        $("#ofacRegulatoryProvisions").html("");
        $("#ofacSanctionedPersons").html("");
        $("#ofacRegulatoryRegime").html("");
        $("#ofacGoodsAndServices").html("");
        $("#ofacStatutoryRegime").html("");
        $("#ofacSanctionedCountries").html("");
        $("span[name=ofacVSD]").hide();
        $("span[name=ofacEgregious]").hide();
        $("#ofacAggravatingFactors").html("");
        $("#ofacMitigatingFactors").html("");
        $("#ofacUnusedFactors").html("");

        kendo.ui.progress($("BODY"), true);

        //alert(caseDetails.SanctionID);
        vmSanction.getOFACSanction(caseSummary.SanctionID).done(function (caseDetails) {

            var elem;
            elem = $("#ofacFlag");
            caseDetails.RespondentNationalities.forEach(function (c) {
                elem.append(mft.replace(/COUNTRYCODE/g, c.FullCountryInfo.CountryCode.toLowerCase()).replace(/COUNTRYNAME/g, c.Display));
            });

            $("#ofacRespondentName").html(caseDetails.CompanyName);
            $("#ofacEnforcementDate").html(kendo.toString(new Date(caseDetails.EnforcementDate), "dd MMM yyyy"));
            $("#ofacIndustry").html(caseDetails.Industries == null ? "" : caseDetails.Industries.map(e => e.Display).join("; "));
            var link;
            if (!caseDetails.LocalSource || caseDetails.LocalSource == "") {
                link = caseDetails.Source;
            } else {
                link = "documents/sanctions/" + sender.agency + "/" + caseDetails.LocalSource;
            }
            $("#ofacSource").attr("href", link);
            $("#ofacKeyFacts").html(util.formatStringForDisplay(caseDetails.KeyFacts));
            $("#ofacSettlementAmount").html(caseDetails.SettlementAmount == null ? "Finding of violation" : kendo.toString(caseDetails.SettlementAmount, "c0"));
            $("#ofacBasePenalty").html(caseDetails.BasePenalty == null ? "Unknown" : kendo.toString(caseDetails.BasePenalty, "c0"));
            $("#ofacStatutoryMax").html(caseDetails.StatutoryMaximum == null ? "Unknown" : kendo.toString(caseDetails.StatutoryMaximum, "c0"));
            $("#ofacNumberOfViolations").html(caseDetails.NumberOfViolations);
            $("#ofacGoodsAndServices").html(util.formatStringForDisplay(caseDetails.GoodsAndServices));
            $("#ofacSanctionedPersons").text(caseDetails.SanctionedPersons == null ? "" : caseDetails.SanctionedPersons.map(e => e.Display).join("; "));
            $("#ofacKnowledge > li").addClass("level-disabled");

            elem = $("#ofacSanctionedCountries");
            caseDetails.SanctionedCountries.forEach(function (c) {
                elem.append(cft.replace(/COUNTRYCODE/g, c.FullCountryInfo.CountryCode.toLowerCase()).replace(/COUNTRYNAME/g, c.Display));
            });

            elem = $("#ofacRegulatoryProvisions");
            if (caseDetails.RegulatoryProvisions.length > 0) {
                caseDetails.RegulatoryProvisions.forEach(function (i) {
                    elem.append(mpt.replace(/ITEMVAL/g, i.Display));
                });
            } else {
                elem.append(mpt.replace(/ITEMVAL/g, "Unknown"));
            }
            elem = $("#ofacRegulatoryRegime");
            if (caseDetails.RegulatoryRegimes.length > 0) {
                caseDetails.RegulatoryRegimes.forEach(function (i) {
                    elem.append(mpt.replace(/ITEMVAL/g, i.Display));
                });
            } else {
                elem.append(mpt.replace(/ITEMVAL/g, "Unknown"));
            }

            elem = $("#ofacStatutoryRegime");
            if (caseDetails.StatutoryRegimes.length > 0) {

                caseDetails.StatutoryRegimes.forEach(function (i) {
                    elem.append(mpt.replace(/ITEMVAL/g, i.Display));
                });
            } else {
                elem.append(mpt.replace(/ITEMVAL/g, "Unknown"));
            }


            switch (caseDetails.VoluntaryDisclosure) {
                case -1:
                    $("#ofacVSDUnknown").show();
                    break;
                case 0:
                    $("#ofacVSDNo").show();
                    break;
                case 1:
                    $("#ofacVSDYes").show();
                    break;
                case 2:
                    $("#ofacVSDPartial").show();
                    break;
            }
            switch (caseDetails.EgregiousCase) {
                case -1:
                    $("#ofacEgregiousUnknown").show();
                    break;
                case 0:
                    $("#ofacEgregiousNo").show();
                    break;
                case 1:
                    $("#ofacEgregiousYes").show();
                    break;
                case 2:
                    $("#ofacEgregiousPartial").show();
                    break;
            }

            switch (caseDetails.WillfulOrReckless) {
                case 1:
                case 2:
                    //willful
                    $("#ofacKnowledge > li:not(:first)").removeClass("level-disabled");
                    break;
                default:
                    var dok = 0;
                    try {
                        caseDetails.DegreesOfKnowledge.forEach(function (d) {
                            
                            if (d.Display.toUpperCase() == "ACTUAL KNOWLEDGE") {
                                dok = 2;
                                throw BreakException;
                            } else {
                                if (d.Display.toUpperCase() == "REASON TO KNOW") {
                                    dok = 1;
                                }
                            }
                        });
                    } catch (e) {
                    }
                    switch (dok) {
                        case 0:
                            //unknownw or reckless
                            if (caseDetails.WillfulOrReckless == 3) {
                                $("#ofacKnowledge > li[name=reckless]").removeClass("level-disabled");
                                $("#ofacKnowledge > li[name=reasonToKnow]").removeClass("level-disabled");
                            } else {
                                $("#ofacKnowledge > li:first").removeClass("level-disabled");

                            }

                            break;
                        case 1:
                            //reaso to know or reckless
                            $("#ofacKnowledge > li[name=reasonToKnow]").removeClass("level-disabled");
                            if (caseDetails.WillfulOrReckless == 3) {
                                $("#ofacKnowledge > li[name=reckless]").removeClass("level-disabled");
                                $("#ofacKnowledge > li[name=reckless]").removeClass("level-disabled");
                            }
                            break;
                        case 2:
                            //Actual knowlede
                            $("#ofacKnowledge > li[name=reasonToKnow]").removeClass("level-disabled");
                            $("#ofacKnowledge > li[name=reckless]").removeClass("level-disabled");
                            break;
                    }
                    break;


            }
            elem = $("#ofacAggravatingFactors");
            if (caseDetails.AggravatingFactors.length > 0) {
                caseDetails.AggravatingFactors.forEach(function (i) {
                    elem.append(orangeli.replace(/ITEMVAL/g, i.Display));
                });
            }
            elem = $("#ofacMitigatingFactors");
            if (caseDetails.MitigatingFactors.length > 0) {
                caseDetails.MitigatingFactors.forEach(function (i) {
                    elem.append(greenli.replace(/ITEMVAL/g, i.Display));
                });
            }

            var prmFactors = [];
            var mFactors, aFactors, allFactors, usedFactors, unUsedFactors;
            prmFactors.push(vmLookups.getLookupItems("AggravatingFactor", "OFACSANCTIONS"));
            prmFactors[0].done(function (data) {
                aFactors = data.map(e => e.Value);
            });

            prmFactors.push(vmLookups.getLookupItems("MitigatingFactor", "OFACSANCTIONS"));
            prmFactors[1].done(function (data) {
                mFactors = data.map(e => e.Value);
            });

            Promise.all(prmFactors).then(function () {
                elem = $("#ofacUnusedFactors");

                usedFactors = _.union(caseDetails.AggravatingFactors.map(e => e.Display), caseDetails.MitigatingFactors.map(e => e.Display));
                allFactors = _.union(mFactors, aFactors);
                unUsedFactors = allFactors.filter((factor) => {
                    return usedFactors.indexOf(factor) === -1;
                });
                unUsedFactors.sort();
                unUsedFactors.forEach(function (i) {
                    elem.append(greybi.replace(/ITEMVAL/g, i));
                });
            });

            sender.showCaseDetails();
           

            p.resolve();
        }).always(function (xhr, status) {
            kendo.ui.progress($("BODY"), false);
        });

        return p;
    }

    #bindBISCaseDetails(caseSummary) {
        var sender = this;
        this.#currentRowID = caseSummary.SanctionID;
        var p = jQuery.Deferred();
        $("#bisFlag").html("");
        $("#bisRespondentName").html("");
        $("#bisEnforcementDate").html("");
        $("#bisIndustry").html("");
        $("#bisSource").attr("href", "#");
        $("#bisKeyFacts").html("");
        $("#bisSettlementAmount").html("");
        $("#bisDenialOrder").text("");
        $("#bisAdditionalSettlement").text("");
        $("#bisNonMonetaryPenalty").text("");
        $("#bisSuspendedPenalty").text("");
        $("#bisNumberOfViolations").html("");
        $("#bisViolationTypes").text("");
        $("#bisChargingVehicles").html("");
        $("#bisChargingVehicles").html("");
        $("#bisRegulatoryProvisions").html("");
        $("#bisRegulatoryRegime").html("");
        $("#bisStatutoryRegime").html("");
        $("#bisItems").html("");
        $("#bisDestinations").html("");
        $("#bisTranshipments").html("");
        $("span[name=bisVSD]").hide();

        kendo.ui.progress($("BODY"), true);


        //alert(caseDetails.SanctionID);
        vmSanction.getBISSanction(caseSummary.SanctionID).done(function (caseDetails) {

            var elem;
            elem = $("#bisFlag");
            caseDetails.RespondentNationalities.forEach(function (c) {
                elem.append(mft.replace(/COUNTRYCODE/g, c.FullCountryInfo.CountryCode.toLowerCase()).replace(/COUNTRYNAME/g, c.Display));
            });

            $("#bisRespondentName").html(caseDetails.Name);
            $("#bisEnforcementDate").html(kendo.toString(new Date(caseDetails.EnforcementDate), "dd MMM yyyy"));
            $("#bisIndustry").html(caseDetails.Industries == null ? "" : caseDetails.Industries.map(e => e.Display).join("; "));
            var link;
            if (!caseDetails.LocalSource || caseDetails.LocalSource == "") {
                link = caseDetails.Source;
            } else {
                link = "documents/sanctions/" + sender.agency + "/" + caseDetails.LocalSource;
            }
            $("#bisSource").attr("href", link);
            $("#bisKeyFacts").html(util.formatStringForDisplay(caseDetails.KeyFacts));
            $("#bisSettlementAmount").html(caseDetails.SettlementAmount == null ? "Finding of violation" : kendo.toString(caseDetails.SettlementAmount, "c0"));
            switch (caseDetails.DenialOrder) {
                case "0":
                    $("#bisDenialOrder").html("No");
                    break;
                case 1:
                case 2:
                    $("#bisDenialOrder").html(caseDetails.DenialOrderTerms);
                    break;
                case -1:
                    $("#bisDenialOrder").html("Unknown");
                    break;

            }
            $("#bisAdditionalSettlement").html(util.formatStringForDisplay(caseDetails.AdditionalMonetaryTerms));
            $("#bisNonMonetaryPenalty").html(util.formatStringForDisplay(caseDetails.NonMonetaryTerms));
            $("#bisSuspendedPenalty").html(util.formatStringForDisplay(caseDetails.SuspendedPenaltyDisplay));
            $("#bisNumberOfViolations").html(caseDetails.NumberOfViolations == null ? "Unknown" : caseDetails.NumberOfViolations);
            $("#bisItems").html(util.formatStringForDisplay(caseDetails.Items));

            elem = $("#bisDestinations");
            caseDetails.Destinations.forEach(function (c) {
                elem.append(cft.replace(/COUNTRYCODE/g, c.FullCountryInfo.CountryCode.toLowerCase()).replace(/COUNTRYNAME/g, c.Display));
            });

            elem = $("#bisTranshipments");
            caseDetails.Transhipments.forEach(function (c) {
                elem.append(cft.replace(/COUNTRYCODE/g, c.FullCountryInfo.CountryCode.toLowerCase()).replace(/COUNTRYNAME/g, c.Display));
            });


            elem = $("#bisViolationTypes");
            if (caseDetails.ViolationTypes.length > 0) {
                caseDetails.ViolationTypes.forEach(function (i) {
                    elem.append(mpt.replace(/ITEMVAL/g, i.Display));
                });
            } else {
                elem.append(mpt.replace(/ITEMVAL/g, "Unknown"));
            }

            elem = $("#bisChargingVehicles");
            if (caseDetails.ChargingVehicles.length > 0) {
                caseDetails.ChargingVehicles.forEach(function (i) {
                    elem.append(mpt.replace(/ITEMVAL/g, i.Display));
                });
            } else {
                elem.append(mpt.replace(/ITEMVAL/g, "Unknown"));
            }

            elem = $("#bisRegulatoryProvisions");
            if (caseDetails.RegulatoryProvisions.length > 0) {
                caseDetails.RegulatoryProvisions.forEach(function (i) {
                    elem.append(mpt.replace(/ITEMVAL/g, i.Display));
                });
            } else {
                elem.append(mpt.replace(/ITEMVAL/g, "Unknown"));
            }

            elem = $("#bisRegulatoryRegime");
            if (caseDetails.RegulatoryRegimes.length > 0) {
                caseDetails.RegulatoryRegimes.forEach(function (i) {
                    elem.append(mpt.replace(/ITEMVAL/g, i.Display));
                });
            } else {
                elem.append(mpt.replace(/ITEMVAL/g, "Unknown"));
            }

            elem = $("#bisStatutoryRegime");
            if (caseDetails.StatutoryRegimes.length > 0) {

                caseDetails.StatutoryRegimes.forEach(function (i) {
                    elem.append(mpt.replace(/ITEMVAL/g, i.Display));
                });
            } else {
                elem.append(mpt.replace(/ITEMVAL/g, "Unknown"));
            }


            switch (caseDetails.VoluntaryDisclosure) {
                case -1:
                    $("#bisVSDUnknown").show();
                    break;
                case 0:
                    $("#bisVSDNo").show();
                    break;
                case 1:
                    $("#bisVSDYes").show();
                    break;
                case 2:
                    $("#bisVSDPartial").show();
                    break;
            }

            sender.showCaseDetails();


            p.resolve();
        }).always(function (xhr, status) {
            kendo.ui.progress($("BODY"), false);
        });

        return p;
    }

    #bindDDTCCaseDetails(caseSummary) {
        
    }
}

export default CaseResults;