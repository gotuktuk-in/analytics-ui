/**
 * Created by dell on 24-05-2016.
 */

'use strict';

/*
 This Service will hold the chart configuration for D3 charts
 */

angular
    .module('tuktukV2Dahboard')
    .factory('ChartConfigService', ChartConfigService);

function ChartConfigService($q, $resource, API, PerformanceHandler) {
    var factory = {};
    var vm = this;
    Date.prototype.addHours = function (h) {
        this.setHours(this.getHours() + h);
        return this;
    };
    factory.lineChartConfig = {refreshDataOnly: false};
    factory.lineChartOptions = {
        chart: {
            type: 'lineChart',
            height: 455,
            //xDomain: [0,100],
            zoom: {
                enabled: true
            },
            interpolate: 'basis',
            legend: {
                vers: 'classic',
                maxKeyLength: 400,
                margin: {
                    top: 5,
                    right: 0,
                    bottom: 30,
                    left: 0
                },
                dispatch: {
                    legendClick:
                        function (t,u){

                        },
                    legendDblClick:
                        function (t,u){

                        }
                    }
            },
            legendPosition: 'top',
            margin: {
                top: 0,
                right: 20,
                bottom: 120,
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
                rotateLabels: '-90',
                tickFormat: function (d) {
                    return d3.time.format('%d %b %I %p')(new Date(d))
                },

                showMaxMin: true,
                staggerLabels: false,
                axisLabelDistance: 10
            },
            x2Axis: {
                axisLabel: 'Date',
                tickFormat: function (d) {
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
            legend: {
                vers: 'classic',
                maxKeyLength: 400,
                margin: {
                    top: 5,
                    right: 0,
                    bottom: 30,
                    left: 0
                }
            },
            legendPosition: 'top',
            margin: {
                top: 30,
                right: 50,
                bottom: 180,
                left: 55
            },
            x: function (d) {
                return d.label
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
                axisLabelDistance: -10,
                tickFormat: function (d) {
                    return d3.round(d);
                }
            }
        }
    };
    factory.multiBarChartOptions = {
        chart: {
            type: 'multiBarChart',
            height: 450,
            margin: {
                top: 30,
                right: 50,
                bottom: 100,
                left: 55
            },
            legend: {
                vers: 'classic',
                maxKeyLength: 400,
                margin: {
                    top: 5,
                    right: 0,
                    bottom: 30,
                    left: 0
                }
            },
            legendPosition: 'top',
            text: '',
            x: function (d) {
                return d.x;
            },
            y: function (d) {
                return d.y;
            },
            stacked: true,
            showControls: false,
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
                    return d3.round(d);
                }
            }

        }

    };
    factory.linePlusBarChartOptions = {
        chart: {
            type: 'linePlusBarChart',
            height: 465,
            focusEnable: false,
            legend: {
                vers: 'classic',
                maxKeyLength: 400,
                margin: {
                    top: 5,
                    right: 100,
                    bottom: 30,
                    left: 0
                }
            },
            legendPosition: 'left',
            margin: {
                top: 30,
                right: 75,
                bottom: 20,
                left: 75
            },
            bars: {
                forceY: [0]
            },
            color: ['#ff7f0e', '#e377c2'],
            x: function (d, i) {
                return i
            },
            xAxis: {
                rotateLabels: '-90',
                axisLabel: '',
                tickFormat: function (d) {
                    var dx = $scope.data[0].values[d] && $scope.data[0].values[d].x || 0;
                    if (dx > 0) {
                        return d3.time.format('%x')(new Date(dx))
                    }
                    return null;
                }
            }

        }
    };
    factory.pieChartOptions = {
        chart: {
            type: 'pieChart',
            height: 410,
            x: function (d) {
                return d.label;
            },
            y: function (d) {
                return (d.value);
            },
            valueFormat: function (d) {
                return d3.format(',.0f')(d);
            },
            showValues: true,
            showLabels: false,
            duration: 500,
            labelThreshold: 0,
            labelSunbeamLayout: true,
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            legend: {
                maxKeyLength: 400,
                margin: {
                    top: 5,
                    right: 5,
                    bottom: 5,
                    left: 0
                }
            }
        }
    };
    return factory;
}
