"use strict";

var vmSearch = require("./../viewmodel/vm_search");
var nav = require("./../util/nav");
var lookups = require("./../viewmodel/vm_lookups");
var analytics = require("./../util/analytics");
var evt = require('events');

import "@progress/kendo-ui/js/kendo.ui.core";
import "./../../css/bootstrap.css";

import '@progress/kendo-ui/css/web/kendo.common.min.css';
import '@progress/kendo-theme-default/dist/all.css';
import "font-awesome/css/font-awesome.min.css";

import "./../../css/tradebase-ui.css";
import "./../../css/tradebase.css";
import "./../../css/akin-brand.css";

import header from './../../html/common/header.html';
import footer from './../../html/common/footer.html';


class HeaderFooter {
    constructor(agency = "OFAC", screenName) {

        this.agency = agency.toUpperCase();
        this.events = new evt.EventEmitter();

        this.config = require('./../util/configuration');

    }

    applyPageTemplate(screenName = "") {
        var sender = this;

        var prmHF = $.Deferred();
        var promises = [];

        $("#icon").attr("href", "img/overruled.ico");

        analytics.addAnalytics();

        $("#header").replaceWith(header);

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


        //$(".primary, .primary-bg").addClass(agency.toLowerCase());
        document.documentElement.style.setProperty("--main", "var(--" + sender.agency.toLowerCase() + ")");
        document.documentElement.style.setProperty("--main-rgb", "var(--" + sender.agency.toLowerCase() + "-rgb)");

        var agencyItem = $("div[name=agencyOptions] .custom-option[data-value=" + sender.agency + "]");
        $("div[name=agencyOptions] .custom-option").removeClass("selected");
        agencyItem.addClass("selected");

        $("#navSelectedPage").text(agencyItem[0].innerHTML);
        $("#searchSelectedPage").text(agencyItem[0].innerHTML);
        var logo = new Image();
        logo.src = "img/logo.png";
        logo.id = "logo_img";
        $("#logo_div").append(logo);
        $("#page-name").text(screenName);

        $("#footer").append(footer);


        //$.get("common/" + this.agency.toLowerCase() + "sidenav.html"));
        promises.push(import("./../../html/common/" + this.agency.toLowerCase() + "sidenav.html"));
        
        promises[promises.length - 1].then(function (sidenav) {
            $("#sidenav").replaceWith(sidenav.default);
            nav.initializeNav();

            $("#search_input").on('keyup', function (e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode == 13) {
                    sender.runSearch($(this).val());
                }
            });

            $("#search_link").click(function (e) {
                //kendo.ui.progress($("BODY"), true);

                e.preventDefault();
                sender.runSearch($("#search_input").val());

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

        },function (err) {
            console.log("An error occurred while loading the sidebar:");
            console.log(err);
        });

        Promise.all(promises).then(function (data) {


            //hide news ticker on all pages except index
            setTimeout(() => {

                if (![sender.config.tradebaseClient.toLowerCase() + '/', sender.config.tradebaseClient.toLowerCase() + '/index.html'].includes(window.location.pathname.toLowerCase())) {
                    document.querySelector('.top-news-ticker').hidden = true
                    document.querySelector('.page-title').style.top = '65px'
                    document.querySelector('.tb-main').style.marginTop = '105px'
                    document.querySelector('#tb_menu').style.top = '113px'
                }
            }, 100);

            prmHF.resolve();
        });

        return prmHF;
    }

    setLastDataUpdateDate(recordType = "ALL") {
        lookups.getLatestRecordUpdate(this.agency, recordType).done(function (lu) {
            $("#pageLastUpdate").text("Last updated " + kendo.toString(new Date(lu), "MMMM dd, yyyy"));
        });
    }

    runSearch(searchTerm) {
        if (searchTerm.trim().length <= 2) {
            kendo.alert("Please enter search terms to continue.");
            return;
        }
        var agency;
        var agencyItem = $("#agencySearch .custom-option.selected");

        kendo.ui.progress($("BODY"), true);
        document.location.href = encodeURI("./search.html?a=" + agencyItem.data("value") + "&k=" + searchTerm.trim() + "&e=y");

    }

}


export default HeaderFooter;