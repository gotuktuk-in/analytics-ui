(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('MapsController', MapsController);

    /** @ngInject */
    function MapsController($scope, $log, $rootScope, MapService, NgMap, API) {
        var vm = this
        vm.allDrivers = []
        NgMap.getMap().then(function (map) {
            vm.map = map;
            map.data.setStyle({
                fillColor: 'gray',
                strokeWeight: 1,
                strokeOpacity:.1,
                fillOpacity:.1
            });
        });



        getDrivers()
        function getDrivers(){
            MapService.getDrivers({}, function (response) {
               vm.allDrivers = response;
              console.log("vm.drivers ", vm.allDrivers);
                }, function (error) {
                    console.log("error ", error)
                }
            )
        }


        vm.showDetail = function(e, driver) {
            vm.driver = driver;
            vm.map.showInfoWindow('iw-drivers', driver);
        };

        vm.hideDetail = function() {
            vm.map.hideInfoWindow('iw-drivers');
        };

    }
})();
