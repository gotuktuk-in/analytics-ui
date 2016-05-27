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
        vm.selectedFrequency = vm.timeFrequency[0];
        vm.config = ChartConfigService.lineChartConfig;
        vm.tripChartOptions = angular.copy(ChartConfigService.lineChartOptions);
        vm.driverChartOptions = angular.copy(ChartConfigService.lineChartOptions);
        vm.trips = [];
        vm.drivers = [];
        vm.riders = [];

        this.changeFrequency = function () {
            console.log("Frequency changed ", vm.selectedFrequency.value)
            vm.tripChartOptions.chart.xAxis.axisLabel = vm.selectedFrequency.label
            if (vm.selectedFrequency.value == 'hour') {
                vm.tripChartOptions.chart.xAxis.tickFormat = function (d) {
                    return d3.time.format('%I %p')(new Date(d));
                };
            }
            else {
                vm.tripChartOptions.chart.xAxis.tickFormat = function (d) {
                    return d3.time.format('%d %B %y')(new Date(d));
                };
            }
            vm.getAllData()
        }
     /*   $scope.$watch('dates', function (newValue, oldValue) {
            getDataFor(vm.selectedFrequency.value)
        })*/

        function getFormatedDate(date) {
            var obj = {}
            if ( vm.selectedFrequency.value == 'hour') {
                obj.startDate = moment(date.startDate).startOf('day').format("YYYYMMDDHH").toString()
                obj.endDate = moment(date.endDate).endOf('day').format("YYYYMMDDHH").toString()
            }
            else {
                obj.startDate = moment(date.startDate).startOf('day').format("YYYYMMDD").toString()
                obj.endDate = moment(date.endDate).endOf('day').format("YYYYMMDD").toString()
            }
            return obj;
        }

        vm.getTrips = function () {
            startDate = getFormatedDate($scope.tripDates).startDate;
            endDate = getFormatedDate($scope.tripDates).endDate;
            PerformanceService.getTrips({
                city: $rootScope.city,
                startDate: startDate,
                endDate: endDate,
                count: 1,
                page: 1
            }, {vehicle: $rootScope.vehicleType, frequency: vm.selectedFrequency.value}, function (response) {
                PerformanceHandler.trips = response[0].trip;
                vm.trips = PerformanceHandler.getTrips();
                vm.trips.overview = response[0].overview;
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }
        vm.getDrivers = function () {
            startDate = getFormatedDate($scope.tripDates).startDate;
            endDate = getFormatedDate($scope.tripDates).endDate;
            PerformanceService.getDrivers({
                city: $rootScope.city,
                startDate: startDate,
                endDate: endDate,
                count: 1,
                page: 1
            }, {vehicle: $rootScope.vehicleType, frequency: vm.selectedFrequency.value}, function (response) {
                PerformanceHandler.drivers = response
                vm.drivers = PerformanceHandler.getDrivers();
                console.log('vm.drivers ', vm.drivers)
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }
        vm.getRiders = function () {
            startDate = getFormatedDate($scope.tripDates).startDate;
            endDate = getFormatedDate($scope.tripDates).endDate;
            PerformanceService.getRiders({
                city: $rootScope.city,
                startDate: startDate,
                endDate: endDate,
                count: 1,
                page: 1
            }, {vehicle: $rootScope.vehicleType, frequency: vm.selectedFrequency.value}, function (response) {
                PerformanceHandler.riders = response[0].riders
                vm.riders = PerformanceHandler.getRiders();
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

    }
})();
