(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('MapsController', MapsController);

    /** @ngInject */
    function MapsController($scope, $log, $rootScope, geohash, MapService, NgMap, AUTH_API) {
        var vm = this;
        var Geohash = {};
        vm.API_URL = AUTH_API;
        vm.allDrivers = [];
        $scope.startDate = moment().format("YYYY-MM-DD");
        $scope.endDate = moment().format("YYYY-MM-DD");

        (function()
        {
            if( window.localStorage )
            {
                if( !localStorage.getItem('firstLoad') )
                {
                    localStorage['firstLoad'] = true;
                    window.location.reload();
                }
                else
                    localStorage.removeItem('firstLoad');
            }
        })();

        NgMap.getMap({id: 'drivers_map'}).then(function (map) {
            vm.map = map;
            if (vm.map && vm.map.data) {
                vm.map.data.forEach(function (feature) {
                    vm.map.data.remove(feature);
                });
            }
            map.data.setStyle({
                fillColor: 'gray',
                strokeWeight: 1,
                strokeOpacity: .1,
                fillOpacity: .1,
                draggable: false,
                editable: false
            });
            MapService.loadGeoJson({}, function (response) {
                    vm.geoJSON = {};
                    vm.geoJSON = response;
                    vm.map.data.addGeoJson(vm.geoJSON);

                }, function (error) {
                    console.log("error ", error)
                }
            );
        });

        $(document).ready(function(){
            $("#hide").click(function(){
                $(".card").hide();
            });
        });

        getAllDrivers();
        function getAllDrivers() {
            MapService.getAllDrivers({
                    city: $rootScope.city,
                    vehicle: $rootScope.vehicleType
                }, function (response) {
                    $scope.allDrivers = response;
                    vm.data = [];
                    _.each($scope.allDrivers, function (group) {
                        var newObj = group.split('/');
                        $scope.id = newObj[0];
                        $scope.hash = getGeoHashObj(newObj[1]);
                        $scope.time = newObj[3];
                        vm.data.push({id: newObj[0], hash: $scope.hash, time: newObj[3]})
                    });
                }, function (error) {
                    console.log("error ", error)
                }
            )
        }
        function getGeoHashObj(hash) {
            var obj = {};
            obj.geoHash = hash;
            var bBox = geohash.decode_bbox(obj.geoHash);
            obj.boxBounds = [[bBox[0], bBox[1]], [bBox[2], bBox[3]]];
            return obj;
        }

        vm.showDetail = function (e, driver, index) {
            vm.driver = driver;
            var lat = vm.driver.hash.boxBounds[0][0];
            var lng = vm.driver.hash.boxBounds[0][1];
            var latlng = new google.maps.LatLng(lat, lng);
            var geocoder = new google.maps.Geocoder();

            geocoder.geocode({'location': latlng}, function(results, status) {
                if (status === 'OK') {
                    if (results[1]) {
                        vm.driver.address = results[1].formatted_address;
                    } else {
                        window.alert('No results found');
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });

            //geocoder.geocode({'latLng': latlng}, function (results, status) {
            //    if (status == google.maps.GeocoderStatus.OK) {
            //        if (results[1]) {
            //            vm.driver.address = results[1].formatted_address;
            //        }
            //    }
            //});

            getProfile();
            //vm.map.showInfoWindow('iw-drivers', index);
        };

        function getProfile() {
            MapService.getProfile({
                id:vm.driver.id,
                from: moment($scope.startDate).startOf('day').format("YYYYMMDD").toString(),
                to: moment($scope.endDate).endOf('day').format("YYYYMMDD").toString()
            }, function (response) {
                $(".card").show();
                vm.driver.profile = response;
                console.log(vm.driver.time);
            }, function (err) {
                console.log(err);
                $scope.error = true;
            });
        }
        vm.hideDetail = function () {
            vm.map.hideInfoWindow('iw-drivers');
        };

        vm.getAddress = function () {
            vm.map.hideInfoWindow('iw-drivers');
        };

    }
})();
