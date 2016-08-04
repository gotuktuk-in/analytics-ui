(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('DemandSupplyController', DemandSupplyController);
    /** @ngInject */
    function DemandSupplyController($scope, $rootScope, NgMap, geohash, MapService, toastr, ngDialog, StaticDataService) {
        var vm = this;
        vm.map;
        vm.colors = ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'];
        vm.precisionArr = [
            {name: "5", value: 5},
            {name: "6", value: 6},
            {name: "7", value: 7},
            {name: "8", value: 8}
        ];
        vm.selectedPrecision = vm.precisionArr[2];
        var defaultPrecesion = vm.selectedPrecision.value;

        NgMap.getMap({id: 'bidMap'}).then(function (map) {
            vm.map = map;
            google.maps.event.addDomListener(vm.map);
        });

        vm.onPrecisionChange = function () {
            getDetail();
        };

        vm.showInfoWindow = function (e, index) {
            //var geoHash = geohash.encode(e.latLng.lat(), e.latLng.lng(), vm.selectedPrecision.value);
        };

        function getDetail() {
            MapService.getDemandSupply({precision: vm.selectedPrecision.value}, function (response) {
                $scope.allHash = response;
                _.each($scope.allHash , function (group) {
                    group.hash = getGeoHashObj(group.geo_hash);
                });
                console.log($scope.allHash)
                }, function (err) {
                    console.log(err);
                    $scope.error = true;
                });
        }
        getDetail();

        function getGeoHashObj(hash) {
            var obj = {};
            obj.geoHash = hash;
            var bBox = geohash.decode_bbox(obj.geoHash);
            obj.boxBounds = [[bBox[0], bBox[1]], [bBox[2], bBox[3]]];
            return obj;
        }
    }
})();
