(function() {
  'use strict';

  angular
    .module('tuktukV2Dahboard')
    .controller('PerformanceController', PerformanceController);

  /** @ngInject */
  function PerformanceController($scope, ChartConfigService, $log, $rootScope, PerformanceService, PerformanceHandler, NgTableParams, API, $resource) {

    var vm = this;

    var startDate, endDate;
    $scope.dates = {};
    $scope.dates.startDate = moment().subtract(30, 'days').format("YYYY-MM-DD");
    $scope.dates.endDate = moment().format("YYYY-MM-DD");
    vm.timeFrequency = [{label:"Per Hour", value:"hour"},{label:"Per Day", value:"day"}];
    vm.selectedFrequency = vm.timeFrequency[0];
    vm.config = ChartConfigService.lineChartConfig;
    vm.tripChartOptions = angular.copy(ChartConfigService.lineChartOptions);
    vm.driverChartOptions = angular.copy(ChartConfigService.lineChartOptions);
    vm.trips = [];
    vm.drivers = [];
    vm.riders = [];

    this.changeFrequency = function()
    {
        console.log("Frequency changed ",vm.selectedFrequency.value )
      vm.tripChartOptions.chart.xAxis.axisLabel= vm.selectedFrequency.label
      if(vm.selectedFrequency.value=='hour')
      {
        d3.time.format('%I %p')
        vm.tripChartOptions.chart.xAxis.tickFormat(d3.time.format('%I %p'));
      }
      else
      {
        d3.time.format('%d %B %y')
        vm.tripChartOptions.chart.xAxis.tickFormat(d3.time.format('%d %B %y'));
      }
    }
    $scope.$watch('dates', function(newValue, oldValue) {
      getData()
    })
    function getData()
    {
      startDate =  moment($scope.dates.startDate).startOf('day').format("YYYYMMDDHH").toString()
      endDate =  moment($scope.dates.endDate).endOf('day').format("YYYYMMDDHH").toString()

      PerformanceService.getTrips({startDate:startDate, city:$rootScope.city, endDate:endDate, count:1, page:1}, {vehicle:$rootScope.vehicleType,frequency:vm.selectedFrequency.value}, function (response) {
        PerformanceHandler.trips = response[0].trip;
        vm.trips = PerformanceHandler.getTrips();
        vm.trips.overview = response[0].overview;
      }, function (err) {
        console.log(err)
        $scope.error = true;
      });

      PerformanceService.getDrivers({startDate:startDate, city:$rootScope.city, endDate:endDate, count:1, page:1}, {vehicle:$rootScope.vehicleType,frequency:vm.selectedFrequency.value}, function (response) {
        PerformanceHandler.drivers = response
        vm.drivers = PerformanceHandler.getDrivers();
        console.log('vm.drivers ', vm.drivers)
      }, function (err) {
        console.log(err)
        $scope.error = true;
      });

      PerformanceService.getRiders({startDate:startDate, city:$rootScope.city, endDate:endDate, count:1, page:1}, {vehicle:$rootScope.vehicleType,frequency:vm.selectedFrequency.value}, function (response) {
        PerformanceHandler.riders = response[0].riders
        vm.riders = PerformanceHandler.getRiders();
        console.log('vm.riders ', PerformanceHandler.riders)
      }, function (err) {
        console.log(err)
        $scope.error = true;
      });

    }


  }
})();
