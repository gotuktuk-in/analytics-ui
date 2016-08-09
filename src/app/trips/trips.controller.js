(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('TripsController', TripsController);

    /** @ngInject */
    function TripsController($scope, $interval, StaticDataService, ChartConfigService, PerformanceService, NgTableParams, $stateParams, TripsService, $rootScope, PerformanceHandler) {

        var vm = this;
        var trips_heatmap
        var startDate, endDate;
        vm.ranges = StaticDataService.ranges
        $scope.tripDates = {};
        $scope.tripDates.startDate = StaticDataService.ranges['Last 7 Days'][0]//moment().subtract(1, 'days').format("YYYY-MM-DD");
        $scope.tripDates.endDate = StaticDataService.ranges['Last 7 Days'][1]//moment().subtract(1, 'days').format("YYYY-MM-DD");

        vm.timeFrequency = [{label: "Per Hour", value: "hour"}, {label: "Per Day", value: "day"}];
        vm.tripFrequency = {value: "day"};
        vm.config = ChartConfigService.lineChartConfig;
        vm.tripChartOptions = angular.copy(ChartConfigService.lineChartOptions);
        vm.tcashChartOptions = angular.copy(ChartConfigService.linePlusBarChartOptions);
        vm.tcashChartOptions.chart.xAxis= {
            rotateLabels: '-90',
            axisLabel: '',
                tickFormat: function(d) {
                var dx =  vm.tcashData[0].values[d] &&  vm.tcashData[0].values[d].x || 0;
                if (dx > 0) {
                    return d3.time.format('%d %b %y')(new Date(dx))
                }
                return null;
            }
        },
        vm.trips = [];
        vm.filterTerm = '';
        vm.filterFields = [{value: "id", name: "ID"},
            //{filed:"requestOn",title:"Date"},
            {value: "dname", name: "Driver Name"},
            {value: "dphone", name: "Driver Phone"},
            {value: "dvehicle", name: "Vehicle Number"},
            //      {value:"vehicleType",name:"Vehicle Type"},
            {value: "rname", name: "Rider Name"},
            {value: "rphone", name: "Rider Phone"},
            /* {value:"pickUp",name:"Pick Up"},
             {value:"drop",name:"Drop"},
             {value:"amount",name:"Amount"},
             {value:"riderFeedbackRating",name:"Rider Feedback Rating "}*/
        ]
        vm.statusCodes = ''
        vm.tripStatusFilters = [{name: 'All', value: "20,22,30,40,50,60,61,70,71,80,81,82"},
            {name: 'Fullfiled', value: "61"},
            {name: 'Cancelled ', value: '70,71'},
            {name: 'In Progress', value: '20,22,30,40,50,60'},
            {name: 'Failed', value: '80,81,82'},
        ]
        vm.searchTable = function () {
            $scope.tableParams.reload()
        }
        this.changeFrequency = function (section, freqModel) {
            console.log("Frequency changed ", freqModel.value)

            vm.tripChartOptions.chart.xAxis.axisLabel = freqModel
            if (freqModel == 'hour') {
                vm.tripChartOptions.chart.xAxis.tickFormat = function (d) {
                    return d3.time.format('%d %b %I %p')(new Date(d).addHours(1));
                };
            }
            else {
                vm.tripChartOptions.chart.xAxis.tickFormat = function (d) {
                    return d3.time.format('%d %b %y')(new Date(d));
                };
            }
            vm.getTrips()

        }
        vm.onDateChange = function () {
            vm.getTCash()
            vm.getTrips()
        }
        vm.getTCash = function () {
            TripsService.getTCash({
                city: $rootScope.city,
                startTime: $scope.tripDates.startDate,
                endTime: $scope.tripDates.endDate,
                vehicle: $rootScope.vehicleType
            }, {}, function (response) {
                //  PerformanceHandler.trips = response[0].trip
                vm.tcashData = transformTCash(response).map(function(series) {
                    series.values = series.values.map(function(d) { return {x: d[0], y: d[1] } });
                    return series;
                });;
                console.log('response ', vm.tcashData)
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
            //  $scope.tableParams.page(1)
            $scope.tableParams.reload();
        }
        function transformTCash(data) {
            var transformed = []
            data = angular.fromJson(data);
            var arr = ['tCash', 'Trip']

            var newObj = {}
            newObj.key = arr[0]
            newObj.values = []
            newObj.bar = true;
            for (var a = 0; a < data.length; a++) {
                var x = moment(PerformanceHandler.getLongDate(data[a].date)).unix()*1000
                newObj.values.push([x,data[a].tcash])
            }
            transformed.push(newObj);

            var newObj = {}
            newObj.key = arr[1]
            newObj.values = []
            for (var a = 0; a < data.length; a++) {
                var x = moment(PerformanceHandler.getLongDate(data[a].date)).unix()*1000
                newObj.values.push([x, data[a].trip])
            }
            transformed.push(newObj);

            return transformed
        }
       /* function transformTCash(data) {
            var transformed = []
            data = angular.fromJson(data);
            var arr = ['tCash', 'Trip']

            var newObj = {}
            newObj.key = arr[0]
            newObj.values = []
            for (var a = 0; a < data.length; a++) {
                var x = PerformanceHandler.getLongDate(data[a].date)
                newObj.values.push({x: x, y: data[a].tcash})
            }
            transformed.push(newObj);

            var newObj = {}
            newObj.key = arr[1]
            newObj.values = []
            for (var a = 0; a < data.length; a++) {
                var x = PerformanceHandler.getLongDate(data[a].date)
                newObj.values.push({x: x, y: data[a].trip})
            }
            transformed.push(newObj);

            return transformed
        }*/

        vm.getTrips = function () {
            PerformanceService.getTrips({
                city: $rootScope.city,
                startTime: $scope.tripDates.startDate,
                endTime: $scope.tripDates.endDate,
                count: 1,
                page: 1,
                rate: vm.tripFrequency.value
            }, {vehicle: $rootScope.vehicleType, frequency: vm.tripFrequency.value}, function (response) {
                //  PerformanceHandler.trips = response[0].trip
                vm.trips = PerformanceHandler.getTrips(response[0].trip)
                vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'Cancelled trips (by rider)'}));
                vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'Cancelled trips (by driver)'}));
                vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'tCash'}));
                trips_heatmap = response[0].trip;
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
            $scope.tableParams.page(1)
            $scope.tableParams.reload();
        }
        var sorting;

        function setDate() {

        }

        $scope.getTimeDiff = function (dt1, dt2) {
            if (dt1 == 0 || dt2 == 0) {
                return '0'
            }
            if (dt2) {
                var diff = (dt2 - dt1);
                return diff
            }
            else {
                return '0'
            }
        }
        $scope.tableParams = new NgTableParams({page: 1, count: 20}, {
            counts: [],
            getData: function (params) {
                // ajax request to api
                var start = ((params.page() - 1) * 10) + 1;
                console.log("**************************")
                var dataObj = {}
                dataObj.start = start;
                dataObj.count = params.count();
                dataObj.startDate = moment($scope.tripDates.startDate).startOf('day').unix();
                dataObj.endDate = moment($scope.tripDates.endDate).endOf('day').unix();

                if (params.orderBy().length > 0) {
                    var orderby = params.orderBy()[0].substr(0, 1);
                    dataObj.field = params.orderBy()[0].substr(1);
                    if (orderby === "+") {
                        dataObj.orderby = "ASC"
                    }
                    else {
                        dataObj.orderby = "DESC"
                    }
                }

                if (vm.searchTerm && vm.searchTerm != '') {
                    dataObj.term = vm.filterTerm.value + "|" + vm.searchTerm
                }
                if (vm.statusCodes.value != '') {
                    dataObj.filterByStatus = vm.statusCodes.value
                }
                return TripsService.getAllTrips(dataObj).$promise.then(function (data) {

                    params.total(data.total); // recal. page nav controls

                    if (data.data.length > 0) {
                        $scope.tblNoData = false
                    }
                    else {
                        $scope.tblNoData = true
                    }
                    return data.data;
                });
            }
        });
        vm.onDateChange()
        //var interval = $interval(function () {
        //    vm.getTrips()
        //    $scope.tableParams.reload()
        //}, 30000)
        vm.refreshPage = function () {
            vm.getTrips()
            $scope.tableParams.reload()
        }
        //$scope.$on('$destroy', function () {
        //    $interval.cancel(interval);
        //});
        heatmapChart(trips_heatmap);
    }
})();
var margin = {top: 50, right: 0, bottom: 100, left: 30},
    width = 960 - margin.left - margin.right,
    height = 430 - margin.top - margin.bottom,
    gridSize = Math.floor(width / 24),
    legendElementWidth = gridSize * 2,
    buckets = 9,
    colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"], // alternatively colorbrewer.YlGnBu[9]
    days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];
