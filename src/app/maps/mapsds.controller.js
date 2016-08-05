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
                $scope.totalHash = response.length;
                _.each($scope.allHash , function (group) {
                    group.hash = getGeoHashObj(group.geo_hash);
                });
                console.log($scope.allHash)
                }, function (err) {
                    console.log(err);
                    $scope.error = true;
                });



            //bid Marker start

            var markers=[];
            var contents = [];
            var infowindows = [];
            var i = 0;


            for (i = 0; i < $scope.totalHash; i++) {

                markers[i] = new google.maps.Marker({
                    position: new google.maps.LatLng((group.hash.boxBounds[i][i] + group.hash.boxBounds[i+1][i])/2,(group.hash.boxBounds[i][i+1] + group.hash.boxBounds[i+1][i+1])/2),
                    map: map,
                    title: 'Bid'
                });

                markers[i].index = i;
                contents[i] = '<div class="popup_container">'
                + 'test'
                '</div>';


                infowindows[i] = new google.maps.InfoWindow({
                    content: contents[i],
                    maxWidth: 300
                });

                google.maps.event.addListener(markers[i], 'click', function() {
                    console.log(this.index); // this will give correct index
                    console.log(i); //this will always give 10 for you
                    infowindows[this.index].open(map,markers[this.index]);
                    map.panTo(markers[this.index].getPosition());
                });

            }
            //bid Marker end



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
