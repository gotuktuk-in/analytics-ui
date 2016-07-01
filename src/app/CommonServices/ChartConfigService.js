/**
 * Created by dell on 24-05-2016.
 */

'use strict';

/*
 This Service will hold the chart configuration for D3 charts
 */

angular
    .module('tuktukV2Dahboard')
    .factory('ChartConfigService', ChartConfigService)

function ChartConfigService($q, $resource, API, PerformanceHandler) {
    var factory = {}
    Date.prototype.addHours = function (h) {
        this.setHours(this.getHours() + h);
        return this;
    }
    factory.lineChartConfig = {refreshDataOnly: false}
    factory.lineChartOptions = {
        chart: {
            type: 'lineChart',
            height: '400',
            zoom: {
                enabled: true
            },
            interpolate: 'basis',
            legend: {
                vers: 'classic',
                maxKeyLength: 400,
                margin: {
                    top: 5,
                    right: 15,
                    bottom: 20,
                    left: 50
                }
            },
            legendPosition: 'top',
            margin: {
                top: 0,
                right: 20,
                bottom: 100,
                left: 50
            },
            x: function (d) {
                return d[0];
            },
            //  y: function(d){ return d[1]/100; },
            y: function (d) {
                return d[1];
            },
            //   average: function(d) { return d.mean/100; },

            color: d3.scale.category10().range(),
            duration: 300,
            useInteractiveGuideline: true,
            clipVoronoi: false,
            showYAxis: true,
            xAxis: {
                tickSize: '10',
                // axisLabel: 'Per Hour',
                rotateLabels: '-90',
                tickFormat: function (d) {
                    //   return d3.time.format('%d %B %y')(new Date(d))
                    return d3.time.format('%d %b %I %p')(new Date(d))
                },

                showMaxMin: true,
                staggerLabels: false,
                axisLabelDistance: 0
            },
            x2Axis: {
                axisLabel: 'Date',
                tickFormat: function (d) {
                    //   return d3.time.format('%d %B %y')(new Date(d))
                    return d3.time.format('%I %p')(new Date(d))
                },

                showMaxMin: true,
                staggerLabels: false
            },

            yAxis: {
                axisLabel: 'Trips',
                tickFormat: function (d) {
                    return d3.round(d);
                    // return d3.format(',.1%')(d);
                },
                showMaxMin: true,
                axisLabelDistance: 200
            }
        }
    };
    factory.discreteBarChartOptions = {
        chart: {
            type: 'discreteBarChart',
            height: 450,
            zoom: {
                enabled: true
            },
            margin: {
                top: 30,
                right: 50,
                bottom: 100,
                left: 55
            },
            x: function (d) {
                return d.label;
            },
            //    y: function(d){return d.value + (1e-10);},
            y: function (d) {
                return d.value
            },
            showValues: true,
            valueFormat: function (d) {
                return d3.round(d);
                //  return d3.format(',.4f')(d);
            },
            duration: 500,
            xAxis: {
                axisLabel: '',
                rotateLabels: '-90'
            },
            yAxis: {
                axisLabel: '',
                axisLabelDistance: -10
            }
        }
    }
    factory.multiBarChartOptions = {
        chart: {
            type: 'multiBarChart',
            height: 400,
            margin: {
                top: 30,
                right: 50,
                bottom: 100,
                left: 55
            },
            text: 'Credit Recovery',
            x: function (d) {
                return d.x;
            },
            y: function (d) {
                return d.y;
            },
            stacked: true,
            showControls:false,
            clipEdge: true,
            transitionDuration: 1000,
            useInteractiveGuideline: false,
            //   xScale : d3.time.scale(), // <-- explicitly set time scale
            xAxis: {
                rotateLabels: '-90',
                ticks: d3.time.months, // <-- add formatter for the ticks
                tickFormat: function (d) {
                    //return d3.time.format('%d-%m-%Y')(new Date(d))
                    //return d3.time.format('%I %p')(new Date(d))
                    return d3.time.format('%d %b %y')(new Date(d));
                },
                showMaxMin: false
            },

            yAxis: {
                tickFormat: function (d) {
                    return d;
                }
            },

        }

    };
    factory.linePlusBarChartOptions = {
        chart: {
            type: 'linePlusBarChart',
            height: 400,
            focusEnable:false,
            margin: {
                top: 30,
                right: 75,
                bottom: 100,
                left: 75
            },
            bars: {
                forceY: [0]
            },
            color: ['#ff7f0e', '#e377c2'],
            x: function(d,i) { return i },
            xAxis: {
                rotateLabels: '-90',
                axisLabel: '',
                tickFormat: function(d) {
                    var dx = $scope.data[0].values[d] && $scope.data[0].values[d].x || 0;
                    if (dx > 0) {
                        return d3.time.format('%x')(new Date(dx))
                    }
                    return null;
                }
            }

        }
    };

    return factory
}
