(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('LiveController', LiveController);

    /** @ngInject */
    function LiveController($scope, $log, $rootScope, $state, $stateParams, ChartConfigService, LiveService, PerformanceService, PerformanceHandler) {
        var vm = this;
        $scope.today = moment().format("dddd, MMMM Do YYYY")
        $scope.dates = {};
        $scope.dates.startDate = moment().format("YYYY-MM-DD");
        $scope.dates.endDate = moment().format("YYYY-MM-DD");
        vm.config = ChartConfigService.lineChartConfig;
        vm.tripChartOptions = angular.copy(ChartConfigService.lineChartOptions);

        vm.tripChartOptions.chart.xAxis.tickFormat = function (d) {
            return d3.time.format('%I %p')(new Date(d));
        };
        vm.trips = [];

        function getLive() {
            LiveService.getOverview({
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType,
            }, function (response) {
                //  PerformanceHandler.trips = response[0].trip
                vm.overview = response;
                console.log('response ', vm.overview)
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });

            PerformanceService.getTrips({
                city: $rootScope.city,
                startTime: $scope.dates.startDate,
                endTime: $scope.dates.endDate,
                count: 1,
                page: 1,
                rate: 'hour'
            }, {vehicle: $rootScope.vehicleType, frequency: 'hour'}, function (response) {
                //  PerformanceHandler.trips = response[0].trip
                vm.trips = PerformanceHandler.getTrips(response[0].trip)

                PerformanceService.getDrivers({
                    city: $rootScope.city,
                    startTime: $scope.dates.startDate,
                    endTime: $scope.dates.endDate,
                    count: 1,
                    page: 1,
                    rate: 'hour'
                }, {vehicle: $rootScope.vehicleType, frequency: 'hour'}, function (response) {
                    // PerformanceHandler.drivers = response
                    vm.drivers = PerformanceHandler.getDrivers(response)
                    vm.trips = _.union( vm.trips, vm.drivers)
                    vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'Cancelled trips (by rider)'}));
                    vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'Cancelled trips (by driver)'}));
                    vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'tCash'}));
                    vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'New Drivers'}));

                }, function (err) {
                    console.log(err)
                    $scope.error = true;
                });
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });


        }

        getLive()
    }
})();