datasets = ["data.tsv", "data2.tsv"];

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dayLabels = svg.selectAll(".dayLabel")
    .data(days)
    .enter().append("text")
    .text(function (d) {
        return d;
    })
    .attr("x", 0)
    .attr("y", function (d, i) {
        return i * gridSize;
    })
    .style("text-anchor", "end")
    .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
    .attr("class", function (d, i) {
        return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis");
    });

var timeLabels = svg.selectAll(".timeLabel")
    .data(times)
    .enter().append("text")
    .text(function (d) {
        return d;
    })
    .attr("x", function (d, i) {
        return i * gridSize;
    })
    .attr("y", 0)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + gridSize / 2 + ", -6)")
    .attr("class", function (d, i) {
        return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis");
    });

var heatmapChart = function (tsvFile) {
    d3.tsv(tsvFile,
        function (d) {
            return {
                day: +d.day,
                hour: +d.hour,
                value: +d.value
            };
        },
        function (error, data) {
            var colorScale = d3.scale.quantile()
                .domain([0, buckets - 1, d3.max(data, function (d) {
                    return d.value;
                })])
                .range(colors);

            var cards = svg.selectAll(".hour")
                .data(data, function (d) {
                    return d.day + ':' + d.hour;
                });

            cards.append("title");

            cards.enter().append("rect")
                .attr("x", function (d) {
                    return (d.hour - 1) * gridSize;
                })
                .attr("y", function (d) {
                    return (d.day - 1) * gridSize;
                })
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("class", "hour bordered")
                .attr("width", gridSize)
                .attr("height", gridSize)
                .style("fill", colors[0]);

            cards.transition().duration(1000)
                .style("fill", function (d) {
                    return colorScale(d.value);
                });

            cards.select("title").text(function (d) {
                return d.value;
            });

            cards.exit().remove();

            var legend = svg.selectAll(".legend")
                .data([0].concat(colorScale.quantiles()), function (d) {
                    return d;
                });

            legend.enter().append("g")
                .attr("class", "legend");

            legend.append("rect")
                .attr("x", function (d, i) {
                    return legendElementWidth * i;
                })
                .attr("y", height)
                .attr("width", legendElementWidth)
                .attr("height", gridSize / 2)
                .style("fill", function (d, i) {
                    return colors[i];
                });

            legend.append("text")
                .attr("class", "mono")
                .text(function (d) {
                    return "? " + Math.round(d);
                })
                .attr("x", function (d, i) {
                    return legendElementWidth * i;
                })
                .attr("y", height + gridSize);

            legend.exit().remove();

        });
};

