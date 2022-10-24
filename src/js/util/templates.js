"use strict";

var vmSearch = require("../viewmodel/vm_search");
//var tbIcon = require("./../../img/overruled.ico");
var nav = require("./nav");
var analytics = require("./analytics");

require("@progress/kendo-ui/js/kendo.ui.core");
require("./../../css/bootstrap.css");

require('@progress/kendo-ui/css/web/kendo.common.min.css');
require('@progress/kendo-theme-default/dist/all.css');
require("font-awesome/css/font-awesome.min.css");


require("./../../css/tradebase-ui.css");
require("./../../css/tradebase.css");
require("./../../css/akin-brand.css");

var tbLogo = require("./../../img/logo.png");

var agencyView;

var loadHeaderFooterCyber = function (screenName) {

    //ensure sidenav is unpinned
    $('body').removeClass('g-sidenav-pinned').removeClass('g-sidenav-show').addClass('g-sidenav-hidden');
    $('body').find('.backdrop').remove();
    //Cookies.set('sidenav-state', 'unpinned');
    var prmHF = $.Deferred();
    var promises = [];

    $("#icon").attr("href", "img/overruled.ico");


    promises.push($.get("common/header_privacy.html"));


    promises[promises.length - 1].done(function (template) {
        $(".header").append(template);

        $("#screenName").text(screenName);
    });

    promises.push($.get("common/footer.html"));
    promises[promises.length - 1].done(function (template) {
        $(".footer").append(template);

    });


    Promise.all(promises).then(function (data) {
        prmHF.resolve();
    });

    return prmHF;
};

var loadPageTemplate = function (screenName, agency) {
    var prmHF = $.Deferred();
    var promises = [];

    if (agency == null || agency == "") {
        agency = "OFAC";
    }
    agency = agency.toUpperCase();

    agencyView = agency;

    $("#icon").attr("href", "img/overruled.ico");

    analytics.addAnalytics();

    promises.push($.get("common/header.html"));


    promises[promises.length - 1].done(function (template) {
        $("#header").replaceWith(template);

        //custom dorpdowns
        document.querySelectorAll('.select-wrapper').forEach((element) => {
            element.addEventListener('click', function () {
                this.querySelector('.select').classList.toggle('open');
            });
        });

        $(".custom-option").on('click', function () {
            if (!this.classList.contains('selected')) {
                this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
                this.classList.add('selected');
                this.closest('.select').querySelector('.select__trigger span').textContent = this.textContent;
            }
        });
        window.addEventListener('click', function (e) {
            const select = document.querySelector('.select')
            const selectAll = document.querySelectorAll('.select');
            selectAll.forEach(element => {
                if (!element.contains(e.target)) {
                    element.classList.remove('open');
                }
            });
        });

        //hide news ticker on all pages except index
        setTimeout(() => {
            if (!['/', '/index.html'].includes(window.location.pathname)) {
                document.querySelector('.top-news-ticker').hidden = true
                document.querySelector('.page-title').style.top = '65px'
                document.querySelector('.tb-main').style.marginTop = '113px'
                document.querySelector('#tb_menu').style.top = '113px'
            }
        }, 100);

        //$(".primary, .primary-bg").addClass(agency.toLowerCase());
        document.documentElement.style.setProperty("--main", "var(--" + agency.toLowerCase() + ")");
        document.documentElement.style.setProperty("--main-rgb", "var(--" + agency.toLowerCase() + "-rgb)");

        var agencyItem = $("div[name=agencyOptions] .custom-option[data-value=" + agency + "]");
        $("div[name=agencyOptions] .custom-option").removeClass("selected");
        agencyItem.addClass("selected");

        $("#navSelectedPage").text(agencyItem[0].innerHTML);
        $("#searchSelectedPage").text(agencyItem[0].innerHTML);
        var logo = new Image();
        logo.src = "img/logo.png";
        logo.id = "logo_img";
        $("#logo_div").append(logo);
        $("#page-name").text(screenName);
    }).fail(function (err) {
        console.log("An error occurred while load the header:");
        console.log(err);
        });

    promises.push($.get("common/footer.html"));
    promises[promises.length - 1].done(function (template) {
        $("#footer").append(template);

    }).fail(function (err) {
        console.log("An error occurred while load the footer:");
        console.log(err);
    });

    promises.push($.get("common/" + agency.toLowerCase() + "sidenav.html"));
    
    promises[promises.length - 1].done(function (template) {

        $("#sidenav").replaceWith(template);
        nav.initializeNav();

        $("#search_input").on('keyup', function (e) {
            var keyCode = e.keyCode || e.which;
            if (keyCode == 13) {
                runSearch($(this).val());
            }
        });

        $("#search_link").click(function (e) {
            //kendo.ui.progress($("BODY"), true);

            e.preventDefault();
            runSearch($("#search_input").val());

        });


        $(".side-bar-right.sm-wide100 > .collapse").on("shown.bs.collapse", () => {
            if ($('BODY').width() <= 992) {
                $(".center-div").hide();
                if (!($(".side-bar-right.sm-wide100").hasClass("sm-show-toggle-buttons"))) {
                    $("sidebar-toggle-buttons.right").hide();
                }
            }
        });
        $(".side-bar-right.sm-wide100 > .collapse").on("hidden.bs.collapse", () => {
            if ($('BODY').width() <= 992) {
                if (!($(".side-bar-right.sm-wide100").hasClass("sm-show-toggle-buttons"))) {
                    $(".sidebar-toggle-buttons.right").hide();
                }
                $(".center-div").show();
            }
        });

        $(".side-bar-left.sm-wide100 > .collapse").on("shown.bs.collapse", () => {
            if ($('BODY').width() <= 992) {
                $(".center-div").hide();
                if (!($(".side-bar-left.sm-wide100").hasClass("sm-show-toggle-buttons"))) {
                    $("sidebar-toggle-buttons.left").hide();
                }
            }
        });
        $(".side-bar-left.sm-wide100 > .collapse").on("hidden.bs.collapse", () => {
            if ($('BODY').width() <= 992) {
                if (!($(".side-bar-left.sm-wide100").hasClass("sm-show-toggle-buttons"))) {
                    $(".sidebar-toggle-buttons.left").hide();
                }
                $(".center-div").show();
            }
        });
        vmSearch.getRecentSearches().done(function (data) {
            $("input[type=text][data-role=keywordSearch]").kendoAutoComplete({
                dataSource: {
                    data: data,
                    schema: {
                        type: "json",
                        model: {
                            fields: {
                                Keywords: { field: "Keywords", type: "string" }
                            }
                        }
                    }
                },
                filter: "contains",
            }).data("kendoAutoComplete");
        });

    }).fail(function (err) {
        console.log("An error occurred while loading the sidebar:");
        console.log(err);
    });

    Promise.all(promises).then(function (data) {
        prmHF.resolve();
    });

    return prmHF;
};

