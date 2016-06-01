(function() {
  'use strict';

  angular
    .module('tuktukV2Dahboard')
    .controller('LiveController', LiveController);

  /** @ngInject */
  function LiveController($scope, $log, $rootScope,$state, $stateParams, PerformanceService) {
    var vm = this;
    $scope.dates = {};
    $scope.dates.startDate = moment().format("YYYY-MM-DD");
    $scope.dates.endDate = moment().format("YYYY-MM-DD");
    vm.getTrips = function () {
      PerformanceService.getTrips({
        city: $rootScope.city,
        startDate:  $scope.dates.startDate,
        endDate:  $scope.dates.endDate,
        count: 1,
        page: 1
      }, {vehicle: $rootScope.vehicleType, frequency: 'hour'}, function (response) {
       console.log('response ', response)
      }, function (err) {
        console.log(err)
        $scope.error = true;
      });
    }
    vm.getTrips()
  }
})();
