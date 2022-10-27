"use strict";

require("@progress/kendo-ui/js/kendo.core.js");
require("@progress/kendo-ui/js/kendo.data.js");
require("@progress/kendo-ui/js/kendo.userevents.js");
require("@progress/kendo-ui/js/kendo.popup.js");
require("@progress/kendo-ui/js/kendo.tooltip.js");
require("@progress/kendo-ui/js/kendo.color.js");
require("@progress/kendo-ui/js/kendo.drawing.js");
require("@progress/kendo-ui/js/kendo.dataviz.js");
require("@progress/kendo-ui/js/kendo.fx.js");
require("@progress/kendo-ui/js/kendo.draganddrop.js");
require("@progress/kendo-ui/js/kendo.draganddrop.js");
require("@progress/kendo-ui/js/kendo.draganddrop.js");
require("@progress/kendo-ui/js/kendo.mobile.scroller.js");
require("@progress/kendo-ui/js/kendo.dataviz.map.js");

const mapConfig = require('../maps/worldmap.geo.json');

var markers = [
    { latlng: [1.3, 103.8], name: 'Singapore', code: 'SG', iso3: 'SGP', RiskTier: null},
    { latlng: [22.3193, 114.1694], name: 'Hong Kong', code: 'HK', iso3: 'HKG', RiskTier: null },
    { latlng: [21.1987, 111.5439], name: 'Macau', code: 'MO', iso3: 'MAC', RiskTier: null  },
    { latlng: [45.3453, 34.4997], name: 'Crimea', code: 'UC', iso3: 'UA-43', RiskTier: null  },
    { latlng: [-4.679, 55.4920], name: 'Seychelles', code: 'SC', iso3: 'SYC', RiskTier: null  },

];

var legendTemplate = null;

var sanctionRiskMap = function (targetDiv, countryData) {
    
    var scale = [
        '#f8e4a0', '#f8d490', '#f9c480', '#fab470', '#faa460', '#fb9450',
        '#fc843f', '#fc742f', '#fd641f', '#fe540f', '#ff4500'
    ];

    return riskMap(targetDiv, countryData, scale);

};


var exportRiskMap = function (targetDiv, countryData) {
    var scale = [
        '#f8e4a0', '#f7da8d', '#f6cf7a', '#f6c369', '#f7b758', '#f7ab47',
        '#f99e38', '#fa9029', '#fb801b', '#fd700e', '#fe5d03', '#ff4500'
    ];
    return riskMap(targetDiv, countryData, scale);
};


var overallRiskMap = function (targetDiv, countryData) {
    var scale = [
        '#f8e4a0', '#f7da8d', '#f6cf7a', '#f6c369', '#f7b758', '#f7ab47',
        '#f99e38', '#fa9029', '#fb801b', '#fd700e', '#fe5d03', '#ff4500'
    ];
    return riskMap(targetDiv, countryData, scale);
};

var ofacSanctionsMap = function (jqTargetDiv, countryData) {
    var max = 0;
    var countryLegend = [];

    var scale = [
        '#f8e4a0', '#ff4500'
    ];


    countryData.forEach(function (c) {

        countryLegend[c.CountryCode] = c.RiskTier;
        if (countryLegend[c.CountryCode] > max) {
            markerLegend.push(ctry.RiskTier);
        }
    });

    var markerLegend = [];
    markers.forEach(function (itm) {
        var ctry = countryData.find(c => c.CountryCode == itm.code);
        if (ctry != null) {
            markerLegend.push(countryData[itm.code]);
        }

    });
    var map = jqTargetDiv.vectorMap({
        map: 'world_mill',
        markers: markers,
        zoomMin: 1.0,
        zoomMax: 6.0,
        focusOn: {
            x: 0.5,
            y: 0.5,
            scale: 1.3
        },
        initial: {
            fill: 'white',
            "fill-opacity": 1,
            stroke: 'none',
            "stroke-width": 0,
            "stroke-opacity": 1
        },
        markerStyle: {
            initial: {
                r: 3
            },
            hover: {
                "fill-opacity": 0.8,
                "stroke-width": 1,
                cursor: 'arrow'
            }
        },
        series: {
            regions: [{
                scale: scale,
                attribute: 'fill',
                values: countryLegend,
                min: 1,
                max: max,
                legend: {
                    horizontal: true,
                    title: 'OFAC Sanctions'
                }
            }],
            markers: [{
                scale: scale,
                attribute: 'fill',
                values: markerLegend,
                min: 0,
                max: 10,
            }]
        },
        onRegionTipShow: function (e, el, code) {
            el.html(el.html() + ' - ' + (countryLegend[code] ? countryLegend[code] : '0') + ' Sanctions');
        },
        onMarkerTipShow: function (e, el, index) {
            el.html(el.html() + ' - ' + (countryLegend[markers[index].code] ? countryLegend[markers[index].code] : '0') + ' Sanctions');
        },
    }).vectorMap('get', 'mapObject');

    var ticks = jqTargetDiv.find(".jvectormap-legend-tick-text");
    ticks.text("");
    ticks.css("white-space", "nowrap");
    ticks.first().text("Fewer");
    ticks.last().text("More");
    ticks.last().css("direction", "rtl");

    map.updateSize();

    return map;
};

