(function() {
  'use strict';

  angular
    .module('tuktukV2Dahboard')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($scope, $log, $rootScope,$state, $stateParams, StaticDataService) {

    $scope.cities = StaticDataService.cities
    $scope.vehicleTypes = StaticDataService.vehicleTypes
    $rootScope.selectedCity =StaticDataService.cities[0]
    $rootScope.selectedVehicle = StaticDataService.vehicleTypes[0]

    $scope.ChangeCity = function (cityObj) {
      $rootScope.selectedCity = cityObj;
      $rootScope.city = cityObj.value
      $state.go($state.current.name ,{city:  $rootScope.city , vehicleType:$rootScope.vehicleType})
    }

    $scope.ChangeVehicle = function (vehicleObj) {

      $rootScope.selectedVehicle = vehicleObj;
      $rootScope.vehicleType = vehicleObj.value
      $state.go($state.current.name ,{city:  $rootScope.city , vehicleType:$rootScope.vehicleType})
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
angular
    .module('tuktukV2Dahboard').filter('toMinSec', function(){
  return function(input){
    var minutes = parseInt(input/60, 10);
    var seconds = input%60;
    
    return minutes+' Min.'+(seconds ? ' & '+seconds+' Sec.' : '');
  }
})
