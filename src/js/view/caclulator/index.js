"use strict";

var utility = require("./../../util/utility");
var vmCalc = require("./../../viewmodel/vm_calculator");
var vmLookups = require("./../../viewmodel/vm_lookups");

require("@progress/kendo-ui/js/kendo.grid.js");

import HeaderFooter from "../../components/headerFooter";

import pmt from "../../../html/common/ProjectionsMatrix.html";


import readXlsxFile from 'read-excel-file'

var simpleCalcDate;
var statuteDS;
var agency;
var totalPenalties ;

$(document).ready(function () {
    var statuteList;
    kendo.ui.progress($("BODY"), true);
    agency = utility.getQSValue("a");
    if (agency == null) { agency = "OFAC"; }
    agency = agency.toUpperCase();

    $("[name=agency]").text(agency);
    var latestScheduleDate;
    var hf = new HeaderFooter(agency);
    hf.applyPageTemplate(agency + " Penalty Calculator", agency).done(function () {
        //templates.loadProjectionMatrixTemplate(document.getElementById("matrixTemplate"));
        $("#matrixTemplate").html(pmt);

        vmCalc.getLatestPenaltyScheduleDate(agency).then(function (lu) {
            latestScheduleDate = new Date(lu);
            $("span[name=latestScheduleDate]").text(kendo.toString(new Date(lu), "MMMM dd, yyyy"));
            $("#leftFooter").text("Last updated " + kendo.toString(new Date(lu), "MMMM dd, yyyy"));
            simpleCalcDate = lu;

            $(".moneyEntry").kendoNumericTextBox({
                format: "c0",
                decimals: 3,
                min: 1,
                step: 100,
                value: 1
            });
            $(".integerEntry").kendoNumericTextBox({
                format: "#",
                min: 1,
                step: 1,
                value: 1
            });
            
            switch (agency) {
                case "OFAC":
                    statuteDS = [{ statute: "IEEPA", display: "IEEPA" },
                        { statute: "TWEA", display: "TWEA" },
                        { statute: "Kingpin", display: "Kingpin" },
                        { statute: "AEDPA", display: "AEDPA" },
                        { statute: "Diamond", display: "Blood Diamond" }];

                    statuteList = [
                        "IEEPA",
                        "TWEA",
                        "Kingpin",
                        "AEDPA",
                        "Diamond"
                    ];
                    break;
                case "BIS":
                    statuteDS = [{ statute: "IEEPAECRA", display: "IEEPA/ECRA" }]
                    statuteList = [
                        "IEEPAECRA"
                    ];
                    break;
                case "DDTC":
                    statuteDS = [{ statute: "IEEPAECRA", display: "IEEPA/ECRA" }]
                    statuteList = [
                        "IEEPAECRA"
                    ];
                    break;
            }

            $("#criteriaStatute").kendoDropDownList({
                dataTextField: "display",
                dataValueField: "statute",
                dataSource: statuteDS, 
                optionLabel: "Select..."
            });

            var hideStatutesCol = false;
            if (statuteDS.length == 1) {
                
                $("#statuteRow").hide();
                hideStatutesCol = true;
                $("#criteriaStatute").data("kendoDropDownList").value(statuteDS[0].statute);
            }
            
            var vSimple = $("#simpleCriteria").kendoValidator({
                messages: {
                    // defines a message for the custom validation rule
                    importd: "importd"
                }

            });

            $("#complexCriteria").kendoValidator({
                messages: {
                    // defines a message for the custom validation rule
                    importd: "importd"
                }

            });

            $("input[name=rb_calctype]").on("change", function (e) {
                if ($("#simple").prop("checked")) {
                    $("div[name=simple]").show();
                    $("#complexCriteria").hide();
                } else {
                    $("div[name=simple]").hide();
                    $("#complexCriteria").show();
                }
            });

            var dsTransactions = new kendo.data.DataSource({
                offlineStorage: "transactions-offline",
                transport: {
                    read: function (operation) {
                        var data = operation.data.data || [{ total: 1, date: latestScheduleDate, statute: 'IEEPA' }];
                        operation.success(data);
                    }
                },
                schema: {
                    model: {
                        fields: {
                            total: { editable: true, defaultValue: 1, type: "number", nullable: false, validation: { importd: true, min: 1, default: 1 } },
                            date: { editable: true, defaultValue: latestScheduleDate, type: "date", validation: { importd: true } },
                            statute: { editable: true, defaultValue: 'IEEPA', type: "string", validation: { importd: true } },
                            agency: { editable: false, defaultValue: agency, type: "string" }
                       }
                    }
                }
            });

            var gridTrans = $("#gridTransactions").kendoGrid({
                dataSource: dsTransactions,
                navigatable: true,
                pageable: false,
                editable: {
                    createAt: "bottom"
                },
                width: "100%",
                toolbar: [
                    {
                        name: "create",
                        text: "Add Transaction",
                    },
                    {
                        name: "import",
                        template: "<button id='importTransactions' class='k-button k-button-md k-button-rectangle k-rounded-md k-button-solid k-button-solid-base'><span class='k-icon k-i-excel k-button-icon'></span><span class='k-button-text'>Import Transactions</span></button>",
                    },
                    {
                        name: "template",
                        template: "<button id='downloadTemplate' class='k-button k-button-md k-button-rectangle k-rounded-md k-button-solid k-button-solid-base' target='_blank'><span class='k-icon k-i-download k-button-icon'></span><span class='k-button-text'>Download Template</span></button>",
                    },
                    {
                        name: "exec",
                        template: "<button name='execCalc' class='k-button k-button-md k-button-rectangle k-rounded-md k-button-solid k-button-solid-base'><span class='k-icon k-i-calculator k-button-icon'></span><span class='k-button-text'>Calculate</span></button>",
                    },
                    {
                        name: "clear",
                        template: "<button name='clearCalc' class='k-button k-button-md k-button-rectangle k-rounded-md k-button-solid k-button-solid-base'><span class='k-icon k-i-clear k-button-icon'></span><span class='k-button-text'>Reset</span></button>",
                    },

                ],
                columns: [
                    {
                        command: [
                            {
                                name: "destroy",
                                text: " ",
                                iconClass: "k-icon k-i-close-circle"
                            }],
                        className: "text-center",
                        attributes: {
                            "class": "text-center",
                        },
                        title: "&nbsp;",
                        width: "20%"
                    },

                    {
                        field: "total",
                        title: "Value",
                        width: "25%",
                        format: "{0:c0}"
                    },
                    {
                        field: "date",
                        title: "Date",
                        width: "25%",
                        format: "{0:d}"
                    },
                    {
                        field: "statute",
                        title: "Statute",
                        width: "30%",
                        hidden: hideStatutesCol,
                        editor: function (container, options) { statuteEditor(container, options, true) }
                    },
                ],
                dataBound: function (e) {
                    
                }
            }).data("kendoGrid");


            gridTrans.tbody.on('keydown', function (e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode == 9 && !e.shiftKey
                    && $(e.target).closest('td').is(':last-child') && $(e.target).closest('tr').is(':last-child')) {
                    console.log("add");
                    gridTrans.addRow();
                }
            });

            $("#downloadTemplate").on("click", () => {
                window.open("rsc/" + agency + "TransactionTemplate.xlsx");
            });


            $("#importTransactions").on("click", ()=> {
               
                $("#upload").click();
            });

            $("#upload").on('change', (e) => {
                const schema = {
                    'Transaction Date': {
                        prop: 'date',
                        type: Date,
                        required: true
                    },
                    'Transaction Value ($)': {
                        prop: 'total',
                        type: Number,
                        required: true
                    },
                    'Statute': {
                        prop: 'statute',
                        type: String,
                        oneOf: statuteList
                    }
                };
                readXlsxFile($(e.currentTarget)[0].files[0], { schema }).then(({ rows, errors }) => {
                    $("#upload").val("");
                    if (errors.length > 0) {
                        kendo.alert("The uploaded spreadsheet does not conform to the required specifications. Please click the 'Download Template' button and use that file for your transaction list.");
                        return;
                    }
                    else {
                        dsTransactions.read({ data: rows });
                    }
                    
                });
            });

            vmLookups.getLookupItems("AggravatingFactor", agency + "SANCTIONS").done(function (data) {
                $("#ofacAggravatingFactors").kendoMultiSelect({
                    index: 0,
                    autoClose: false,
                    dataTextField: "Value",
                    dataValueField: "ID",
                    dataSource: data
                }).data("kendoMultiSelect");
            });

            $("#multiselect").kendoMultiSelect({
                autoClose: true,
            });
            vmLookups.getLookupItems("MitigatingFactor", agency + "SANCTIONS").done(function (data) {
                $("#ofacMitigatingFactors").kendoMultiSelect({
                    index: 0,
                    autoClose: false,
                    dataTextField: "Value",
                    dataValueField: "ID",
                    dataSource: data
                }).data("kendoMultiSelect");
            });

            $(".main-content").show();
            kendo.ui.progress($("BODY"), false);


            var prmCalc;

            $("[name=execCalc]").on("click", function (e) {
                e.preventDefault();
                var validator;
                if ($("input[name=rb_calctype]:checked").val() == "simple") {
                    validator = $("#simpleCriteria").data("kendoValidator");
                    if (validator) {

                        validator.validate();
                        if (validator.errors().length > 0) {
                            kendo.alert("Please fix the highlighted errors on the form before continuing.");


                            return;
                        }
                    }
                    kendo.ui.progress($("BODY"), true);

                    var params =
                    {
                        total: $("#criteriaValue").data("kendoNumericTextBox").value(),
                        count: $("#criteriaViolations").data("kendoNumericTextBox").value(),
                        statute: $("#criteriaStatute").data("kendoDropDownList").value()
                    };

                    prmCalc = vmCalc.execSimpleCalculator(params.total, simpleCalcDate, params.count, params.statute, agency);

                } else {
                    validator = $("#complexCriteria").data("kendoValidator");
                    if (validator) {

                        validator.validate();
                        if (validator.errors().length > 0) {
                            kendo.alert("Please fix the highlighted errors on the form before continuing.");

                            return;
                        }
                    }

                    var transactionList = $("#gridTransactions").data("kendoGrid").dataSource.data().toJSON();

                    if (transactionList.length == 0) {
                        kendo.alert("Please enter at least 1 transaction.");

                        return;
                    }
                    prmCalc = vmCalc.execComplexCalculator(transactionList, agency);
 
                }

                prmCalc.done(function (penalties) {
                    totalPenalties = penalties.find((p) => {
                        return p.Statute == "Summary";
                    });
                    bindPenaltyMatrices(penalties);
                    
                    $("#paramsDiv").addClass("d-none d-lg-block");
                    $("#centerDiv").removeClass("d-none d-lg-block");


                    resetProjectionFactors();

                    $("#overruledPredictor").show();
                    $("#aOverruledPredictor").show();
                    $("#" + agency + "MLFactors").hide();
                    $("#predictorResults").hide();

                    kendo.ui.progress($("BODY"), false);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    kendo.ui.progress($("BODY"), false);
                    kendo.alert("An error occurred while running the calculations.<br/>" + textStatus);

                    });



            });

            $("[name=clearCalc]").on("click", function (e) {
                e.preventDefault();

                $("#criteriaValue").data("kendoNumericTextBox").value(null);
                $("#criteriaViolations").data("kendoNumericTextBox").value(null);
                $("#criteriaStatute").data("kendoDropDownList").value("IEEPA");

                dsTransactions.read({ data: null });

                resetPenalties();

                resetProjectionFactors();
                $("#overruledPredictor").hide();
                $("#aOverruledPredictor").show();
                $("#" + agency + "MLFactors").hide();
                $("#predictorResults").hide();


                $("#paramsDiv").removeClass("d-none d-lg-block");
                $("#centerDiv").addClass("d-none d-lg-block");
            });

            $("#editTransaction").on("click", function (e) {
                e.preventDefault();

                $("#paramsDiv").removeClass("d-none d-lg-block");
                $("#centerDiv").addClass("d-none d-lg-block");
            });

            $("#aOverruledPredictor").on("click", function (e) {
                e.preventDefault();
                $(this).hide();
                $("#" + agency + "MLFactors").show();
            });

            $("#execProjection").on("click", function (e) {
                e.preventDefault();
                kendo.ui.progress($("BODY"), true);

                var factors = [];
                var mFactors = $("#ofacMitigatingFactors").data("kendoMultiSelect").value();
                mFactors.forEach((f) => {
                    factors.push(new Object({
                        FactorType: "MITIGATING",
                        MitigatinAggravatingFactorID: f
                    }));
                });

                var aFactors = $("#ofacAggravatingFactors").data("kendoMultiSelect").value();
                aFactors.forEach((f) => {
                    factors.push(new Object({
                        FactorType: "AGGRAVATING",
                        MitigatinAggravatingFactorID: f
                    }));
                });

                if ($("input[name='OFACMultiplePrograms']:checked").val() == "1") {
                    factors.push(new Object({
                        FactorType: "BIT",
                        MitigatinAggravatingFactorID: -1,
                        Value: 1
                    }));
                } else {
                    factors.push(new Object({
                        FactorType: "BIT",
                        MitigatinAggravatingFactorID: -1,
                        Value: 0
                    }));
                }

                if ($("input[name='OFACCountryID']:checked").val() == "1") {
                    factors.push(new Object({
                        FactorType: "BIT",
                        MitigatinAggravatingFactorID: -2,
                        Value: 1
                    }));
                } else {
                    factors.push(new Object({
                        FactorType: "BIT",
                        MitigatinAggravatingFactorID: -2,
                        Value: 0
                    }));
                }

                //if ($("inpu

                if ($("input[name='OFACWillfullOrReckless']:checked").val() == "1") {
                    factors.push(new Object({
                        FactorType: "BIT",
                        MitigatinAggravatingFactorID: -6,
                        Value: 1
                    }));
                } else {
                    factors.push(new Object({
                        FactorType: "BIT",
                        MitigatinAggravatingFactorID: -6,
                        Value: 0
                    }));
                }

                if ($("input[name=rb_calctype]:checked").val() == "simple") {
                    factors.push(new Object({
                        FactorType: "NUMBER",
                        MitigatinAggravatingFactorID: -4,
                        Value: $("#criteriaViolations").data("kendoNumericTextBox").value()
                    }));
                } else {
                    factors.push(new Object({
                        FactorType: "NUMBER",
                        MitigatinAggravatingFactorID: -4,
                        Value: $("#gridTransactions").data("kendoGrid").dataSource.total()
                    }));
                }

                vmCalc.getEgregiousPrediction(agency, factors).done(function (projection) {
                    var calculatedPenaltyVSDYes = 0;
                    var calculatedPenaltyVSDNo = 0;
                    if (projection.egregious == 1) {
                        $("[name=egregious]").text("EGREGIOUS");
                        calculatedPenaltyVSDYes = totalPenalties.Quadrant_3;
                        calculatedPenaltyVSDNo = totalPenalties.Quadrant_4;
                    } else {
                        $("[name=egregious]").text("NON-EGREGIOUS");
                        calculatedPenaltyVSDYes = totalPenalties.Quadrant_1;
                        calculatedPenaltyVSDNo = totalPenalties.Quadrant_2 ;
                    }

                    factors.push(new Object({
                        FactorType: "NUMBER",
                        MitigatinAggravatingFactorID: -7,
                        Value: projection.egregious
                    }));
                    
                    var vsdYes = [new Object({
                        FactorType: "BIT",
                        MitigatinAggravatingFactorID: -5,
                        Value: 1
                    }),
                        new Object({
                        FactorType: "NUMBER",
                        MitigatinAggravatingFactorID: -3,
                        Value: calculatedPenaltyVSDYes
                    })];
                    var vsdNo = [new Object({
                        FactorType: "BIT",
                        MitigatinAggravatingFactorID: -5,
                        Value: 0
                    }),
                    new Object({
                        FactorType: "NUMBER",
                        MitigatinAggravatingFactorID: -3,
                        Value: calculatedPenaltyVSDNo
                        })];

                    var prmMitigation = [];
                    prmMitigation.push(vmCalc.getMitigationPrediction(agency, factors.concat(vsdYes)));

                    prmMitigation.push(vmCalc.getMitigationPrediction(agency, factors.concat(vsdNo)));

                    Promise.all(prmMitigation).then((projections) => {
                        var penaltyLow, penaltyHigh;
                        penaltyLow = Math.max(0, calculatedPenaltyVSDYes * (projections[0].mitigationVSDYes - 20) * .01);
                        penaltyHigh = Math.max(0, calculatedPenaltyVSDYes * (projections[0].mitigationVSDYes + 20) * .01);
                        $("#penaltyVSDYes").text(kendo.toString(penaltyLow, "C0") + " to " + kendo.toString(penaltyHigh, "C0"));
                        penaltyLow = Math.max(0, calculatedPenaltyVSDNo * ((projections[0].mitigationVSDNo - 20) * .01));
                        penaltyHigh = Math.max(0, calculatedPenaltyVSDNo * ((projections[0].mitigationVSDNo + 20) * .01));
                         $("#penaltyVSDNo").text(kendo.toString(penaltyLow, "C0") + " to " + kendo.toString(penaltyHigh, "C0"));

                        $("#predictorResults").show();
                        kendo.ui.progress($("BODY"), false);
                    });

                    
                }).fail(function () {
                    kendo.alert("An error occurred while running the projection.");
                    kendo.ui.progress($("BODY"), false);
                });

            });
        });
    });

});


