(function () {
  'use strict';

  angular
      .module('tuktukV2Dahboard')
      .controller('TripsController', TripsController);

  /** @ngInject */
  function TripsController($scope, StaticDataService, ChartConfigService, $stateParams, $rootScope,  PerformanceHandler) {

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



  }
})();
