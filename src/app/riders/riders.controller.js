(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('RidersController', RidersController);

    /** @ngInject */
    function RidersController($scope, $log, $rootScope, $interval, StaticDataService, ChartConfigService, PerformanceService, PerformanceHandler, RidersService, NgTableParams, ngTableEventsChannel, LiveService, $resource) {

        var vm = this

        function getRidersChart() {
            RidersService.getRiders({}, function (response) {
                vm.ridersData = JSON.parse(angular.toJson(response));
                //drawChart()
                drawDimpleMatrix()
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }

        getRidersChart()
        function drawDimpleMatrix() {
            var chart = {width: 500, height: 500}
         //   var dataset = [5, 10, 15, 20, 25];
            //   d3.select("#matrixChart").append("p").text("New paragraph!");
            var svg = dimple.newSvg("#matrixChart", 690, 500),
                data = [
                    {x: 10, y: 33, z: 32, s: "a"},
                    {x: 30, y: 6, z: 37, s: "b"},
                    {x: 40, y: 25, z: 52, s: "c"},
                    {x: 50, y: 42, z: 42, s: "d"}
                ]
            var myChart = new dimple.chart(svg, vm.ridersData);
            myChart.setBounds(90, 50, 580, 410)
            myChart.addCategoryAxis("x","week" );
            myChart.addCategoryAxis("y", "rider_reg");
            myChart.addSeries("week", dimple.plot.bar);
            myChart.addLegend(240, 10, 330, 20, "right");
            myChart.draw();
        }

        function drawChart() {
            var svg = d3.select("#matrixChart")
                .append("svg")
                .attr("width", chart.width)
                .attr("height", chart.height);
            var rect = svg.selectAll("rect")
                .data(vm.ridersData)
                .enter()
                .append("rect");
            rect.attr("x", function (d, i) {
                return (i * 50) + 25;
            })
                .attr("y", chart.height / 2)
                .attr("width", function (d) {
                    return d.week;
                })
                .attr("height", function (d) {
                    return d.rider_reg;
                })
                .attr("fill", "yellow")
                .attr("stroke", "orange")
            var xScale = d3.scale.linear()
                .domain([0, d3.max(vm.ridersData, function (d) {
                    return d.week;
                })])
                .range([0, chart.width]);
            var xScale = d3.scale.linear()
                .domain([0, d3.max(vm.ridersData, function (d) {
                    return d.rider_reg;
                })])
                .range([0, chart.height]);

            /*   var text = svg.selectAll("text")
             .data(dataset)
             .enter()
             .append("text")
             .text(function(d) {
             return d.week + "," + d.rider_reg;
             })*/
        }


    }
})();
