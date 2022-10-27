"use strict";


import HeaderFooter from "../../components/headerFooter";
import SecondaryResults from "../../components/secondaryResults";

var authorityDD;

var programDD1;
var programDD2;

var ssResults;

$(document).ready(function () {
    kendo.ui.progress($("BODY"), true);

    var hf = new HeaderFooter("OFAC");
    hf.applyPageTemplate("OFAC Secondary Sanctions").done(function () {
        
        
        //authorityDD = $("#authority").kendoDropDownList({
        //    dataTextField: "Authority",
        //    dataValueField: "AuthorityID",
        //    change: function (e) {
        //        e.preventDefault();
        //        loadAuthorityDetails(this.value());

        //    },
        //}).data("kendoDropDownList");

        //var authTabElement = $("#authorityTabs").kendoTabStrip({
        //    animation: {
        //        open: {
        //            effects: "fadeIn"
        //        }
        //    },
        //});
        //authTabElement.parent().addClass("tabstrip90PctH");


        programDD1 = $("#program").kendoDropDownList({
            dataTextField: "Program",
            dataValueField: "ProgramID",
            change: function (e) {
                e.preventDefault();
                var programid = this.value();

                $("#programAccordion div.collapse[name=program-body]").collapse("hide");
                $("div.collapse[name=authority-body]").collapse("hide");

                if (programid == null || programid == "") {
                    $("div[name=programCard]").show();
                } else {
                    $("div[name=programCard][id!=programCard" + programid + "]").hide();
                    $("div[name=programCard][id=programCard" + programid + "]").show();

                    var prm;
                    if (this.dataItem().ProgramType == "country") {
                        prm = ssResults.loadAuthoritiesByCountry(programid);
                    } else {
                        prm = ssResults.loadAuthoriesByProgram(this.value());
                    }
                }
                
            },
            optionLabel: "Select...",
            value: null,
            autoHide: true,
        }).data("kendoDropDownList");

        programDD2 = $("#program2").kendoDropDownList({
            dataTextField: "Program",
            dataValueField: "ProgramID",
            change: function (e) {
                e.preventDefault();
                programDD1.value(this.value);
                programDD1.trigger("change");
            },
            optionLabel: "Select...",
            value: null,
        }).data("kendoDropDownList");


        //authorityDD = $("#authorityList2").kendoDropDownList({
        //    dataTextField: "Authority",
        //    dataValueField: "AuthorityID",
        //    change: function (e) {
        //        e.preventDefault();
        //        loadAuthorityDetails(this.value());
        //    },
        //    optionLabel: "Select...",
        //    value: null,
        //}).data("kendoDropDownList");

        ssResults = new SecondaryResults(document.getElementById("secondaryResultsPlaceholder"));
        
        ssResults.initializeResults().done(function () {
            ssResults.loadPrograms().done(function (programs) {
                bindProgramDropdowns(programs);
                $("div.main-content").show();
                kendo.ui.progress($("BODY"), false);
            
            })
        }).fail(function () {
            kendo.alert("An error occurred while loading the page templates");
            kendo.ui.progress($("BODY"), false);
        });
    });

    $("a[name=aSecondaryKeyword]").on("click", function (e) {
        e.preventDefault();
        var kw = $("#" + $(this).data("target")).val().trim();
        $("input[name=secondaryKeyword]").val(kw);
        ssResults.loadPrograms(kw).done(function (programs) {
            bindProgramDropdowns(programs);
        });
    });

    $("input[name=secondaryKeyword]").on('keydown', function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode == 13) {
            $("input[name=secondaryKeyword]").val($(this).val());
            ssResults.loadPrograms($(this).val().trim()).done(function (programs) {
                bindProgramDropdowns(programs);
            });
        }
    });

    $("input[name=secondaryKeyword]").on('change', function (e) {
        $("input[name=secondaryKeyword]").val($(this).val());
        if ($("input[name=secondaryKeyword]").val().trim() == "") {
            ssResults.loadPrograms("").done(function (programs) {
                bindProgramDropdowns(programs);
            });
        }
        
    });
});

function bindProgramDropdowns(programs) {
    programDD1.setDataSource(programs);
    programDD2.setDataSource(programs);
}


//function bindAuthorityList(authorities) {

//    authorityDD.setDataSource(authorities);
//    authorityDD.value(null);
//    //authorityID = null;

//    $("#authorityList").html("");
    
//    $.each(authorities, function () {
//        $("#authorityList").append('<li class="list-group-item list-group-item-action" data-authority="' + this.AuthorityID + '">' + this.Authority + '</li>');

//    });
//    $("#authorityList li.list-group-item").on("click", function (e) {
//        $("#authorityList li.list-group-item").removeClass("active");
//        var auth = $(this);
//        auth.addClass("active");

//        //authorityID = auth.data("authority");
//        loadAuthorityDetails(auth.data("authority"));

//    });
//    $("span[name=authorityCount]").text("(" + authorities.length + ")");

//    //$("#authorities").show();
//    //if (authorities.length == 1) {
//    //    $("#authorityList li.list-group-item").first().trigger("click");
//    //    authorityDD.value(authorities[0].AuthorityID);
//    //} else {
//    //    $("#authorityTabs").hide();
//    //}
//}

