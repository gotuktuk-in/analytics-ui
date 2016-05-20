(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('MapsController', MapsController);

    /** @ngInject */
    function MapsController($scope, $log, $rootScope, MapService, NgMap, API) {
        var vm = this
        vm.fenceData;
        vm.fenceURL =API+ 'geofence'
        console.log('vm.fenceURL ', vm.fenceURL)
        NgMap.getMap().then(function (map) {
            vm.map = map;
            MapService.geofence({}, function (response) {
                    vm.fenceData = angular.fromJson(response.geo)
                    console.log("vm.fenceData ", vm.fenceData)
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
