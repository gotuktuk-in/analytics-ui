(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('MapsController', MapsController);

    /** @ngInject */
    function MapsController($scope, $log, $rootScope, MapService, NgMap, API) {
        var vm = this
        vm.fenceData = {"type":"FeatureCollection","features":[]}
        vm.fenceURL =API+ 'geofence'
        console.log('vm.fenceURL ', vm.fenceURL)
        NgMap.getMap().then(function (map) {
            vm.map = map;
            map.data.setStyle({
                fillColor: 'green',
                strokeWeight: 1
            });
            /*MapService.geofence({}, function (response) {
                   vm.fenceData =toString(response)// angular.toJson(response)
                    console.log("vm.fenceData ", vm.fenceData)
                }, function (error) {
                    console.log("error ", error)
                }
            )*/
        });
        $scope.status = {
            isopen: false
        };

        $scope.toggled = function (open) {
            $log.log('Dropdown is now: ', open);
        };

    }
})();
