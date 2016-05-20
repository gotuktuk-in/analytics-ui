(function() {
  'use strict';

  angular
    .module('tuktukV2Dahboard')
    .controller('MapsController', MapsController);

  /** @ngInject */
  function MapsController($scope, $log, $rootScope, MapService) {
    $scope.fenceData;
    var map;
    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
      });
    }

    $scope.status = {
      isopen: false
    };

    $scope.toggled = function(open) {
      $log.log('Dropdown is now: ', open);
    };
    MapService.geofence({},function(response){
          $scope.fenceData = angular.toJson(response.geo)
   //   $log("data ", response)
    },function(error){
      //    $log("error ", error)
        }
    )
  }
})();
