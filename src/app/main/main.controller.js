(function() {
  'use strict';

  angular
    .module('tuktukV2Dahboard')
    .controller('MainController', MainController);

  /** @ngInject */
  
  function MainController($scope, $log, $rootScope,$state, $stateParams, StaticDataService) {
    var vm = this;
    vm.navsLister = [];
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
    //if(setNavByRoleService.getNav())
    //{
    //  vm.navsLister = setNavByRoleService.getNav();
    //}
    


    //console.log('vm.navsLister' , vm.navsLister);
  /*  var links = angular.element('.t-module-link');
    //console.log('links 1' , links);
   _.each(links, function(i){
      //i.find('a').text();
      console.log('links 2' , angular.element(i));
    })*/
   /*var modules = $storage.nav;
   console.log('modules' , modules);*/
   /*var modules = roleBasedShowModules(nav);
   */
 
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

