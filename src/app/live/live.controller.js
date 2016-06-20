(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('LiveController', LiveController);

    /** @ngInject */
    function LiveController($scope, $log, $rootScope, $state, $interval, $stateParams, NgMap, ChartConfigService, LiveService, PerformanceService, PerformanceHandler) {
        var vm = this;
        //range slider , Failed(2), Cancel(2), Success.

        var today = moment()
        var  heatmap;
        vm.heatMapFilers = [{label: "In-Process", id: '20,22,30,40,50'}, {label: "Failed", id: '72,80,81,82'}, {
            label: "Cancel",
            id: '70,71'
        }, {label: "Success", id: '61'}]
        vm.selected = vm.heatMapFilers[0]
        $scope.rangSlider = {
            max: 24,
            min: 0,
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

        $scope.ddSettings = {enableSearch: false};
        //range slider end

        $scope.date = moment().format("dddd, MMMM Do YYYY")
        vm.config = ChartConfigService.lineChartConfig;
        vm.tripChartOptions = angular.copy(ChartConfigService.lineChartOptions);

        vm.tripChartOptions.chart.xAxis.tickFormat = function (d) {
            return d3.time.format('%I %p')(new Date(d).addHours(1));
        };
        vm.trips = [];
        var current = moment()
        vm.live = true
        vm.changeDate = function (to) {

            if (to == 'next') {
                current = moment(current).add(1, 'day')
                $scope.date = moment(current).format("dddd, MMMM Do YYYY")

            }
            else {
                current = moment(current).subtract(1, 'day')
                $scope.date = moment(current).format("dddd, MMMM Do YYYY")

                console.log('$scope.date ', $scope.date)
            }
            if (moment(current).unix() == moment(today).unix()) {
                vm.live = true;
                getOverviewLive()
            }
            else {
                vm.live = false;
                getOverviewBack()
            }
            getLive()
            vm.loadHeatMap()
        }

        function getOverviewLive()
        {
            LiveService.getOverview({
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType,
            }, function (response) {
                vm.overview = response;
                console.log('response ', vm.overview)
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }
        function getOverviewBack()
        {
            LiveService.getOverview({
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType,
                startTime: moment(current).startOf('day'),
                endTime: moment(current).endOf('day'),
            }, function (response) {
                //  PerformanceHandler.trips = response[0].trip
                vm.overview = response;
                console.log('response ', vm.overview)
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }
        function getLive() {
           PerformanceService.getTrips({
                city: $rootScope.city,
                startTime: moment(current).startOf('day'),
                endTime: moment(current).endOf('day'),
                count: 1,
                page: 1,
                rate: 'hour'
            }, {vehicle: $rootScope.vehicleType, frequency: 'hour'}, function (response) {
                //  PerformanceHandler.trips = response[0].trip
                vm.trips = PerformanceHandler.getTrips(response[0].trip)

                PerformanceService.getDrivers({
                    city: $rootScope.city,
                    startTime: moment(current).startOf('day'),
                    endTime: moment(current).endOf('day'),
                    count: 1,
                    page: 1,
                    rate: 'hour'
                }, {vehicle: $rootScope.vehicleType, frequency: 'hour'}, function (response) {
                    // PerformanceHandler.drivers = response
                    vm.drivers = PerformanceHandler.getDrivers(response)
                    vm.trips = _.union(vm.trips, vm.drivers)
                    vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'Cancelled trips (by rider)'}));
                    vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'Cancelled trips (by driver)'}));
                    vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'tCash'}));
                    vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'New Drivers'}));
                    vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'Active Drivers'}));
                    vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'Avg Trip/Driver'}));

                }, function (err) {
                    console.log(err)
                    $scope.error = true;
                });
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });

            var gradient = [
                'rgba(0, 255, 255, 0)',
                'rgba(0, 255, 255, 1)',
                'rgba(0, 191, 255, 1)',
                'rgba(0, 127, 255, 1)',
                'rgba(0, 63, 255, 1)',
                'rgba(0, 0, 255, 1)',
                'rgba(0, 0, 223, 1)',
                'rgba(0, 0, 191, 1)',
                'rgba(0, 0, 159, 1)',
                'rgba(0, 0, 127, 1)',
                'rgba(63, 0, 91, 1)',
                'rgba(127, 0, 63, 1)',
                'rgba(191, 0, 31, 1)',
                'rgba(255, 0, 0, 1)'
            ]
            // google.maps.event.addDomListener(window, 'resize', resizeMap);
            vm.resizeMap = function () {
                google.maps.event.trigger(vm.map, 'resize')
            }
            vm.heatMapDataLength;

            vm.loadHeatMap = function () {

                var from = moment(current).hour($scope.rangSlider.min).unix()
                var to = moment(current).hour($scope.rangSlider.max).unix()
                LiveService.heatmap({
                    city: $rootScope.city,
                    vehicle: $rootScope.vehicleType,
                    from: from,
                    to: to,
                    state: vm.selected.id
                }, function (response) {
                    //  PerformanceHandler.trips = response[0].trip
                    vm.heatMapDataLength = response.length;
                    var transformedData = [];
                    var pointArray = []
                    _.forEach(response, function (item) {
                        transformedData.push(new google.maps.LatLng(item.locPickupRequest.lt - 0, item.locPickupRequest.ln - 0));
                    })
            //        $scope.heatMapData = transformedData;

                    NgMap.getMap({id:'live_map'}).then(function (map) {
                        vm.map = map;
                        //   heatmap = vm.map.heatmapLayers.foo;
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
                    console.log(err)
                    $scope.error = true;
                });
            }


        }

        getLive()
        getOverviewLive()
        vm.loadHeatMap()
       var interval=  $interval(function(){
            vm.refreshPage()
        }, 30000)

        $scope.$on('$destroy', function () { $interval.cancel(interval); });
        vm.refreshPage = function () {
            getLive()
            vm.loadHeatMap()
          //  vm.loadHeatMap()
            if(vm.live)
            {
                getOverviewLive()
            }
            else {
                getOverviewBack()
            }

        }


    }
})();