function riskMap(targetDiv, countryData, scale) {
    var localMapConfig = JSON.parse(JSON.stringify(mapConfig));

    localMapConfig.features.forEach(function (f) {
        var ctry = countryData.find(c => c.ISO3Code == f.properties.iso_a3);
        if (ctry != null) {
            f.properties.name = ctry.CountryName;
            f.properties.RiskTier = ctry.RiskTier;
        }
    });

    markers.forEach(function (itm) {
        var ctry = countryData.find(c => c.CountryCode == itm.code);
        if (ctry != null) {
            itm.RiskTier = ctry.RiskTier;
        }
    });

    var map = targetDiv.kendoMap({
        center: [30, 0],
        zoom: 2.0,
        minZoom: 1.5,
        maxZoom: 5.0,
        wraparound: true,
        layers: [{
            type: "shape",
            dataSource: {
                type: "geojson",
                transport: {
                    read: function (o) {
                        o.success(localMapConfig);
                    }
                }
            },
            style: {
                stroke: {
                    color: "#fff",
                    width: 2,
                    opacity: 0.5
                }
            },
            tooltip: {
                width: 120,
            }
        },
        {
            type: "marker",
            tooltip: {
                template: "#= marker.dataItem.name #<br/>Risk Level #= marker.dataItem.RiskTier#",
                width: 120
            },
            dataSource: {
                data: markers
            },
            locationField: "latlng",
            titleField: "name",
            shape: "mapMarker",
        }],
        shapeCreated: function (e) {
            var shape = e.shape;
            shape.options.fill.set("color", scale[shape.dataItem.properties.RiskTier]);

        },
        shapeFeatureCreated: function (e) {
            e.group.options.tooltip = {
                content: e.properties.name + "<br/>Risk Level " + e.properties.RiskTier,
                position: "cursor",
                offset: 10,
                width: 120,
            };
        },
        markerActivate: function (e) {
            $(e.marker.element).css("background-color", scale[e.marker.dataItem.RiskTier]);
            //, "THE NEW COLOR")
        }
    }).data("kendoMap");

    var legendDef = [];
    var text;
    for (var cnt = 0; cnt < scale.length; cnt++) {

        if (cnt == 0) {
            text = "Lower Risk";
        } else {
            if (cnt == (scale.length - 1)) {
                text = "Higher Risk";
            } else {
                text = "";
            }
        }
        legendDef.push({ Background: scale[cnt], Text: text });
    }
    appendLegend(targetDiv, "Overruled Risk Index", legendDef);
    return map;
}

function appendLegend(targetDiv, legendTitle, legendItems) {
    var prmLegendTemplate = jQuery.Deferred();
    if (legendTemplate == null) {
        prmLegendTemplate = $.get("common/MapLegend.html");
    } else {
        prmLegendTemplate.resolve(legendTemplate);
    }

    prmLegendTemplate.done(function (template) {
        legendTemplate = template;
        if (targetDiv != null) {
            targetDiv.append(legendTemplate.replace("LEGENDTTILE", legendTitle));
            var container = targetDiv.find(".map-legend-inner");
            legendItems.forEach(function (itm) {
                container.append('<div class="map-legend-tick">'
                    + '<div class="map-legend-tick-sample" style="background: ' + itm.Background + ';"></div>'
                    + '<div class="map-legend-tick-text" style="white-space: nowrap;">' + itm.Text + '</div>'
                    + '</div>');
            });
            container.append('<div style="clear: both;"></div>');

            container.find(".map-legend-tick-text:last").css("direction", "rtl");
        }
    });
};

module.exports = {
    sanctionRiskMap: sanctionRiskMap,
    exportRiskMap: exportRiskMap,
    overallRiskMap: overallRiskMap,
    ofacSanctionsMap: ofacSanctionsMap
}