(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('DemandSupplyController', DemandSupplyController);
    /** @ngInject */
    function DemandSupplyController($scope, $rootScope, NgMap, geohash, MapService, toastr, ngDialog, DSHandler, ChartConfigService, StaticDataService) {
        $scope.dsGraph = false;
        $scope.heatMapSlider = true;

        var vm = this;
        vm.live = true;
        vm.liveDS = true;
        $scope.count = 0;
        vm.map;
        vm.dsShow = false;
        vm.allHash;
        var Geohash = {};
        var today = moment();
        $scope.date = moment().format("ddd, MMM Do YYYY");
        var current = moment();
        var year = current.year();
        var month = current.month();
        var date = current.date();
        var hour = current.hour();
        var minute = current.minute();
        var newDate = new Date(year, month, date, hour);
        var quarter = parseInt(minute / 15) + 1;
        if (quarter == 0) {
            newDate = new Date(year, month, date, hour - 1);
            $scope.formatedDate = moment(newDate).format("YYYYMMDDHH") + 4;
        } else {
            $scope.formatedDate = moment(newDate).format("YYYYMMDDHH") + quarter;
        }
        vm.colors = ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'];
        vm.precisionArr = [{name: "PR-6", value: 6}, {name: "PR-7", value: 7}];
        vm.selectedPrecision = vm.precisionArr[0];
        var defaultPrecesion = vm.selectedPrecision.value;


        //heatmap start
        var heatmap;
        vm.heatMapFilers = [
            {label: "In-Process ", id: '20,22,30,40,50'},
            {label: "Failed", id: '72,80,81,82'},
            {label: "Cancel", id: '70,71'},
            {label: "Success", id: '61'}
        ];
        vm.selected = vm.heatMapFilers[0];
        $scope.rangSlider = {
            max: 24,
            min: 0
        };
        $scope.slider = {
            minValue: 0,
            maxValue: 24,
            options: {
                floor: 0,
                ceil: 24,
                //precision:2,
                showTicksValues: 0,
                translate: function (value) {
                    return value + 'h';
                },
                keyboardSupport: false,
                onEnd: function (sliderId, modelValue, highValue, pointerType) {
                    //    console.log(sliderId, modelValue, highValue, pointerType)
                    $scope.rangSlider.min = modelValue;
                    $scope.rangSlider.max = highValue;
                    vm.loadHeatMap()
                }
            }
        };
        Array.prototype.sum = function (prop) {
            var total = 0;
            for (var i = 0, _len = this.length; i < _len; i++) {
                total += this[i][prop]
            }
            return total
        };
        $scope.ddSettings = {enableSearch: false};
        //range slider end


        vm.heatMapDataLength;

        vm.loadHeatMap = function () {

            var from = moment(current).hour($scope.rangSlider.min).unix();
            var to = moment(current).hour($scope.rangSlider.max).unix();
            MapService.heatmap({
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType,
                from: from,
                to: to,
                state: vm.selected.id
            }, function (response) {
                vm.heatMapDataLength = response.length;
                var transformedData = [];
                var pointArray = [];
                _.forEach(response, function (item) {
                    transformedData.push(new google.maps.LatLng(item.locPickupRequest.lt - 0, item.locPickupRequest.ln - 0));
                });
                NgMap.getMap({id: 'bidMap'}).then(function (map) {
                    vm.map = map;
                    if (heatmap) {
                        heatmap.setMap(null);
                    }
                    pointArray = new google.maps.MVCArray(transformedData);
                    heatmap = new google.maps.visualization.HeatmapLayer({
                        data: pointArray
                    });
                    heatmap.setMap(vm.map);
                });

            }, function (err) {
                console.log(err);
                $scope.error = true;
            });
        };
        vm.loadHeatMap();
        //heatmap end


        vm.changeDate = function (to) {
            $scope.dsGraph = false;
            var newYear = $scope.formatedDate.substring(0, 4);
            var newMonth = $scope.formatedDate.substring(4, 6);
            var newDay = $scope.formatedDate.substring(6, 8);
            var newHour = $scope.formatedDate.substring(8, 10);
            var newQuater = $scope.formatedDate.substring(10, 11) * 15;
            if (to == 'next') {
                vm.dsShow = false;
                newDate = new Date(newYear, newMonth - 1, newDay, newHour, newQuater + 15);
                var quarter = parseInt(newDate.getMinutes() / 15);
                if (quarter == 0) {
                    newDate = new Date(newYear, newMonth - 1, newDay, newHour);
                    $scope.formatedDate = moment(newDate).format("YYYYMMDDHH") + 4;
                } else {
                    $scope.formatedDate = moment(newDate).format("YYYYMMDDHH") + quarter;
                }
                $scope.count++
            }
            else {
                vm.dsShow = false;
                newDate = new Date(newYear, newMonth - 1, newDay, newHour, newQuater - 15);
                var quarter = parseInt(newDate.getMinutes() / 15);
                if (quarter == 0) {
                    newDate = new Date(newYear, newMonth - 1, newDay, newHour - 1);
                    $scope.formatedDate = moment(newDate).format("YYYYMMDDHH") + 4;
                } else {
                    $scope.formatedDate = moment(newDate).format("YYYYMMDDHH") + quarter;
                }
                $scope.count--
            }
            if ($scope.count < 0) {
                vm.live = false;
            } else {
                vm.live = true;
            }
            getDetail();
        };
        vm.changeDateDS = function (to) {

            if (to == 'next') {
                current = moment(current).add(1, 'day');
                $scope.date = moment(current).format("dddd, MMMM Do YYYY")

            }
            else {
                current = moment(current).subtract(1, 'day');
                $scope.date = moment(current).format("dddd, MMMM Do YYYY");

                console.log('$scope.date ', $scope.date)
            }
            if (moment(current).unix() == moment(today).unix()) {
                vm.liveDS = true;
            }
            else {
                vm.liveDS = false;
            }
            vm.showDSGraph();
        };
        vm.onPrecisionChange = function () {
            getDetail();
        };

        getAllDrivers();
        getDetail();


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
        vm.heatmapView = true;
        vm.markersView = true;
        vm.shapesView = true;

        vm.showHeatmap = function() {
            vm.heatmapView = true;
            $scope.heatMapSlider = true;
            heatmap.setMap(vm.map);
        };
        vm.hideHeatmap = function() {
            vm.heatmapView = false;
            $scope.heatMapSlider = false;
            heatmap.setMap(null);
        };
        vm.showMarkers = function() {
            vm.markersView = true;
            for (var key in vm.map.markers) {
                vm.map.markers[key].setMap(vm.map);
            };
        };
        vm.hideMarkers = function() {
            vm.markersView = false;
            for (var key in vm.map.markers) {
                vm.map.markers[key].setMap(null);
            };
        };
        vm.showShapes = function() {
            vm.shapesView = true;
            for (var key in vm.map.shapes) {
                vm.map.shapes[key].setMap(vm.map);
            };
        };
        vm.hideShapes = function() {
            vm.shapesView = false;
            for (var key in vm.map.shapes) {
                vm.map.shapes[key].setMap(null);
            };
        };

        vm.showDetail = function (e, driver, index) {
            vm.driver = driver;
            var lat = vm.driver.hash.boxBounds[0][0];
            var lng = vm.driver.hash.boxBounds[0][1];
            var latlng = new google.maps.LatLng(lat, lng);
            var geocoder = new google.maps.Geocoder();

            geocoder.geocode({'location': latlng}, function (results, status) {
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
            getProfile();
        };

        function getProfile() {
            MapService.getProfile({
                id: vm.driver.id,
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
        vm.selectedGeohash = '';
        vm.showGeoHashDetail = function (e) {
            var currentGeoHash = geohash.encode(e.latLng.lat(), e.latLng.lng(), vm.selectedPrecision.value);
            vm.hashDetail = getGeoHashDetail(currentGeoHash);
            vm.selectedGeohash = currentGeoHash;
            vm.getDSGraph();
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
                $scope.totalHash = response.length;

                var dateString = $scope.formatedDate;
                var year = dateString.substring(0, 4);
                var month = dateString.substring(4, 6);
                var day = dateString.substring(6, 8);
                var hour = dateString.substring(8, 10);
                var minutes = dateString.substring(10, 11);

                var newDate = new Date(year, month - 1, day, hour, (minutes - 1) * 15);
                $scope.dsDate = moment(newDate).format("ddd, MMM Do YYYY,  h:mm");

                var i = 0
                _.each($scope.allHash, function (group) {
                    var newObj = group;
                    group.hash = getGeoHashObj(group.geo_hash);
                    i++;
                });

            }, function (err) {
                console.log(err);
                $scope.error = true;
            });
        }

        showGeofence();

        function showGeofence() {

            NgMap.getMap({id: 'bidMap'}).then(function (map) {
                vm.map = map;
                google.maps.event.addDomListener(vm.map);

                if (vm.map && vm.map.data) {
                    vm.map.data.forEach(function (feature) {
                        vm.map.data.remove(feature);
                    });
                }
                map.data.setStyle({
                    fillColor: '#ccc',
                    strokeWeight: 1,
                    strokeOpacity: .1,
                    fillOpacity: 0.2,
                    draggable: false,
                    editable: false,
                    zIndex: -9999999
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

        }

        vm.config = ChartConfigService.lineChartConfig;
        vm.dsGraphOptions = angular.copy(ChartConfigService.lineChartOptions);
        vm.dsGraphOptions.chart.xAxis.tickFormat = function (d) {
            return d3.time.format('%H:%M')(new Date(d));
        };
        //vm.dsGraphOptions.chart.height = 400;

        vm.dsGraphData = [];

        vm.getDSGraph = function () {
            MapService.getDemandSupplyHistory({
                    geohash: vm.selectedGeohash,
                    fromTime: moment(current).format("YYYYMMDD") + '000',
                    toTime: moment(current).format("YYYYMMDD") + '234'
                }, function (response) {
                    vm.dsGraphData = DSHandler.getDS(response);
                    console.log(vm.dsGraphData);
                    vm.dsGraphOptions.chart.xAxis.axisLabel = '';
                    vm.axisGeohash = vm.selectedGeohash;
                    vm.axisTitle1 = response.title;
                    vm.axisTitle2 = response.subTitle;
                    vm.dsShow = true;
                }, function (error) {
                    console.log("error ", error)
                }
            );
            // demand supply graph function goes here
        };

        vm.showDSGraph = function () {
            vm.hideCard();
            $scope.dsGraph = true;
        };
        vm.hideDSDetail = function () {
            vm.dsShow = false;
        };
        vm.hideDSGraph = function () {
            $scope.dsGraph = false;
        };
        vm.hideCard = function () {
            $(".card").hide();
        };

        function getGeoHashObj(hash) {
            var obj = {};
            obj.geoHash = hash;
            var bBox = geohash.decode_bbox(obj.geoHash);
            obj.boxBounds = [[bBox[0], bBox[1]], [bBox[2], bBox[3]]];
            return obj;
        }
    }
})();
