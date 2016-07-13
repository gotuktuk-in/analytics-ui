(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('SurgeController', SurgeController);

    /** @ngInject */
    function SurgeController($scope, NgMap, geohash) {

        var vm = this;
        vm.map;
        vm.rectArray = []
        vm.test='pavan'
        NgMap.getMap({id:'surgeMap'}).then(function (map) {
            vm.map = map
            google.maps.event.addDomListener( vm.map, 'click', onMapClick);
        })
        function onMapClick(e)
        {
            console.log('clicked', e.latLng.lat())
           var geoHashString =geohash.encode (e.latLng.lat(), e.latLng.lng(), 9)
            var bBox = geohash.decode_bbox (geoHashString)

            console.log('bBox ', bBox)
            //[22.720584869384766, 75.85772037506104, 22.720627784729004, 75.85776329040527]
            $scope.$apply(function () {
                vm.rectArray.push([[bBox[0], bBox[1]], [bBox[2], bBox[3]]])
            })

            console.log('Geo-hash', angular.toJson(vm.rectArray))
        }
    }
})();
