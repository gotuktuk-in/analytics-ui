(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('surgeController', surgeController);

    /** @ngInject */
    function surgeController($scope, $log, $rootScope, MapService, NgMap, AUTH_API) {

        $scope.toggle = false;
        var vm = this;
        var map;
        NgMap.getMap({id:'drivers_map'}).then(function (map) {
            vm.map = map;
            if(vm.map && vm.map.data)
            {
                vm.map.data.forEach(function(feature) {
                    //filter...
                    vm.map.data.remove(feature);
                });
            }
            map.data.setStyle({
                fillColor: 'gray',
                strokeWeight: 1,
                strokeOpacity:.1,
                fillOpacity:.1
            });
            MapService.loadGeoJson({}, function (response) {
                    //vm.geoJSON = response
                    /*  var temp = {}
                     temp.features = response.features
                     temp.type = response.type
                     vm.geoJSON=JSON.parse(angular.toJson(temp))
                     console.log("typeof vm.geoJSON", typeof  vm.geoJSON);*/
                    vm.geoJSON = {}
                    vm.geoJSON = response
                    vm.map.data.addGeoJson(vm.geoJSON );

                }, function (error) {
                    console.log("error ", error)
                }
            )
        });
    }
})();
