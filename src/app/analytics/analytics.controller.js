(function() {
  'use strict';

  angular
    .module('tuktukV2Dahboard')
    .controller('AnalyticsController', AnalyticsController);

  /** @ngInject */
  function AnalyticsController($scope, $log, $rootScope) {

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

  }
})();
