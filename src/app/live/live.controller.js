(function() {
  'use strict';

  angular
    .module('tuktukV2Dahboard')
    .controller('LiveController', LiveController);

  /** @ngInject */
  function LiveController($scope, $log, $rootScope,$state, $stateParams,ChartConfigService, LiveService) {
    var vm = this;
    vm.config = ChartConfigService.lineChartConfig;
    vm.tripChartOptions = angular.copy(ChartConfigService.lineChartOptions);
    vm.driverChartOptions = angular.copy(ChartConfigService.lineChartOptions);
    vm.riderChartOptions = angular.copy(ChartConfigService.lineChartOptions);
    vm.trips = [];
    vm.drivers = [];
    vm.riders = [];

   function getLive () {

      LiveService.getTrips({
        city: $rootScope.city,
        vehicle: $rootScope.vehicleType
      }, function (response) {
        vm.trips.overview =response.overview;
       console.log('response ', response)
      }, function (err) {
        console.log(err)
        $scope.error = true;
      });

     LiveService.getDrivers({
       city: $rootScope.city,
       vehicle: $rootScope.vehicleType
     }, function (response) {
       vm.drivers.overview = response.overview;
       console.log('response ', response)
     }, function (err) {
       console.log(err)
       $scope.error = true;
     });

     LiveService.getRiders({
       city: $rootScope.city,
       vehicle: $rootScope.vehicleType
     }, function (response) {
       vm.riders.overview =response.overview;
       console.log('response ', response)
     }, function (err) {
       console.log(err)
       $scope.error = true;
     });

    }
    getLive()
  }
})();