function bindPenaltyMatrices(penalties) {
    resetPenalties();
    var statuteTemplate = $("#statuteTemplate").html();
    for (var idx = 0; idx < penalties.length; idx++) {
        if (penalties[idx].Statute == "Summary") {
            $("#Quadrant_1_penalty").html(kendo.toString(penalties[idx].Quadrant_1, "C0"));
            $("#Quadrant_2_penalty").html(kendo.toString(penalties[idx].Quadrant_2, "C0"));
            $("#Quadrant_3_penalty").html(kendo.toString(penalties[idx].Quadrant_3, "C0"));
            $("#Quadrant_4_penalty").html(kendo.toString(penalties[idx].Quadrant_4, "C0"));

        } else {
            $("#Quadrant_1_statutes").append(statuteTemplate.replace("STATUTE", penalties[idx].Statute).replace("PENALTY", kendo.toString(penalties[idx].Quadrant_1, "C0")));
            $("#Quadrant_2_statutes").append(statuteTemplate.replace("STATUTE", penalties[idx].Statute).replace("PENALTY", kendo.toString(penalties[idx].Quadrant_2, "C0")));
            $("#Quadrant_3_statutes").append(statuteTemplate.replace("STATUTE", penalties[idx].Statute).replace("PENALTY", kendo.toString(penalties[idx].Quadrant_3, "C0")));
            $("#Quadrant_4_statutes").append(statuteTemplate.replace("STATUTE", penalties[idx].Statute).replace("PENALTY", kendo.toString(penalties[idx].Quadrant_4, "C0")));

        }
    }

}

