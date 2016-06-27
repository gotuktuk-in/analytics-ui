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

function ChartConfigService($q, $resource, API) {
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
                axisLabelDistance: 200,
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
            margin: {
                top: 20,
                right: 20,
                bottom: 80,
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
            height: 450,
            margin: {
                top: 20,
                right: 20,
                bottom: 45,
                left: 45
            },
            clipEdge: true,
            duration: 500,
            stacked: true,
            xAxis: {
                axisLabel: 'Date',
                showMaxMin: false,
                tickFormat: function (d) {
                    return d3.time.format('%d %b')(new Date(d*1000))
                   // return d3.time.format('%d %b %I %p')(new Date(d))
                  //  return d3.format(',f')(d);
                }
            },
            yAxis: {
                axisLabel: 'Y Axis',
                axisLabelDistance: -20,
                tickFormat: function (d) {
                    return d3.format(',.1f')(d);
                }
            }
        }
    };

    return factory
}
