(function() {
  'use strict';

  angular
    .module('tuktukV2Dahboard')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($scope, $log, $rootScope,  StaticDataService) {

    $scope.cities = StaticDataService.cities
    $scope.vehicleTypes = StaticDataService.vehicleTypes
    $scope.selectedCity = StaticDataService.cities[0]
    $scope.selectedVehicle = StaticDataService.vehicleTypes[0]

    $scope.ChangeCity = function (cityObj) {
      $scope.selectedCity = cityObj;
    }

    $scope.ChangeVehicle = function (vehicleObj) {
      $scope.selectedVehicle = vehicleObj;
    }

    $scope.status = {
      isopen: false
    };

    $scope.toggled = function(open) {
      $log.log('Dropdown is now: ', open);
    };
/*

    var map;
    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
      });
    }


*/

  }
})();
