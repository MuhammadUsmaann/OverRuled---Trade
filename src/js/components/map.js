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
require("@progress/kendo-ui/js/kendo.mobile.scroller.js");
require("@progress/kendo-ui/js/kendo.dataviz.map.js");


import mapLegendTemplate from './../../html/common/MapLegend.html';

class Map {
    #smallCountryMarkers = [
        { latlng: [1.3, 103.8], name: 'Singapore', code: 'SG', iso3: 'SGP', RiskTier: null },
        { latlng: [22.3193, 114.1694], name: 'Hong Kong', code: 'HK', iso3: 'HKG', RiskTier: null },
        { latlng: [21.1987, 111.5439], name: 'Macau', code: 'MO', iso3: 'MAC', RiskTier: null },
        { latlng: [45.3453, 34.4997], name: 'Crimea', code: 'UC', iso3: 'UA-43', RiskTier: null },
        { latlng: [-4.679, 55.4920], name: 'Seychelles', code: 'SC', iso3: 'SYC', RiskTier: null },

    ];

    #legendTemplate;
    
    constructor (container){
        this.container = $(container);
    }

    sanctionWorldRiskMap(riskData) {
        var scale = [
            '#f8e4a0', '#f7da8d', '#f6cf7a', '#f6c369', '#f7b758', '#f7ab47',
            '#f99e38', '#fa9029', '#fb801b', '#fd700e', '#fe5d03', '#ff4500'
        ];

        return this.#worldRiskMap(riskData, scale);
    }

    exportWorldRiskMap(riskData) {
        var scale = [
            '#f8e4a0', '#f7da8d', '#f6cf7a', '#f6c369', '#f7b758', '#f7ab47',
            '#f99e38', '#fa9029', '#fb801b', '#fd700e', '#fe5d03', '#ff4500'
        ];
        return this.#worldRiskMap(riskData, scale);
    }

    overallWorldRiskMap(riskData) {
        var scale = [
            '#f8e4a0', '#f7da8d', '#f6cf7a', '#f6c369', '#f7b758', '#f7ab47',
            '#f99e38', '#fa9029', '#fb801b', '#fd700e', '#fe5d03', '#ff4500'
        ];
        return this.#worldRiskMap(riskData, scale);
    }

    #worldRiskMap(riskData, scale) {
        var prm = jQuery.Deferred();
        import("./../../rsc/Maps/worldmap.geo.json").then((mapConfig) => {
            mapConfig.features.forEach(function (f) {
                var ctry = riskData.find(c => c.ISO3Code == f.properties.iso_a3);
                if (ctry != null) {
                    f.properties.name = ctry.CountryName;
                    f.properties.RiskTier = ctry.RiskTier;
                }
            });

            var countryMarkers = this.#smallCountryMarkers.map(a => ({ ...a }));
            countryMarkers.forEach(function (itm) {
                var ctry = riskData.find(c => c.CountryCode == itm.code);
                if (ctry != null) {
                    itm.RiskTier = ctry.RiskTier;
                }
            });

            var map = this.container.kendoMap({
                center: [30, 0],
                zoom: 1.7,
                minZoom: 1.5,
                maxZoom: 5.0,
                wraparound: false,
                layers: [{
                    type: "shape",
                    dataSource: {
                        type: "geojson",
                        transport: {
                            read: function (o) {
                                o.success(mapConfig);
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
                        data: countryMarkers
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
            this.#appendLegend("Overruled Risk Index", legendDef);
            prm.resolve(map);
        });

        return prm;
    }

    #appendLegend(legendTitle, legendItems) {
        this.container.append(mapLegendTemplate.replace("LEGENDTTILE", legendTitle));
        var legendContainer = this.container.find(".map-legend-inner");
        legendItems.forEach(function (itm) {
            legendContainer.append('<div class="map-legend-tick">'
                + '<div class="map-legend-tick-sample" style="background: ' + itm.Background + ';"></div>'
                + '<div class="map-legend-tick-text" style="white-space: nowrap;">' + itm.Text + '</div>'
                + '</div>');
        });
        legendContainer.append('<div style="clear: both;"></div>');

        legendContainer.find(".map-legend-tick-text:last").css("direction", "rtl");

    }
}

export default Map;