var loadCaseParametersTemplate = function (agency, targetDiv) {
    var prm = $.Deferred();
    $.get("common/" + agency.toUpperCase() + "CaseParameters.html").done(function (template) {
        $(targetDiv).html(template);

        prm.resolve();
    });

    return prm;
}


var loadCaseResultsTemplate = function (agency, targetDiv) {
    var prm = $.Deferred();
    $.get("common/" + agency.toUpperCase() + "CaseResults.html").done(function (template) {
        $(targetDiv).html(template);

        $("a[name=" + agency.toLowerCase()  + "ReturnToSearch").on("click", function () {
            $("#" + agency.toLowerCase() + "CaseDetails").slideUp(1000);
            $("#" + agency.toLowerCase() + "CaseResults").slideDown(1000);
            var offset = $('tr.k-state-selected').offset().top;

            if ($(window.top).height() < offset) {

                $('html, body').animate({
                    scrollTop: offset - 100
                }, 1000);
            }
        });

        prm.resolve();


    });

    return prm;
}

var loadOFACCaseResultsTemplate = function (targetDiv) {

    var prm = $.Deferred();
    $.get("common/OFACSanctionResults.html").done(function (template) {
        $(targetDiv).html(template);

        $("a[name=ofacReturnToSearch").on("click", function () {
            $("#ofacCaseDetails").slideUp(1000);
            $("#ofacCaseResults").slideDown(1000);
            var offset = $('tr.k-state-selected').offset().top;

            if ($(window.top).height() < offset) {

                $('html, body').animate({
                    scrollTop: offset - 100
                }, 1000);
            }
        });

        prm.resolve();


    });

    return prm;
};

