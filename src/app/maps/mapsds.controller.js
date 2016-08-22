(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('DemandSupplyController', DemandSupplyController);
    /** @ngInject */
    function DemandSupplyController($scope, $rootScope, NgMap, geohash, MapService, toastr, ngDialog, StaticDataService) {

        (function () {
            if (window.localStorage) {
                if (!localStorage.getItem('firstLoad')) {
                    localStorage['firstLoad'] = true;
                    window.location.reload();
                }
                else
                    localStorage.removeItem('firstLoad');
            }
        })();


        var vm = this;
        vm.map;
        vm.dsShow = false;
        vm.allHash;
        var Geohash = {};

        $scope.date = moment().format("YYYYMMDDhmm");
        var current = moment();
        var year = current.year();
        var month = current.month();
        var date = current.date();
        var hour = current.hour();
        var minute = current.minute();
        var newDate = new Date(year, month, date, hour);
        var quarter = parseInt(minute / 15) + 1 ;
        if (quarter == 0) {
            newDate = new Date(year, month, date, hour - 1);
            $scope.formatedDate = moment(newDate).format("YYYYMMDDHH") + 4;
        } else {
            $scope.formatedDate = moment(newDate).format("YYYYMMDDHH") + quarter;
        }
        var showDate = $scope.formatedDate;

        vm.colors = ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'];
        vm.precisionArr = [{name: "6", value: 6}, {name: "7", value: 7}];
        vm.selectedPrecision = vm.precisionArr[0];
        var defaultPrecesion = vm.selectedPrecision.value;

        vm.changeDate = function (to) {
            console.log('$scope.formatedDate' + $scope.formatedDate);
            var newYear = $scope.formatedDate.substring(0, 4);
            var newMonth = $scope.formatedDate.substring(4, 6);
            var newDay = $scope.formatedDate.substring(6, 8);
            var newHour = $scope.formatedDate.substring(8, 10);
            var newQuater = $scope.formatedDate.substring(10, 11) * 15;
            console.log('next: newQuater' + newQuater);

            if (to == 'next') {
                vm.dsShow = false;
                newDate = new Date(newYear, newMonth - 1, newDay, newHour, newQuater + 15);
                console.log('next: newDate  ' + newDate);
                var quarter = parseInt(newDate.getMinutes() / 15);
                if (quarter == 0) {
                    newDate = new Date(newYear, newMonth - 1, newDay, newHour);
                    console.log('next: newDate  ' + newDate);
                    $scope.formatedDate = moment(newDate).format("YYYYMMDDHH") + 4;
                } else {
                    $scope.formatedDate = moment(newDate).format("YYYYMMDDHH") + quarter;
                }
                console.log('next: ' + $scope.formatedDate);
            }
            else {
                vm.dsShow = false;
                newDate = new Date(newYear, newMonth - 1, newDay, newHour, newQuater - 15);

                console.log('pre: newDate  ' + newDate);
                var quarter = parseInt(newDate.getMinutes() / 15);
                if (quarter == 0) {
                    newDate = new Date(newYear, newMonth - 1, newDay, newHour - 1);
                    $scope.formatedDate = moment(newDate).format("YYYYMMDDHH") + 4;
                } else {
                    $scope.formatedDate = moment(newDate).format("YYYYMMDDHH") + quarter;
                }
                console.log('prev: ' + $scope.formatedDate);
            }
            getDetail();
        };

        NgMap.getMap({id: 'bidMap'}).then(function (map) {
            vm.map = map;
            google.maps.event.addDomListener(vm.map);
        });

        vm.onPrecisionChange = function () {
            getDetail();
        };
        vm.showGeoHashDetail = function (e) {
            var currentGeoHash = geohash.encode(e.latLng.lat(), e.latLng.lng(), vm.selectedPrecision.value);
            vm.hashDetail = getGeoHashDetail(currentGeoHash);
            vm.dsShow = true;
        };

        function getGeoHashDetail(curHash) {
            var obj;
            _.each(vm.allHash, function (a) {
                if (a.geo_hash == curHash) {
                    obj = a
                }
            });
            return obj;
        }

        function getDetail() {
            MapService.getDemandSupply({
                forTime: $scope.formatedDate,
                precision: vm.selectedPrecision.value
            }, function (response) {
                $scope.allHash = response;
                vm.allHash = $scope.allHash;
                console.log('$scope.allHash ', $scope.allHash);
                $scope.totalHash = response.length;

                var dateString = $scope.formatedDate;
                var year = dateString.substring(0, 4);
                var month = dateString.substring(4, 6);
                var day = dateString.substring(6, 8);
                var hour = dateString.substring(8, 10);
                var minutes = dateString.substring(10, 11);

                var newDate = new Date(year, month - 1, day, hour, (minutes - 1) * 15);
                $scope.dsDate = moment(newDate).format("dddd, MMMM Do YYYY,  h:mm");

                var i = 0
                _.each($scope.allHash, function (group) {
                    var newObj = group;
                    group.hash = getGeoHashObj(group.geo_hash);
                    //group.color = genNewColor(group.rank);
                    newObj.color = vm.colors[i];
                    i++;
                });
                console.log('allHash', $scope.allHash);
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
