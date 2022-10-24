"use strict";
var vmSearch = require("./../viewmodel/vm_search");
var vmLookups = require("./../viewmodel/vm_lookups");
var vmAuth = require("./../util/auth");
var evt = require('events');

require("@progress/kendo-ui/js/kendo.dropdowntree");
require("bootstrap/js/dist/collapse");

class CaseParameters {
    #savedSearches = null;
    #paramsHTML = null;

    SearchParameters = {
        EnforcementDateSelection: null,
        EnforcementDateBegin: null,
        EnforcementDateEnd: null,
        NumberOfViolationsLow: null,
        NumberOfViolationsHigh: null,
        PenaltySettlementAmountLow: null,
        PenaltySettlementAmountHigh: null,
        Nationality: [],
        RegulatoryProvision: [],
        Program: [],
        Industry: [],
        ViolationType: [],
        ReasonForControl: [],
        VoluntaryDisclosure: [],
        DenialOrder: [],
        EgregiousCase: [],
        AggravatingFactor: [],
        MitigatingFactor: [],
        RespondentNationality: [],
        Destination: [],
        Transhipment: [],
        Sanctioned126Country: [],
        KeyWords: ""
    };

    constructor(agency = "OFAC", targetDiv = "#casesPlaceholder") {

        this.container = $(targetDiv);
        this.agency = agency.toUpperCase();
        this.events = new evt.EventEmitter();
    }


