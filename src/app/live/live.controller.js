(function() {
  'use strict';

  angular
    .module('tuktukV2Dahboard')
    .controller('LiveController', LiveController);

  /** @ngInject */
  function LiveController($scope, $log, $rootScope,$state, $stateParams,ChartConfigService, LiveService, PerformanceService, PerformanceHandler) {
    var vm = this;

    $scope.dates = {};
    $scope.dates.startDate = moment().format("YYYY-MM-DD");
    $scope.dates.endDate = moment().format("YYYY-MM-DD");
    vm.config = ChartConfigService.lineChartConfig;
    vm.tripChartOptions = angular.copy(ChartConfigService.lineChartOptions);
    vm.driverChartOptions = angular.copy(ChartConfigService.lineChartOptions);
    vm.riderChartOptions = angular.copy(ChartConfigService.lineChartOptions);
    vm.trips = [];
    vm.drivers = [];
    vm.riders = [];

   function getLive() {
     LiveService.getOverview({
       city: $rootScope.city,
       vehicle: $rootScope.vehicleType,
     }, function (response) {
       //  PerformanceHandler.trips = response[0].trip
       vm.overview = response;
       console.log('response ',  vm.overview )
     }, function (err) {
       console.log(err)
       $scope.error = true;
     });

      PerformanceService.getTrips({
        city: $rootScope.city,
        startDate: $scope.dates.startDate,
        endDate: $scope.dates.endDate,
        count: 1,
        page: 1
      }, {vehicle: $rootScope.vehicleType, frequency:'hour'}, function (response) {
      //  PerformanceHandler.trips = response[0].trip
        vm.trips = PerformanceHandler.getTrips(response[0].trip)
      }, function (err) {
        console.log(err)
        $scope.error = true;
      });

     PerformanceService.getDrivers({
       city: $rootScope.city,
       startDate: $scope.dates.startDate,
       endDate: $scope.dates.endDate,
       count: 1,
       page: 1
     }, {vehicle: $rootScope.vehicleType, frequency: 'hour'}, function (response) {
      // PerformanceHandler.drivers = response
       vm.drivers = PerformanceHandler.getDrivers(response)
     }, function (err) {
       console.log(err)
       $scope.error = true;
     });

     PerformanceService.getRiders({
       city: $rootScope.city,
       startDate: $scope.dates.startDate,
       endDate: $scope.dates.endDate,
       count: 1,
       page: 1
     }, {vehicle: $rootScope.vehicleType, frequency: 'hour'}, function (response) {
     //  PerformanceHandler.riders = response[0].riders
       vm.riders = PerformanceHandler.getRiders(response[0].riders)
     }, function (err) {
       console.log(err)
       $scope.error = true;
     });

    }
    getLive()
  }
})();
