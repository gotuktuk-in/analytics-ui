(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('MapsController', MapsController);

    /** @ngInject */
    function MapsController($scope, $log, $rootScope, MapService, NgMap, API) {
        var vm = this


        vm.fenceURL =API+ 'geofence'
        vm.test= 'dfdfdfdfdfdf'
        console.log('vm.fenceURL ', vm.fenceURL)
        NgMap.getMap().then(function (map) {
            vm.map = map;
            map.data.setStyle({
                fillColor: 'green',
                strokeWeight: 1
            });
            MapService.geofence({}, function (response) {
                    var data = angular.toJson(response)
                  vm.fenceData = JSON.parse(data);
                   // vm.fenceData = Object( vm.fenceData )
                    console.log("vm.fenceData ",typeof vm.fenceData)
                    console.log("vm.fenceData ",vm.fenceData)
                }, function (error) {
                    console.log("error ", error)
                }
            )
        });
        $scope.status = {
            isopen: false
        };

        $scope.toggled = function (open) {
            $log.log('Dropdown is now: ', open);
        };

    }
})();