var loadBISCaseResultsTemplate = function (targetDiv) {

    var prm = $.Deferred();
    $.get("common/BISSanctionResults.html").done(function (template) {
        $(targetDiv).html(template);

        $("a[name=bisReturnToSearch").on("click", function () {
            $("#bisCaseDetails").slideUp(1000);
            $("#bisCaseResults").slideDown(1000);
            var offset = $('tr.k-state-selected').offset().top;

            if ($(window.top).height() < offset) {

                $('html, body').animate({
                    scrollTop: offset - 100
                }, 1000);
            }
        });

        prm.resolve();


    });

    return prm;
};

var loadDDTCCaseResultsTemplate = function (targetDiv) {

    var prm = $.Deferred();
    $.get("common/DDTCSanctionResults.html").done(function (template) {
        $(targetDiv).html(template);

        $("a[name=bisReturnToSearch").on("click", function () {
            $("#bisCaseDetails").slideUp(1000);
            $("#bisCaseResults").slideDown(1000);
            var offset = $('tr.k-state-selected').offset().top;

            if ($(window.top).height() < offset) {

                $('html, body').animate({
                    scrollTop: offset - 100
                }, 1000);
            }
        });

        prm.resolve();


    });

    return prm;
};

var loadGuidanceDocumentResultsTemplate = function (targetDiv) {
    var prm = $.Deferred();
    $.get("common/GuidanceResults.html").done(function (template) {
        if (targetDiv != null) {
            $(targetDiv).html(template);
        }
        prm.resolve(template);
    });

    return prm;
};

var loadProjectionMatrixTemplate = function (targetDiv) {
    var prm = $.Deferred();
    $.get("common/ProjectionsMatrix.html").done(function (template) {
        if (targetDiv != null) {
            $(targetDiv).html(template);
        }
        prm.resolve(template);
    });

    return prm;
};

var loadFAQResultsTemplate = function (targetDiv) {
    var prm = $.Deferred();
    $.get("common/FAQResults.html").done(function (template) {
        if (targetDiv != null) {
            $(targetDiv).html(template);
        }
        prm.resolve(template);
    });

    return prm;
};

var loadSecondaryResultsTemplate = function (targetDiv) {
    var prm = $.Deferred();
    $.get("common/SecondaryResults.html").done(function (template) {
        if (targetDiv != null) {
            $(targetDiv).html(template);
        }
        prm.resolve(template);
    });

    return prm;
};

var loadCountryRiskListingTemplate = function (targetDiv) {
    var prm = $.Deferred();
    $.get("common/CountryRiskListing.html").done(function (template) {
        if (targetDiv != null) {
            $(targetDiv).html(template);
        }
        prm.resolve(template);
    });

    return prm;
}
function runSearch(searchTerm) {
    if (searchTerm.trim().length <= 3) {
        kendo.alert("Please enter search terms to continue.");
        return;
    }
    var agency;
    var agencyItem = $("#agencySearch .custom-option.selected");

    kendo.ui.progress($("BODY"), true);
    document.location.href = encodeURI("./search.html?a=" + agencyItem.data("value") + "&k=" + searchTerm.trim() + "&e=y");

}


var initiatializeSideBars = function () {
    $(".sidebar-toggle").click(function (e) {
        e.preventDefault();
        var btn = $(this);
        $(btn.attr("data-target")).toggleClass("toggled");
        btn.attr("aria-expanded", btn.attr("aria-expanded") == "true" ? "false" : "true");

    });
};

module.exports = {
    loadHeaderFooterCyber: loadHeaderFooterCyber,
    loadPageTemplate: loadPageTemplate,
    loadCaseResultsTemplate: loadCaseResultsTemplate,
    loadCaseParametersTemplate: loadCaseParametersTemplate,
    initiatializeSideBars: initiatializeSideBars,
    loadFAQResultsTemplate: loadFAQResultsTemplate,
    loadGuidanceDocumentResultsTemplate: loadGuidanceDocumentResultsTemplate,
    loadSecondaryResultsTemplate: loadSecondaryResultsTemplate,
    loadProjectionMatrixTemplate: loadProjectionMatrixTemplate,
    loadCountryRiskListingTemplate: loadCountryRiskListingTemplate
};
