"use strict";

var vmSDN = require("./../../viewmodel/vm_reports");;
var utility = require("./../../util/utility");
var templates = require("./../../util/templates");

require('jvectormap-next')($);
require("./../../../../node_modules/jvectormap-next/jquery-jvectormap.css");
require("./../../util/jvectormap-world-mill.js");

//require("bootstrap");
$(document).ready(function () {
    kendo.ui.progress($("BODY"), true);

    templates.loadPageTemplate("SDN Heat Map").done(function () {


        var max = 0;
        var countryLegend = [];

        var promises = [];
        var countryList;
        promises.push(jQuery.Deferred());

        vmSDN.getCountryList().done(function (data) {
            countryList = data;
            promises[0].resolve();
        }).fail(function (e) {
            kendo.alert("An error occurred while loading the map data.");
            promises[0].reject();
            });

        Promise.all(promises).then(
            function () {

                if (countryList.length == 0 && nonCountryProgramsList.length == 0) {
                    return;
                }
                var max = 500;

                for (const c in countryList) {
                    //countryLegend[c] = countryList[c];
                    countryLegend[c] = (Math.round(countryList[c] / 50) * 50) + 1;
                    if (countryLegend[c] > max) {
                        //max = countryLegend[c];
                        countryLegend[c] = max;
                    }
                }
                
                var map = $('#worldMap').vectorMap({
                    map: 'world_mill',
                     zoomMin: 1.0,
                    zoomMax: 6.0,
                    focusOn: {
                        x: 0.5,
                        y: 0.5,
                        scale: 1.6
                    },
                    series: {
                        regions: [{
                            //scale: ['#ffffcc', '#b32400'],
                            //scale: ['#e3612b', '#a22922'], //from yellow to maroon, like the corruption index
                            scale: ['#f8e4a0', '#f2ca45', '#e3612b', '#a22922'], //from yellow to maroon, like the corruption index
                            
                            //scale: ['#f8e4a0', '#FF4500'], //from yellow to akin cayenne
                            normalizeFunction: 'polynomial',
                            attribute: 'fill',
                            values: countryLegend,
                            min: 1  ,
                            max: max,
                            legend: {
                                horizontal: true,
                                title: '# of SDN Addresses'
                            }
                        }]
                    },
                    onRegionTipShow: function (e, el, code) {
                        el.html(el.html() + ' - ' + (countryLegend[code] ? countryList[code] : '0') + ' SDNs');
                    },

                }).vectorMap('get', 'mapObject');
                
                
                $("div.main-content").show();
                map.updateSize();

                //update the legend manually to
                //-set the low nmber to 1
                //-set the high number to max+
                //-left align text
                //-add gradient coloring

                $(".jvectormap-legend-tick-text:first").text(1);
                $(".jvectormap-legend-tick-text:last").text($(".jvectormap-legend-tick-text:last").text() + "+");
                $(".jvectormap-legend-tick-text").addClass("left-align");
                var legend = $(".jvectormap-legend-tick-sample");
                $(".jvectormap-legend-tick-sample").each(function (i) {
                    //$(legendtext[i]).addClass("left-align");
                    if (i < legend.length - 1) {
                        var t = $(this);
                        var next = $(legend[i + 1]);
                        var nextText = $(legend[i + 1]);

                        t.css("background-image", "linear-gradient(to right, " + t.css("background-color") + ", " + next.css("background-color"));
                    }
                });
            });



    }).then(function () {



        $(".main-content").show();
        kendo.ui.progress($("BODY"), false);
    });


});

