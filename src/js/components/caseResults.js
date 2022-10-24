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
import { formatStringForDisplay } from './../util/utility';

class CaseResults {
    #gridColumns = []; 
    #resultsGrid = null;
    #detailsShown = false;
    #compareShown = false;
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
                prmLU = vmSanction.getLatestUpdate(sender.agency);
               
                prmLU.done(function (lu) {

                    sender.container.find("[name=lastUpdate]").text("Last updated " + kendo.toString(new Date(lu), "MMMM dd, yyyy"));

                });
            }

            switch (sender.agency) {
                case "OFAC":
                    sender.#gridColumns = [
                        {
                            width: "30px",
                            template: function (dataItem) {
                                return '<div class="d-flex align-items-center"><input class="k-checkbox" type="checkbox" name="chkSelectOFAC" data-sanctionid="' + dataItem.SanctionID + '"/></div>'

                            }
                         },
                        {
                            field: "RespondentName", title: "Respondent", width: "20%",
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
                                if (dataItem.LocalSource == null || dataItem.LocalSource == "") {
                                    return "<a href='" + dataItem.Source + "' target='_blank'></a>";
                                } else {
                                    return "<a href='documents" + dataItem.LocalSource + "' target='_blank'></a>";
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
                                    return "<a href='documents" + dataItem.LocalSource + "' target='_blank'></a>";
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
                                    return "<a href='documents" + dataItem.LocalSource + "' target='_blank'></a>";
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
                                    return "documents" + this.LocalSource;

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
                if (sender.#detailsShown == true) {
                    sender.hideCaseDetails();
                } else {
                    if (sender.#compareShown == true) {
                        sender.hideCaseCompare();
                    }
                }
            });

            $(".fade-bg").on("click", function () {
                if (sender.#detailsShown == true) {
                    sender.hideCaseDetails();
                } else {
                    if (sender.#compareShown == true) {
                        sender.hideCaseCompare();
                    }
                }
            });

            $("a[name=compareCases]").on("click", function (e) {
                e.preventDefault();
                sender.loadCaseComparison();
            });
            $(document).keydown(function (event) {
                if (event.keyCode == 27) {
                    if(sender.#detailsShown == true) {
                        sender.hideCaseDetails();
                    } else {
                        if (sender.#compareShown == true) {
                            sender.hideCaseCompare();
                        }
                    }
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
            if (document.getElementById("caseCompareForTabs")) {
                var ccForTabs = $("#caseCompareForTabs");
                ccForTabs.html(this.container.find("div[name=caseCompare]").html())
                this.container.children("div[name=caseCompare]").remove();

                ccForTabs.find('a[data-role=hide]').on("click", function () {
                    sender.hideCaseCompare();
                });
            }

        prm.resolve(sender.container.html());

        });
        
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
        prmS = vmSanction.getSanctionsByRegulation(regulation, this.agency);

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

getByECCN(cclCategory, productGroup, eccn) {
    var p = $.Deferred();
    var prmS;
    var sender = this;
    prmS = vmSanction.getSanctionsByECCN(cclCategory, productGroup, eccn, this.agency);
    
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
    vmSanction.getSanction(caseSummary.SanctionID, this.agency).done(function (caseDetails) {

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
                link = "documents" + caseDetails.LocalSource;
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
            if (caseDetails.SanctionedCountries.length > 0) {
                caseDetails.SanctionedCountries.forEach(function (c) {
                    if (c.Display != "N/A") {
                        elem.append(cft.replace(/COUNTRYCODE/g, c.FullCountryInfo.CountryCode.toLowerCase()).replace(/COUNTRYNAME/g, c.Display));
                    } else {
                        elem.append(mpt.replace(/ITEMVAL/g, "N/A"));
                    }
                });
            } else {
                elem.append(mpt.replace(/ITEMVAL/g, "N/A"));
            }

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

            $(".case-detail-header").css("width",  $(".case-detail-header").parent().width());
            $(".case-detail-body").css("margin-top", $(".case-detail-header").height() + 10);


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
        $("#bisNonMonetaryPenalty").text("");
        $("#bisSuspendedPenalty").text("");
        $("#bisNumberOfViolations").html("");
        $("#bisViolationTypes").html("");
        $("#bisReasonsForControl").html("");
        $("#bisTranasctionTypes").html("");
        $("#bisTranasctionValue").html("");
        $("#bisChargingVehicles").html("");
        $("#bisChargingVehicles").html("");
        $("#bisRegulatoryProvisions").html("");
        $("#bisRegulatoryRegime").html("");
        $("#bisStatutoryRegime").html("");
        $("#bisItems").html("");
        $("#bisECCNs").html("");
        $("#bisTransactionValue").html("");
        $("#bisTransactionTypes").html("");
        $("#bisDestinations").html("");
        $("#bisTranshipments").html("");
        $("span[name=bisVSD]").hide();

        kendo.ui.progress($("BODY"), true);


        //alert(caseDetails.SanctionID);
        vmSanction.getSanction(caseSummary.SanctionID, this.agency).done(function (caseDetails) {

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
                link = "documents" + caseDetails.LocalSource;
            }
            $("#bisSource").attr("href", link);
            $("#bisKeyFacts").html(util.formatStringForDisplay(caseDetails.KeyFacts));
            $("#bisSettlementAmount").html(caseDetails.SettlementAmount == null ? "Finding of violation" : kendo.toString(caseDetails.SettlementAmount, "c0"));
            switch (caseDetails.DenialOrder) {
                case 0:
                    $("#bisDenialOrder").html("No");
                    break;
                case 1:
                case 2:
                    if (caseDetails.DenialOrderTerms.length > 0) {
                        $("#bisDenialOrder").html(caseDetails.DenialOrderTerms);
                    } else {
                        $("#bisDenialOrder").html("Yes");
                    }
                    break;
                case -1:
                default: 
                    $("#bisDenialOrder").html("Unknown");
                    break;

            }
            $("#bisNonMonetaryPenalty").html(util.formatStringForDisplay(caseDetails.NonMonetaryTerms));
            $("#bisSuspendedPenalty").html(util.formatStringForDisplay(caseDetails.SuspendedPenaltyDisplay));
            $("#bisNumberOfViolations").html(caseDetails.NumberOfViolations == null ? "Unknown" : caseDetails.NumberOfViolations);

            $("#bisItems").append(mpt.replace(/ITEMVAL/g, util.formatStringForDisplay(caseDetails.Items)));
            

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

            elem = $("#bisReasonsForControl");
            if (caseDetails.ReasonsForControl.length > 0) {
                caseDetails.ReasonsForControl.forEach(function (i) {
                    elem.append(mpt.replace(/ITEMVAL/g, i.Display));
                });
            } else {
                elem.append(mpt.replace(/ITEMVAL/g, "Unknown"));
            }

            $("#bisTransactionValue").html(caseDetails.TransactionValue == null ? "Unknown" : kendo.toString(caseDetails.TransactionValue, "c0"));
            elem = $("#bisTransactionTypes");
            if (caseDetails.TransactionTypes.length > 0) {
                caseDetails.TransactionTypes.forEach(function (i) {
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

            elem = $("#bisECCNs");
            if (caseDetails.ECCNs.length > 0) {
                caseDetails.ECCNs.forEach(function (i) {
                    elem.append(mpt.replace(/ITEMVAL/g, i.ECCN));
                });
            } else {
                elem.append(mpt.replace(/ITEMVAL/g, "None listed"));
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

            $(".case-detail-header").css("width", $(".case-detail-header").parent().width());
            $(".case-detail-body").css("margin-top", $(".case-detail-header").height() + 10);

            p.resolve();
        }).always(function (xhr, status) {
            kendo.ui.progress($("BODY"), false);
        });

        return p;
    }

    #bindDDTCCaseDetails(caseSummary) {
        
    }

    showCaseCompare() {
        var caseCompare;
        if (document.getElementById("caseCompareForTabs")) {
            caseCompare = $("#caseCompareForTabs");
        } else {
            caseCompare = this.container.find("div[name=caseCompare]");
        }
        caseCompare.addClass("show");
        caseCompare.css("z-index", 999999999);
        $('.fade-bg').addClass("show");
        caseCompare.animate({
            scrollTop: 0
        }, 1000);
        this.#compareShown = true;

    }

    loadCaseComparison() {
        var sender = this;
        var checked = $("input[name=chkSelect" + this.agency + "]:checked");

        if (checked.length <= 1 || checked.length  >= 4) {
            kendo.alert("Please select 2 or 3 cases to compare.");
            return;
        }
        var selectedIDs = [];
        checked.each((idx, elem) => {
            selectedIDs.push($(elem).data("sanctionid"));
        });



        var p = jQuery.Deferred();
        kendo.ui.progress($("BODY"), true);
        vmSanction.getSanctions(selectedIDs, sender.agency).done(function (cases) {
            switch (sender.agency.toUpperCase()) {
                case "OFAC":
                    sender.#bindOFACCaseCompare(cases);

                    sender.showCaseCompare();

                    $(".case-compare-header").css("width", $(".case-compare-body").width());
                    $(".case-compare-body").css("margin-top", $(".case-compare-header").height() + 30);

            }
            
        }).always(function (xhr, status) {
            kendo.ui.progress($("BODY"), false);
            p.resolve();
        });
    }

    #bindOFACCaseCompare(cases) {
        //clear existing items
        $('#ofaccompareHeader > .compare-case-col').remove();
        $('#ofaccompareKeyFacts > .compare-case-col').remove();
        $('#ofaccompareRespondentNationality > .compare-case-col').remove();
        $('#ofaccompareIndustry > .compare-case-col').remove();
        $('#ofaccompareEnforcementDate > .compare-case-col').remove();
        $('#ofaccomparePenaltyHeader > .compare-case-col').remove();
        $('#ofaccomparePenalty > .compare-case-col').remove();
        $('#ofaccompareBasePenalty > .compare-case-col').remove();
        $('#ofaccompareMaxPenalty > .compare-case-col').remove();
        $('#ofaccompareViolationsHeader > .compare-case-col').remove();
        $('#ofaccompareNumberOfViolations > .compare-case-col').remove();
        $('#ofaccompareRegulatoryProvisions > .compare-case-col').remove();
        $('#ofaccompareRegulatoryRegimes > .compare-case-col').remove();
        $('#ofaccompareStatutoryRegimes > .compare-case-col').remove();
        $('#ofaccompareSanctionedPersons > .compare-case-col').remove();
        $('#ofaccompareGoods > .compare-case-col').remove();
        $('#ofaccompareSanctionedCountries > .compare-case-col').remove();
        $('#ofaccompareFactorsHeader > .compare-case-col').remove();
        $('#ofaccompareVSD > .compare-case-col').remove();
        $('#ofaccompareEgregious > .compare-case-col').remove();
        $('#ofaccompareKnowledgeHeader > .compare-case-col').remove();
        $('#ofaccompareLevelOfKnowledge > .compare-case-col').remove();
        $('#ofaccompareAMFactorHeader > .compare-case-col').remove();
        $('#ofaccompareAMFactors > .compare-case-col').remove();


        //get the various control templates
        var templates = new Object();
        templates.header = $("#ofaccompareHeader > .item-template").html();
        templates.KeyFacts = $("#ofaccompareKeyFacts > .item-template").html();
        templates.Nationality = $("#ofaccompareRespondentNationality > .item-template").html();
        templates.Industry = $("#ofaccompareIndustry > .item-template").html();
        templates.EnforcementDate = $("#ofaccompareEnforcementDate > .item-template").html();
        templates.PenaltyHeader = $("#ofaccomparePenaltyHeader > .item-template").html();
        templates.Penalty = $("#ofaccomparePenalty > .item-template").html();
        templates.BasePenalty = $("#ofaccompareBasePenalty > .item-template").html();
        templates.MaxPenalty = $("#ofaccompareMaxPenalty > .item-template").html();
        templates.ViolationsHeader = $("#ofaccompareViolationsHeader > .item-template").html();
        templates.NumberOfViolations = $("#ofaccompareNumberOfViolations > .item-template").html();
        templates.RegulatoryProvisions = $("#ofaccompareRegulatoryProvisions > .item-template").html();
        templates.RegulatoryRegimes = $("#ofaccompareRegulatoryRegimes > .item-template").html();
        templates.StatutoryRegimes = $("#ofaccompareStatutoryRegimes > .item-template").html();
        templates.SanctionedPersons = $("#ofaccompareSanctionedPersons > .item-template").html();
        templates.Goods = $("#ofaccompareGoods > .item-template").html();
        templates.SanctionedCountries = $("#ofaccompareSanctionedCountries > .item-template").html();
        templates.FactorsHeader = $("#ofaccompareFactorsHeader > .item-template").html();
        templates.VSD = $("#ofaccompareVSD > .item-template").html();
        templates.Egregious = $("#ofaccompareEgregious > .item-template").html();
        templates.KnowledgeHeader = $("#ofaccompareKnowledgeHeader > .item-template").html();
        templates.LevelOfKnowledge = $("#ofaccompareLevelOfKnowledge > .item-template").html();
        templates.AMFactorHeader = $("#ofaccompareAMFactorHeader > .item-template").html();
        templates.AMFactors = $("#ofaccompareAMFactors > .item-template").html();

        var displayVal;
        cases.forEach((caseDetails) => {
            //displayVal = displayVal.replace(/~ENFORCEMENT-DATE~/g, );
            //displayVal = displayVal.replace(/~INDUSTRY~/g, );

            $("#ofaccompareHeader").append(templates.header.replace(/~RESPONDENT-NAME~/g, caseDetails.CompanyName));
            $("#ofaccompareKeyFacts").append(templates.KeyFacts.replace(/~KEY-FACTS~/g, formatStringForDisplay(caseDetails.KeyFacts)));
            displayVal = "";
            caseDetails.RespondentNationalities.forEach(function (c) {
                displayVal += mft.replace(/COUNTRYCODE/g, c.FullCountryInfo.CountryCode.toLowerCase()).replace(/COUNTRYNAME/g, c.Display);
            });
            $("#ofaccompareRespondentNationality").append(templates.Nationality.replace(/~RESPONDENT-NATIONALITY~/g, displayVal));
            $("#ofaccompareEnforcementDate").append(templates.EnforcementDate.replace(/~ENFORCEMENT-DATE~/g, kendo.toString(new Date(caseDetails.EnforcementDate), "dd MMM yyyy")));
            $("#ofaccompareIndustry").append(templates.Industry.replace(/~INDUSTRY~/g, caseDetails.Industries.map(e => e.Display).join("; ")));
            $("#ofaccomparePenaltyHeader").append(templates.PenaltyHeader);
            $("#ofaccomparePenalty").append(templates.Penalty.replace(/~PENALTY~/g, caseDetails.SettlementAmount == null ? "Finding of violation" : kendo.toString(caseDetails.SettlementAmount, "c0")));
            $("#ofaccompareBasePenalty").append(templates.BasePenalty.replace(/~BASE-PENALTY~/g, caseDetails.BasePenalty == null ? "Unknown" : kendo.toString(caseDetails.BasePenalty, "c0")));
            $("#ofaccompareMaxPenalty").append(templates.MaxPenalty.replace(/~STATUTORY-MAX~/g, caseDetails.StatutoryMaximum == null ? "Unknown" : kendo.toString(caseDetails.StatutoryMaximum, "c0")));
            $("#ofaccompareViolationsHeader").append(templates.ViolationsHeader);
            $("#ofaccompareNumberOfViolations").append(templates.NumberOfViolations.replace(/~NUMBER-VIOLATIONS~/g, caseDetails.NumberOfViolations));
            displayVal = "";
            if (caseDetails.RegulatoryProvisions.length > 0) {
                caseDetails.RegulatoryProvisions.forEach(function (i) {
                    displayVal += mpt.replace(/ITEMVAL/g, i.Display);
                });
            } else {
                displayVal += mpt.replace(/ITEMVAL/g, "Unknown");
            }
            $("#ofaccompareRegulatoryProvisions").append(templates.RegulatoryProvisions.replace(/~REGULATORY-PROVISIONS~/g, displayVal));

            displayVal = "";
            if (caseDetails.RegulatoryRegimes.length > 0) {
                caseDetails.RegulatoryRegimes.forEach(function (i) {
                    displayVal += mpt.replace(/ITEMVAL/g, i.Display);
                });
            } else {
                displayVal += mpt.replace(/ITEMVAL/g, "Unknown");
            }
            $("#ofaccompareRegulatoryRegimes").append(templates.RegulatoryRegimes.replace(/~REGULATORY-REGIMES~/g, displayVal));

            displayVal = "";
            if (caseDetails.StatutoryRegimes.length > 0) {
                caseDetails.StatutoryRegimes.forEach(function (i) {
                    displayVal += mpt.replace(/ITEMVAL/g, i.Display);
                });
            } else {
                displayVal += mpt.replace(/ITEMVAL/g, "Unknown");
            }
            $("#ofaccompareStatutoryRegimes").append(templates.StatutoryRegimes.replace(/~STATUTORY-REGIMES~/g, displayVal));

            $("#ofaccompareSanctionedPersons").append(templates.SanctionedPersons.replace(/~SANCTIONED-PERSONS~/g, caseDetails.SanctionedPersons == null ? "" : caseDetails.SanctionedPersons.map(e => e.Display).join("; ")));
            $("#ofaccompareGoods").append(templates.Goods.replace(/~GOODS~/g, util.formatStringForDisplay(caseDetails.GoodsAndServices)));

            displayVal = "";
            if (caseDetails.SanctionedCountries.length > 0) {
                caseDetails.SanctionedCountries.forEach(function (c) {
                    if (c.Display != "N/A") {
                        displayVal += mft.replace(/COUNTRYCODE/g, c.FullCountryInfo.CountryCode.toLowerCase()).replace(/COUNTRYNAME/g, c.Display);
                    } else {
                        displayVal += mpt.replace(/ITEMVAL/g, "N/A");
                    }
                });
            } else {
                displayVal += mpt.replace(/ITEMVAL/g, "N/A");
            }
            $("#ofaccompareSanctionedCountries").append(templates.SanctionedCountries.replace(/~SANCTIONED-COUNTRIES~/g, displayVal));
            $("#ofaccompareFactorsHeader").append(templates.FactorsHeader);

            $("#ofaccompareVSD").append(templates.VSD);
            switch (caseDetails.VoluntaryDisclosure) {
                case -1:
                    $("#ofaccompareVSD span[name=ofaccompareVSDUnknown]:last").show();
                    break;
                case 0:
                    $("#ofaccompareVSD span[name=ofaccompareVSDNo]:last").show();
                    break;
                case 1:
                    $("#ofaccompareVSD span[name=ofaccompareVSDYes]:last").show();
                    break;
                case 2:
                    $("#ofaccompareVSD span[name=ofaccompareVSDPartial]:last").show();
                    break;
            }

            $("#ofaccompareEgregious").append(templates.Egregious);
            switch (caseDetails.EgregiousCase) {
                case -1:
                    $("#ofaccompareEgregious span[name=ofaccompareEgregiousUnknown]:last").show();
                    break;
                case 0:
                    $("#ofaccompareEgregious span[name=ofaccompareEgregiousNo]:last").show();
                    break;
                case 1:
                    $("#ofaccompareEgregious span[name=ofaccompareEgregiousYes]:last").show();
                    break;
                case 2:
                    $("#ofaccompareEgregious span[name=ofaccompareEgregiousPartial]:last").show();
                    break;
            }

            $("#ofaccompareKnowledgeHeader").append(templates.KnowledgeHeader);
            displayVal = "Unknown";
            switch (caseDetails.WillfulOrReckless) {
                case 1:
                    displayVal = "Willful and Reckless"
                case 2:
                    //willful or reckless
                    displayVal = "Willful";
                    break;
                case 3:
                    displayVal = "Reckless";
                default:
                    try {
                        caseDetails.DegreesOfKnowledge.forEach(function (d) {
                            
                            if (d.Display.toUpperCase() == "ACTUAL KNOWLEDGE") {
                                displayVal = "Actual Knowledge"
                                throw BreakException;
                            } else {
                                displayVal = "Reason to Know"

                            }
                        });
                    } catch (e) {
                    }
                    
                    break;
            }
            
            $("#ofaccompareLevelOfKnowledge").append(templates.LevelOfKnowledge.replace(/~LEVEL-OF-KNOWLEDGE~/g, mpt.replace(/ITEMVAL/g, displayVal)));

            $("#ofaccompareAMFactorHeader").append(templates.AMFactorHeader);

            displayVal = ""
            if (caseDetails.AggravatingFactors.length > 0) {
                caseDetails.AggravatingFactors.forEach(function (i) {
                    displayVal += orangeli.replace(/ITEMVAL/g, i.Display);
                });
            }
            if (caseDetails.MitigatingFactors.length > 0) {
                caseDetails.MitigatingFactors.forEach(function (i) {
                    displayVal += greenli.replace(/ITEMVAL/g, i.Display);
                });
            }
            $("#ofaccompareAMFactors").append(templates.AMFactors.replace(/~AGGMIT-FACTORS~/g, displayVal));

        });

        $("a[name=ofaccomapreKeyFactsTip]").kendoTooltip({
            autoHide: true,
            content: function (e) {
                var target = e.target; // the element for which the tooltip is shown
                return target.siblings("div[name=ofaccompareKeyFactsVal]:first").html(); // set the element text as content of the tooltip
            },
            position: "top",
            showOn: "mouseenter"
        });
    }

    hideCaseCompare() {
        var caseCompare;
        if (document.getElementById("caseCompareForTabs")) {
            caseCompare = $("#caseCompareForTabs");
        } else {
            caseCompare = this.container.find("div[name=caseCompare]");
        }
        caseCompare.removeClass("show");
        $('.fade-bg').removeClass("show");
        this.#compareShown = false;
    }
}


export default CaseResults;