    initializeParameters() {
        var prm = jQuery.Deferred();
        if (this.container.length == 0) {
            prm.reject("No parameters    placeholder container was provided");
            return prm;
        }
        var sender = this;
        import('./../../html/common/' + this.agency + 'CaseParameters.html').then((html) => {
            sender.container.html(html.default);

            $(".dateEntry").kendoDatePicker(
                {
                    max: new Date()
                }
            );
            $(".moneyEntry").kendoNumericTextBox({
                format: "c0",
                decimals: 0,
                min: 0,
                step: 1000
            });

            $(".numberEntry").kendoNumericTextBox({
                format: "#",
                min: 0,
                step: 10
            });

            var controlPromises = [];
            var prmControl;
            vmAuth.getCurrentUser().done(function (un) {
                if (un != "") {
                    controlPromises.push(vmSearch.getSavedSearches());
                    controlPromises[controlPromises.length - 1].done(function (data) {
                        sender.#savedSearches = $("#savedSearches").kendoDropDownList({
                            dataTextField: "Value",
                            dataValueField: "Key",
                            optionLabel: "Select...",
                            value: null,
                            text: "",
                            dataSource: data,
                            change: function (e) {
                                    var ss = this.value();
                                    if (ss) {

                                        var pLoad = vmSearch.getSavedSearch(ss);
                                        sender.clearSearchParameters();

                                        $.when(pLoad).done(function (data) {
                                            console.log("Got saved");
                                            sender.#savedSearches.value(ss);

                                            sender.SearchParameters = JSON.parse(data.Criteria);

                                            sender.bindSearchParameters();

                                        })
                                            .fail(function (jqXHR, textStatus, errorThrown) {
                                                kendo.ui.progress($("BODY"), false);
                                                //requestFail(jqXHR);

                                            });
                                    } else {
                                        sender.clearSearchParameters();

                                        $("#paramAccordion .collapse").collapse("hide");

                                    }
                            },
                        }).data("kendoDropDownList");
                    });
                } else {
                    $("#savedSearches").closest("div.form-group").hide();
                    $("#saveSearch").remove();
                }
            });

            if (document.getElementById("regulatoryProvision")) {
                var regulationsDS = new kendo.data.HierarchicalDataSource({
                    transport: {
                        read: function (options) {
                            var regID;
                            if (options.data.ID) {
                                regID = options.data.ID;
                            } else {
                                regID = null;
                            }
                            var prmRegs = vmLookups.getRegulations(sender.agency + "SANCTIONS", regID);
                            prmRegs.done(function (data) {

                                options.success(data);
                            }).fail(function () {
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
                var rp = $("#regulatoryProvision").kendoDropDownTree({
                    placeholder: "Select all that apply...",
                    template: "#: item.displayName() #",
                    dataSource: regulationsDS,
                    dataValueField: "ID",
                    dataTextField: "Value",
                    loadOnDemand: true,
                    checkboxes: true,
                    autoClose: false,
                    autoWidth: true,
                }).data("kendoDropDownTree");

                $("#rpCollapse").on("shown.bs.collapse", function () {
                    rp.close();
                });

            }

            if (document.getElementById("program")) {
                controlPromises.push(vmLookups.getLookupItems("Program", this.agency + "SANCTIONS"));
                controlPromises[controlPromises.length - 1].done(function (data) {
                    $("#program").kendoMultiSelect({
                        index: 0,
                        autoClose: false,
                        dataTextField: "Value",
                        dataValueField: "ID",
                        dataSource: data
                    }).data("kendoMultiSelect");
                });

            }

            if (document.getElementById("industry")) {
                controlPromises.push(vmLookups.getLookupItems("Industry", this.agency + "SANCTIONS"));
                controlPromises[controlPromises.length - 1].done(function (data) {
                    $("#industry").kendoMultiSelect({
                        index: 0,
                        autoClose: false,
                        dataTextField: "Value",
                        dataValueField: "ID",
                        dataSource: data
                    }).data("kendoMultiSelect");
                });
            }

            if (document.getElementById("aggravatingFactor")) {
                controlPromises.push(vmLookups.getLookupItems("AggravatingFactor", this.agency + "SANCTIONS"));
                controlPromises[controlPromises.length - 1].done(function (data) {
                    $("#aggravatingFactor").kendoMultiSelect({
                        index: 0,
                        autoClose: false,
                        dataTextField: "Value",
                        dataValueField: "ID",
                        dataSource: data
                    }).data("kendoMultiSelect");
                });
            }

            if (document.getElementById("mitigatingFactor")) {
                controlPromises.push(vmLookups.getLookupItems("MitigatingFactor", this.agency + "SANCTIONS"));
                controlPromises[controlPromises.length - 1].done(function (data) {
                    $("#mitigatingFactor").kendoMultiSelect({
                        index: 0,
                        autoClose: false,
                        dataTextField: "Value",
                        dataValueField: "ID",
                        dataSource: data
                    }).data("kendoMultiSelect");
                });
            }

            if (document.getElementById("respondentNationality")) {
                controlPromises.push(vmLookups.getCountries(this.agency + "RESPONDENT"));
                controlPromises[controlPromises.length - 1].done(function (data) {
                    $("#respondentNationality").kendoMultiSelect({
                        index: 0,
                        autoClose: false,
                        dataTextField: "CountryName",
                        dataValueField: "ID",
                        dataSource: data,
                    }).data("kendoMultiSelect");
                });
            }

            if (document.getElementById("destination")) {
                controlPromises.push(vmLookups.getCountries(this.agency + "DESTINATION"));
                controlPromises[controlPromises.length - 1].done(function (data) {
                    $("#destination").kendoMultiSelect({
                        index: 0,
                        autoClose: false,
                        dataTextField: "CountryName",
                        dataValueField: "ID",
                        dataSource: data,
                    }).data("kendoMultiSelect");
                });
            }

            if (document.getElementById("transhipment")) {
                controlPromises.push(vmLookups.getCountries(this.agency + "TRANSHIPMENT"));
                controlPromises[controlPromises.length - 1].done(function (data) {
                    $("#transhipment").kendoMultiSelect({
                        index: 0,
                        autoClose: false,
                        dataTextField: "CountryName",
                        dataValueField: "ID",
                        dataSource: data,
                    }).data("kendoMultiSelect");
                });
            }

            if (document.getElementById("country126")) {
                controlPromises.push(vmLookups.getCountries(this.agency + "SANCTIONED126"));
                controlPromises[controlPromises.length - 1].done(function (data) {
                    $("#country126").kendoMultiSelect({
                        index: 0,
                        autoClose: false,
                        dataTextField: "CountryName",
                        dataValueField: "ID",
                        dataSource: data,
                    }).data("kendoMultiSelect");
                });
            }

            if (document.getElementById("egregiousCase")) {
                $("#egregiousCase").kendoMultiSelect({
                    index: 0,
                    autoClose: false,
                    dataTextField: "Value",
                    dataValueField: "ID",
                    dataSource: [
                        { ID: 1, Value: "Yes" },
                        { ID: 0, Value: "No" },
                        { ID: -1, Value: "Unknown" }
                    ]
                }).data("kendoMultiSelect")
            }

            if (document.getElementById("voluntaryDisclosure")) {
                $("#voluntaryDisclosure").kendoMultiSelect({
                    index: 0,
                    autoClose: false,
                    dataTextField: "Value",
                    dataValueField: "ID",
                    dataSource: [
                        { ID: 1, Value: "Yes" },
                        { ID: 0, Value: "No" },
                        { ID: -1, Value: "Unknown" }
                    ]
                }).data("kendoMultiSelect");

            }

            if (document.getElementById("denialOrder")) {
                $("#denialOrder").kendoMultiSelect({
                    index: 0,
                    autoClose: false,
                    dataTextField: "Value",
                    dataValueField: "ID",
                    dataSource: [
                        { ID: 1, Value: "Yes" },
                        { ID: 0, Value: "No" },
                        { ID: -1, Value: "Unknown" }
                    ]
                }).data("kendoMultiSelect");

            }
            if (document.getElementsByName("rbEnforcementDate")) {
                $("input[type=radio][name=rbEnforcementDate]").on("change", function (e) {
                    if ($(e.target).val() == "SR") {
                        $("#enforcementDateRange").show();
                    } else {
                        $("#enforcementDateRange").hide();
                    }
                });
            }

            $("#keyWord").on('keydown', function (e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode == 13) {
                    sender.events.emit("searchExecuted");

                }
            });

            if (document.getElementById("reasonForControl")) {
                controlPromises.push(vmLookups.getLookupItems("ReasonForControl", this.agency + "SANCTIONS"));
                controlPromises[controlPromises.length - 1].done(function (data) {
                    $("#reasonForControl").kendoMultiSelect({
                        index: 0,
                        autoClose: false,
                        dataTextField: "Value",
                        dataValueField: "ID",
                        dataSource: data
                    }).data("kendoMultiSelect");
                });
            }


            if (document.getElementById("violationType")) {
                controlPromises.push(vmLookups.getLookupItems("ViolationType", this.agency + "SANCTIONS"));
                controlPromises[controlPromises.length - 1].done(function (data) {
                    $("#violationType").kendoMultiSelect({
                        index: 0,
                        autoClose: false,
                        dataTextField: "Value",
                        dataValueField: "ID",
                        dataSource: data
                    }).data("kendoMultiSelect");
                });
            }

            Promise.all(controlPromises).then(function (data) {
                prm.resolve();
            });
        });


        

        return prm;
    }
    

    getSearchParameters() {
        this.SearchParameters = {
            EnforcementDateSelection: null,
            EnforcementDateBegin: null,
            EnforcementDateEnd: null,
            NumberOfViolationsLow: null,
            NumberOfViolationsHigh: null,
            PenaltySettlementAmountLow: null,
            PenaltySettlementAmountHigh: null,
            Nationality: [],
            RegulatoryProvision: [],
            Program: [],
            Industry: [],
            ViolationType: [],
            ReasonForControl: [],
            VoluntaryDisclosure: [],
            EgregiousCase: [],
            AggravatingFactor: [],
            MitigatingFactor: [],
            RespondentNationality: [],
            Destination: [],
            Transhipment: [],
            Sanctioned126Country: [],
            KeyWords: ""
        };

        if (document.getElementById("regulatoryProvision")) {
            this.SearchParameters.RegulatoryProvision = $("#regulatoryProvision").data("kendoDropDownTree").value();
            
        }

        if (document.getElementById("program")) {
            this.SearchParameters.Program = $("#program").data("kendoMultiSelect").value();
           
        }

        if (document.getElementById("industry")) {
            this.SearchParameters.Industry = $("#industry").data("kendoMultiSelect").value();
           
        }
        if (document.getElementById("aggravatingFactor")) {
            this.SearchParameters.AggravatingFactor = $("#aggravatingFactor").data("kendoMultiSelect").value();
          
        }

        if (document.getElementById("mitigatingFactor")) {
            this.SearchParameters.MitigatingFactor = $("#mitigatingFactor").data("kendoMultiSelect").value();
        }

        if (document.getElementById("respondentNationality")) {
            this.SearchParameters.RespondentNationality = $("#respondentNationality").data("kendoMultiSelect").value();
        }
        if (document.getElementById("destination")) {
            this.SearchParameters.Destination = $("#destination").data("kendoMultiSelect").value();
        }
        if (document.getElementById("transhipment")) {
            this.SearchParameters.Transhipment = $("#transhipment").data("kendoMultiSelect").value();
        }
        if (document.getElementById("sanctioned126")) {
            this.SearchParameters.Sanctioned126Country = $("#sanctioned126").data("kendoMultiSelect").value();
        }

        if (document.getElementById("egregiousCase")) {
            this.SearchParameters.EgregiousCase = $("#egregiousCase").data("kendoMultiSelect").value()
        }

        if (document.getElementById("voluntaryDisclosure")) {
            this.SearchParameters.VoluntaryDisclosure = $("#voluntaryDisclosure").data("kendoMultiSelect").value()

        }

        if (document.getElementById("denialOrder")) {
            this.SearchParameters.DenialOrder = $("#denialOrder").data("kendoMultiSelect").value()

        }
        if (document.getElementsByName("rbEnforcementDate")) {
            var edBegin;
            var edEnd;
            var now = new Date();
            switch ($("input[name=rbEnforcementDate]:checked").val()) {
                case "-6":
                    edEnd = new Date();
                    edBegin = new Date(now.setMonth(now.getMonth() - 6));
                    break;
                case "-12":
                    edEnd = new Date();
                    edBegin = new Date(now.setMonth(now.getMonth() - 12));
                    break;
                case "-24":
                    edEnd = new Date();
                    edBegin = new Date(now.setMonth(now.getMonth() - 24));
                    break;
                case "SR":
                    edBegin = $("#enforcementDateBegin").data("kendoDatePicker").value();
                    edEnd = $("#enforcementDateEnd").data("kendoDatePicker").value();
                    break;
                case "All":
                default:
                    edBegin = null;
                    edEnd = null;
                    break;

            }

            this.SearchParameters.EnforcementDateSelection = $("input[name=rbEnforcementDate]:checked").val();
            this.SearchParameters.EnforcementDateBegin = edBegin;
            this.SearchParameters.EnforcementDateEnd = edEnd;

        }


        if (document.getElementById("reasonForControl")) {
            this.SearchParameters.ReasonForControl = $("#reasonForControl").data("kendoMultiSelect").value();
        }


        if (document.getElementById("violationType")) {
            this.SearchParameters.ViolationType = $("#violationType").data("kendoMultiSelect").value();
        }

        this.SearchParameters.Keywords = $("#keyWord").val();

        if (document.getElementsByName("settlementAmount")) {
            this.SearchParameters.PenaltySettlementAmountLow = $("#settlementAmountLow").data("kendoNumericTextBox").value();
            this.SearchParameters.PenaltySettlementAmountHigh = $("#settlementAmountHigh").data("kendoNumericTextBox").value();
        }
        if (document.getElementsByName("numberOfViolations")) {
            this.SearchParameters.NumberOfViolationsLow = $("#numberOfViolationsLow").data("kendoNumericTextBox").value();
            this.SearchParameters.NumberOfViolationsHigh = $("#numberOfViolationsHigh").data("kendoNumericTextBox").value();
        }

        console.log(this.SearchParameters);
        return this.SearchParameters;
    }

    clearSearchParameters() {

        this.#savedSearches.value(null);

        if(document.getElementById("regulatoryProvision")) {
            $("#regulatoryProvision").data("kendoDropDownTree").value(null);
        }

        if (document.getElementById("program")) {
            $("#program").data("kendoMultiSelect").value(null);

        }

        if (document.getElementById("industry")) {
            $("#industry").data("kendoMultiSelect").value(null);
        }
        if (document.getElementById("aggravatingFactor")) {
            $("#aggravatingFactor").data("kendoMultiSelect").value(null);

        }

        if (document.getElementById("mitigatingFactor")) {
            $("#mitigatingFactor").data("kendoMultiSelect").value(null);
        }

        if (document.getElementById("respondentNationality")) {
            $("#respondentNationality").data("kendoMultiSelect").value(null);
        }

        if (document.getElementById("destination")) {
            $("#destination").data("kendoMultiSelect").value(null);
        }
        if (document.getElementById("transhipment")) {
            $("#transhipment").data("kendoMultiSelect").value(null);
        }
        if (document.getElementById("sanctioned126")) {
            $("#sanctioned126").data("kendoMultiSelect").value(null);
        }

        if (document.getElementById("egregiousCase")) {
            $("#egregiousCase").data("kendoMultiSelect").value(null);
        }

        if (document.getElementById("voluntaryDisclosure")) {
            $("#voluntaryDisclosure").data("kendoMultiSelect").value(null);

        }
        if (document.getElementById("denialOrder")) {
            $("#denialOrder").data("kendoMultiSelect").value(null);

        }
        if (document.getElementsByName("rbEnforcementDate")) {
            $("#rbEnforcementDate_All").prop("checked", "checked");
        }

        if (document.getElementById("reasonForControl")) {
            $("#reasonForControl").data("kendoMultiSelect").value(null);
        }

        if (document.getElementById("violationType")) {
            $("#violationType").data("kendoMultiSelect").value(null);
        }

        $("#keyWord").val("");

        if (document.getElementsByName("rbEnforcementDate")) {
            $("#rbEnforcementDate_All").prop("checked", "checked");
            $("#enforcementDateBegin").data("kendoDatePicker").value(null);
            $("#enforcementDateEnd").data("kendoDatePicker").value(null);
        }

        if (document.getElementsByName("settlementAmount")) {
            $("#settlementAmountLow").data("kendoNumericTextBox").value(null);
            $("#settlementAmountHigh").data("kendoNumericTextBox").value(null);
        }
        if (document.getElementsByName("numberOfViolations")) {
            $("#numberOfViolationsLow").data("kendoNumericTextBox").value(null);
            $("#numberOfViolationsHigh").data("kendoNumericTextBox").value(null);
        }
    }

    bindSearchParameters() {
        if (document.getElementById("regulatoryProvision")) {
            $("#regulatoryProvision").data("kendoDropDownTree").value(this.SearchParameters.RegulatoryProvision);
            if (this.SearchParameters.RegulatoryProvision.length > 0) {
                $("#regulatoryProvisionCollapse").collapse("show");
            } else {
                $("#regulatoryProvisionCollapse").collapse("hide");
            }
        }

        if (document.getElementById("program")) {
            $("#program").data("kendoMultiSelect").value(this.SearchParameters.Program);
            if (this.SearchParameters.Program.length > 0) {
                $("#programCollapse").collapse("show");
            } else {
                $("#programCollapse").collapse("hide");
            }
        }

        if (document.getElementById("industry")) {
            $("#industry").data("kendoMultiSelect").value(this.SearchParameters.Industry);
            if (this.SearchParameters.Industry.length > 0) {
                $("#industryCollapse").collapse("show");
            } else {
                $("#industryCollapse").collapse("hide");
            }
            
        }
        if (document.getElementById("aggravatingFactor")) {
            $("#aggravatingFactor").data("kendoMultiSelect").value(this.SearchParameters.AggravatingFactor);
            if (this.SearchParameters.AggravatingFactor.length > 0) {
                $("#aggravatingFactorCollapse").collapse("show");
            } else {
                $("#aggravatingFactorCollapse").collapse("hide");
            }
            
        }

        if (document.getElementById("mitigatingFactor")) {
            $("#mitigatingFactor").data("kendoMultiSelect").value(this.SearchParameters.MitigatingFactor);
            if (this.SearchParameters.Program.length > 0) {
                $("#mitigatingFactorCollapse").collapse("show");
            } else {
                $("#mitigatingFactorCollapse").collapse("hide");
            }
        }

        if (document.getElementById("respondentNationality")) {
            $("#respondentNationality").data("kendoMultiSelect").value(this.SearchParameters.RespondentNationality);
            if (this.SearchParameters.RespondentNationality.length > 0) {
                $("#respondentNationalityCollapse").collapse("show");
            } else {
                $("#respondentNationalityCollapse").collapse("hide");
            }
        }

        if (document.getElementById("destination")) {
            $("#destination").data("kendoMultiSelect").value(this.SearchParameters.Destination);
            if (this.SearchParameters.Destination.length > 0) {
                $("#destinationCollapse").collapse("show");
            } else {
                $("#destinationCollapse").collapse("hide");
            }
        }

        if (document.getElementById("transhipment")) {
            $("#destination").data("kendoMultiSelect").value(this.SearchParameters.Transhipment);
            if (this.SearchParameters.Transhipment.length > 0) {
                $("#transhipmentCollapse").collapse("show");
            } else {
                $("#transhipmentCollapse").collapse("hide");
            }
        }

        if (document.getElementById("sanctioned126")) {
            $("#sanctioned126").data("kendoMultiSelect").value(this.SearchParameters.Sanctioned126Country);
            if (this.SearchParameters.Sanctioned126Country.length > 0) {
                $("#sanctioned126Collapse").collapse("show");
            } else {
                $("#sanctioned126Collapse").collapse("hide");
            }
        }

        if (document.getElementById("egregiousCase")) {
            $("#egregiousCase").data("kendoMultiSelect").value(this.SearchParameters.EgregiousCase);
            if (this.SearchParameters.EgregiousCase.length > 0) {
                $("#egregiousCaseCollapse").collapse("show");
            } else {
                $("#egregiousCaseCollapse").collapse("hide");
            }
        }

        if (document.getElementById("voluntaryDisclosure")) {
            $("#voluntaryDisclosure").data("kendoMultiSelect").value(this.SearchParameters.VoluntaryDisclosure);
            if (this.SearchParameters.VoluntaryDisclosure.length > 0) {
                $("#voluntaryDisclosureCollapse").collapse("show");
            } else {
                $("#voluntaryDisclosureCollapse").collapse("hide");
            }
            this.SearchParameters.VoluntaryDisclosure = $("#voluntaryDisclosure").data("kendoMultiSelect").value()

        }
        if (document.getElementById("denialOrder")) {
            $("#denialOrder").data("kendoMultiSelect").value(this.SearchParameters.VoluntaryDisclosure);
            if (this.SearchParameters.DenialOrder.length > 0) {
                $("#denialOrderCollapse").collapse("show");
            } else {
                $("#denialOrderCollapse").collapse("hide");
            }
            this.SearchParameters.DenialOrder = $("#denialOrder").data("kendoMultiSelect").value()

        }

        if (document.getElementsByName("rbEnforcementDate")) {
            $("input[name=rbEnforcementDate][value=" + this.SearchParameters.EnforcementDateSelection + "]").prop("checked", "checked");
            if (this.SearchParameters.EnforcementDateSelection == "SR") {
                $("#enforcementDateBegin").data("kendoDatePicker").value(this.SearchParameters.EnforcementDateBegin == null ? null : new Date(kendo.toString(this.SearchParameters.EnforcementDateBegin, "d")));
                $("#enforcementDateEnd").data("kendoDatePicker").value(this.SearchParameters.EnforcementDateEnd == null ? null : new Date(kendo.toString(this.SearchParameters.EnforcementDateEnd, "d")));
            } else {

                $("#enforcementDateBegin").data("kendoDatePicker").value(null);
                $("#enforcementDateEnd").data("kendoDatePicker").value(null);
            }
            if (this.SearchParameters.EnforcementDateSelection != "ALL") {
                $("#enforcementDateCollapse").collapse("show");
            } else {
                $("#enforcementDateCollapse").collapse("hide");
            }
        }
        if (document.getElementById("reasonForControl")) {
            $("#reasonForControl").data("kendoMultiSelect").value(this.SearchParameters.ReasonForControl);
            if (this.SearchParameters.Program.length > 0) {
                $("#reasonForControlCollapse").collapse("show");
            } else {
                $("#reasonForControlCollapse").collapse("hide");
            }
        }
        if (document.getElementById("violationType")) {
            $("#violationType").data("kendoMultiSelect").value(this.SearchParameters.ViolationType);
            if (this.SearchParameters.Program.length > 0) {
                $("#violationTypeCollapse").collapse("show");
            } else {
                $("#violationTypeCollapse").collapse("hide");
            }
        }

        $("#keyWord").val(this.SearchParameters.Keywords);

        if (document.getElementsByName("settlementAmount")) {
            $("#settlementAmountLow").data("kendoNumericTextBox").value(this.SearchParameters.PenaltySettlementAmountLow);
            $("#settlementAmountHigh").data("kendoNumericTextBox").value(this.SearchParameters.PenaltySettlementAmountHigh);

            if (this.SearchParameters.PenaltySettlementAmountLow != null ||
                this.SearchParameters.PenaltySettlementAmountHigh != null) {
                $("#settlementAmountCollapse").collapse("show");
            } else {
                $("#settlementAmountCollapse").collapse("hide");
            }
        }
        if (document.getElementsByName("numberOfViolations")) {
            $("#numberOfViolationsLow").data("kendoNumericTextBox").value(this.SearchParameters.NumberOfViolationsLow);
            $("#numberOfViolationsHigh").data("kendoNumericTextBox").value(this.SearchParameters.NumberOfViolationsHigh);

            if (this.SearchParameters.NumberOfViolationsLow != null ||
                this.SearchParameters.NumberOfViolationsHigh != null) {
                $("#numberOfViolationsCollapse").collapse("show");
            } else {
                $("#numberOfViolationsCollapse").collapse("hide");
            }
        }
    }

    isValidCriteria() {
        var validCriteria = false;
        for (var property in this.SearchParameters) {
            switch (property) {
                case "KeyWords":
                    if (this.SearchParameters[property].trim().length > 3) {
                        validCriteria = true;
                        break;
                    }
                    break;
                case "EnforcementDateSelection":
                    if (this.SearchParameters[property].toString() != "ALL") {
                        validCriteria = true;
                        break;
                    }
                    break;
                case "PenaltySettlementAmountLow":
                case "NumberOfViolationsLow":
                    if (this.SearchParameters[property] > 0) {
                        validCriteria = true;
                        break;
                    }
                    break;
                default:
                    if (this.SearchParameters.hasOwnProperty(property)) {
                        if (this.SearchParameters[property] != null) {
                            if (this.SearchParameters[property].toString() != "") {
                                validCriteria = true;
                                break;
                            }
                        }
                    }
                    break;
            }
        }
        this.SearchParameters.isOneCriteriaFilled = validCriteria;
        return validCriteria;
    }   

    saveSearchParamers(searchLogID, savedSearchID, searchName) {
        var pSave = $.Deferred();
        var saveOptions = {
            SavedSearchID: savedSearchID,
            SearchName: searchName,
            BasedOnSearchLogID: searchLogID
        };
        var matches = $.grep($("#savedSearches").data("kendoDropDownList").dataSource.data(), function (search) {
            if (saveOptions.SavedSearchID == 0) {
                return (search.Value == searchName);
            } else {
                return (search.Value.trim() == searchName.trim() && search.Key != saveOptions.SavedSearchID);
            }
        });

        if (matches.length > 0) {
            pSave.reject("Please provide a unique name for this search");
            return (pSave);
        }
        //}

        pSave = vmSearch.saveSearch(saveOptions);
        return pSave;
    }

    reloadSavedSearches(selectedSearchID, selectedSearchName) {
        var prm = $.Deferred();
        var ddSS = $("#savedSearches").data("kendoDropDownList");

        vmSearch.getSavedSearches().done(function (data) {
            ddSS.dataSource.data(data);
            if (selectedSearchID != null) {
                ddSS.value(selectedSearchID);
                ddSS.text(selectedSearchName);
            }

            prm.resolve();
        });

        return prm;
    }


}


export default CaseParameters;