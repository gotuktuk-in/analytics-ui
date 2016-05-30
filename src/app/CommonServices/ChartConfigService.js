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
        factory.lineChartOptions = {
            chart: {
                 type: 'lineChart',
                height: '400',
                legend: {
       				 vers: 'classic',
       				 //padding: { top: 20 },
       				 maxKeyLength:400,
       				margin : {
                    top: 20,
                    right: 50,
                    bottom: 50,
                    left: 50
                }
     			 },
      			legendPosition: 'top',
                margin : {
                    top: 50,
                    right: 50,
                    bottom: 100,
                    left: 80
                },
                x: function(d){
                    return d[0];
                },
              //  y: function(d){ return d[1]/100; },
                y: function(d){
                    return d[1];
                },
             //   average: function(d) { return d.mean/100; },

                color: d3.scale.category10().range(),
                duration: 300,
                useInteractiveGuideline: true,
                clipVoronoi: false,
                showYAxis:true,
                xAxis: {
                    tickSize:'10',
                    axisLabel: 'Per Hour',
                     rotateLabels: '-90',
                    tickFormat: function(d) {
                     //   return d3.time.format('%d %B %y')(new Date(d))
                        return d3.time.format('%I %p')(new Date(d))
                    },

                    showMaxMin: true,
                    staggerLabels: false,
                    axisLabelDistance: 200
                },
                x2Axis: {
                    axisLabel: 'Date',
                    tickFormat: function(d) {
                        //   return d3.time.format('%d %B %y')(new Date(d))
                        return d3.time.format('%I %p')(new Date(d))
                    },

                    showMaxMin: true,
                    staggerLabels: false
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
