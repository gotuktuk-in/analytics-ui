(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('SurgeController', SurgeController);

    /** @ngInject */
    function SurgeController($scope, NgMap, geohash) {

        var vm = this;
        vm.map;
        vm.geohashArray = [];
        vm.test='pavan';

        vm.precisionArr = [{name:"4", value:4},{name:"5", value:5},{name:"6", value:6},{name:"7", value:7},{name:"8", value:8}]
        vm.selectedPrecision = vm.precisionArr[2];
        vm.geohashGroups = [{name:'group1', hash:'sdfdfdf'},{name:'group2', hash:'sdfrdf'},{name:'group3', hash:'sdyfdf'}]
        $scope.toggle = false;
        NgMap.getMap({id:'surgeMap'}).then(function (map) {
            vm.map = map;
            google.maps.event.addDomListener( vm.map, 'click', onMapClick);
            vm.map.setClickableIcons(false);
         //   vm.map.setZoom(vm.selectedPrecision.value + 8);
        });
        vm.onPrecisionChange = function () {
            vm.geohashArray = [];
        }
        vm.removeGeoHash = function (index) {
            vm.geohashArray.splice(index, 1)
        }
        vm.addGroup = function () {

            var obj = {}
            obj.name = vm.groupName
            obj.geohash =  vm.geohashArray

        }
        vm.addSetting = function () {

        }
        function onMapClick(e)
        {
             var obj = {}
            obj.geoHash = geohash.encode (e.latLng.lat(), e.latLng.lng(), vm.selectedPrecision.value);
            var bBox = geohash.decode_bbox (obj.geoHash);
            obj.boxBounds = [[bBox[0], bBox[1]], [bBox[2], bBox[3]]]
            //[22.720584869384766, 75.85772037506104, 22.720627784729004, 75.85776329040527]
            $scope.$apply(function () {
                vm.geohashArray.push(obj)
            });

          //  console.log('Geo-hash', angular.toJson(vm.geohashArray))
        }

    }
})();
