(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('DemandSupplyController', DemandSupplyController);
    /** @ngInject */
    function DemandSupplyController($scope, $rootScope, NgMap, geohash, MapService, toastr, ngDialog, StaticDataService) {
        var vm = this;
        vm.map;
        var Geohash = {};
        vm.colors = ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'];
        vm.precisionArr = [
            {name: "6", value: 6},
            {name: "7", value: 7}
        ];
        vm.selectedPrecision = vm.precisionArr[0];
        var defaultPrecesion = vm.selectedPrecision.value;

        NgMap.getMap({id: 'bidMap'}).then(function (map) {
            vm.map = map;
            google.maps.event.addDomListener(vm.map);

        });

        vm.onPrecisionChange = function () {
            getDetail();
        };

        function getDetail() {
            MapService.getDemandSupply({precision: vm.selectedPrecision.value}, function (response) {
                $scope.allHash = response;
                $scope.totalHash = response.length;
                //var i = 0
                _.each($scope.allHash, function (group) {
                    var newObj = group;
                    group.hash = getGeoHashObj(group.geo_hash);
                    group.color = genNewColor(group.rank);
                    //newObj.color = vm.colors[i];
                    //i++;
                });
                console.log($scope.allHash);
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

        function genNewColor(rank){

            //Lets assume 3 start and 3 end free section of rank
            var baseColor = "0000ff";
            var startBase = 3;
            var endBase = 3;
            var totalRankAlphaParts = 11 /*0 to 10*/ + startBase + endBase;
            var singleAlphaPartValue = 255 / totalRankAlphaParts; //[0 to 255]
            var alphaValueForRank = singleAlphaPartValue * (startBase + rank + 1); //rank starts from 0

            var colorValue = Color.argb(alphaValueForRank, Color.red(baseColor), Color.green(baseColor), Color.blue(baseColor));
            return colorValue;
        }

    }
})();