function bindPenaltyMatrix(penalty) {
    var tab = $("#" + penalty.Statute);
    tab.html($("#matrixTemplate").html());
    tab.find("span[name=Quadrant_1]").html(kendo.toString(penalty.Quadrant_1, "C"));
    tab.find("span[name=Quadrant_2]").html(kendo.toString(penalty.Quadrant_2, "C"));
    tab.find("span[name=Quadrant_3]").html(kendo.toString(penalty.Quadrant_3, "C"));
    tab.find("span[name=Quadrant_4]").html(kendo.toString(penalty.Quadrant_4, "C"));
    $("li." + penalty.Statute).show();
}

function resetPenalties() {
    $("#Quadrant_1_penalty").html("$0");
    $("#Quadrant_1_statutes").html("");
    $("#Quadrant_2_penalty").html("$0");
    $("#Quadrant_2_statutes").html("");
    $("#Quadrant_3_penalty").html("$0");
    $("#Quadrant_3_statutes").html("");
    $("#Quadrant_4_penalty").html("$0");
    $("#Quadrant_4_statutes").html("");
}

function resetProjectionFactors() {
    switch (agency) {
        case "OFAC":
            $("#ofacMitigatingFactors").data("kendoMultiSelect").value(null);
            $("#ofacAggravatingFactors").data("kendoMultiSelect").value(null);
            $("#OFACMultiplePrograms_No").prop("checked", "checked");
            $("#OFACWillfullOrReckless_No").prop("checked", "checked");
            $("#OFACCountryID_No").prop("checked", "checked");

    }
}
function statuteEditor(container, options, importd) {
    var req = importd ? 'importd' : ''
    $('<input ' + req + ' name="' + options.field + '" class="form-control  k-dropdown" />')
        .appendTo(container)
        .kendoDropDownList({
            dataTextField: "display",
            dataValueField: "statute",
            dataSource: statuteDS,
            optionLabel: "Select...",
            value: statuteDS[0].statute
        })
        .appendTo(container);
}