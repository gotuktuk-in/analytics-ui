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
        factory.lineChartConfig ={refreshDataOnly: false}
        factory.cumulativeLineChartOptions = {
            chart: {
                type: 'lineChart',
            //    forceY : [0, 5],
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 65
                },
                x: function(d){ return d[0]; },
              //  y: function(d){ return d[1]/100; },
                y: function(d){return d[1]; },
             //   average: function(d) { return d.mean/100; },

                color: d3.scale.category10().range(),
                duration: 300,
                useInteractiveGuideline: true,
                clipVoronoi: false,
                showYAxis:true,
                xAxis: {
                    axisLabel: 'Date',
                    tickFormat: function(d) {
                        console.log("d ", d)
                     //   return d3.time.format('%d %B %y')(new Date(d))
                        return d3.time.format('%I %p')(new Date(d))
                    },
                    showMaxMin: true,
                    staggerLabels: true
                },

                yAxis: {
                    axisLabel: 'Trips',
                    tickFormat: function(d){
                        return d;
                       // return d3.format(',.1%')(d);
                    },
                    showMaxMin: true,
                    axisLabelDistance: 200
                }
            }
        };

    return factory
}
