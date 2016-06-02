(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('PerformanceController', PerformanceController);

    /** @ngInject */
    function PerformanceController($scope, StaticDataService, ChartConfigService, $stateParams, $rootScope, PerformanceService, PerformanceHandler) {

        var vm = this;

        var startDate, endDate;
        vm.ranges = StaticDataService.ranges
        $scope.tripDates = {};
        $scope.tripDates.startDate = moment().subtract(1, 'days').format("YYYY-MM-DD");
        $scope.tripDates.endDate = moment().subtract(1, 'days').format("YYYY-MM-DD");

        $scope.driverDates = angular.copy($scope.tripDates)
        $scope.riderDates = angular.copy($scope.tripDates)
        vm.timeFrequency = [{label: "Per Hour", value: "hour"}, {label: "Per Day", value: "day"}];
        vm.tripFrequency = {value:"hour"};
        vm.driverFrequency = {value:"hour"};
        vm.riderFrequency = {value:"hour"};
        vm.config = ChartConfigService.lineChartConfig;
        vm.tripChartOptions = angular.copy(ChartConfigService.lineChartOptions);
        vm.driverChartOptions = angular.copy(ChartConfigService.lineChartOptions);
        vm.riderChartOptions = angular.copy(ChartConfigService.lineChartOptions);
        vm.trips = [];
        vm.drivers = [];
        vm.riders = [];

        this.changeFrequency = function (section, freqModel) {
            console.log("Frequency changed ", freqModel.value)
            switch(section) {
                case 'driver':
                    vm.driverChartOptions.chart.xAxis.axisLabel = freqModel
                    if (freqModel == 'hour') {
                        vm.driverChartOptions.chart.xAxis.tickFormat = function (d) {
                            return d3.time.format('%I %p')(new Date(d));
                        };
                    }
                    else {
                        vm.driverChartOptions.chart.xAxis.tickFormat = function (d) {
                            return d3.time.format('%d %b %y')(new Date(d));
                        };
                    }
                    vm.getDrivers()

                    break;
                case 'rider':
                    vm.riderChartOptions.chart.xAxis.axisLabel = freqModel
                    if (freqModel == 'hour') {
                        vm.riderChartOptions.chart.xAxis.tickFormat = function (d) {
                            return d3.time.format('%I %p')(new Date(d));
                        };
                    }
                    else {
                        vm.riderChartOptions.chart.xAxis.tickFormat = function (d) {
                            return d3.time.format('%d %b %y')(new Date(d));
                        };
                    }
                    vm.getRiders()
                    break;
                default:
                    vm.tripChartOptions.chart.xAxis.axisLabel = freqModel
                    if (freqModel == 'hour') {
                        vm.tripChartOptions.chart.xAxis.tickFormat = function (d) {
                            return d3.time.format('%I %p')(new Date(d));
                        };
                    }
                    else {
                        vm.tripChartOptions.chart.xAxis.tickFormat = function (d) {
                            return d3.time.format('%d %b %y')(new Date(d));
                        };
                    }
                    vm.getTrips()
            }
        }
        vm.getTrips = function () {
            PerformanceService.getTrips({
                city: $rootScope.city,
                startDate: $scope.tripDates.startDate,
                endDate: $scope.tripDates.endDate,
                count: 1,
                page: 1
            }, {vehicle: $rootScope.vehicleType, frequency: vm.tripFrequency.value}, function (response) {
               // PerformanceHandler.trips = response[0].trip;
                vm.trips = PerformanceHandler.getTrips(response[0].trip);
                vm.trips.overview = response[0].overview;
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }
        vm.getDrivers = function () {
            PerformanceService.getDrivers({
                city: $rootScope.city,
                startDate: $scope.driverDates.startDate,
                endDate: $scope.driverDates.endDate,
                count: 1,
                page: 1
            }, {vehicle: $rootScope.vehicleType, frequency:  vm.driverFrequency.value}, function (response) {
             //   PerformanceHandler.drivers = response
                vm.drivers = PerformanceHandler.getDrivers(response);
                console.log('vm.drivers ', vm.drivers)
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }
        vm.getRiders = function () {
            PerformanceService.getRiders({
                city: $rootScope.city,
                startDate: $scope.riderDates.startDate,
                endDate: $scope.riderDates.endDate,
                count: 1,
                page: 1
            }, {vehicle: $rootScope.vehicleType, frequency: vm.riderFrequency.value}, function (response) {
               // PerformanceHandler.riders = response[0].riders
                vm.riders = PerformanceHandler.getRiders(response[0].riders);
                vm.riders.overview = response[0].overview
                console.log('vm.riders ', PerformanceHandler.riders)
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }
        vm.getAllData = function()
        {
            vm.getTrips()
            vm.getDrivers()
            vm.getRiders()
        }
        vm.getAllData()

    }
})();
