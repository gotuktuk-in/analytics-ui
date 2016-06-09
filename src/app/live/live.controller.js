(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('LiveController', LiveController);

    /** @ngInject */
    function LiveController($scope, $log, $rootScope, $state,$timeout, $stateParams, NgMap, ChartConfigService, LiveService, PerformanceService, PerformanceHandler) {
        var vm = this;
        //range slider , Failed(2), Cancel(2), Success.
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
                    showTicksValues: 1,
                	translate: function(value) {
                    return  value + 'h';
                },
                    keyboardSupport:false,
                    onEnd :function(sliderId, modelValue, highValue, pointerType){
                //    console.log(sliderId, modelValue, highValue, pointerType)
                    $scope.rangSlider.min = modelValue;
                    $scope.rangSlider.max = highValue;
                    vm.loadHeatMap()
                }
            }
		};

        $scope.ddSettings =  {enableSearch: false};
        //range slider end

        $scope.today = moment().format("dddd, MMMM Do YYYY")
        $scope.dates = {};
        $scope.dates.startDate = moment().format("YYYY-MM-DD");
        $scope.dates.endDate = moment().format("YYYY-MM-DD");
        vm.config = ChartConfigService.lineChartConfig;
        vm.tripChartOptions = angular.copy(ChartConfigService.lineChartOptions);

        vm.tripChartOptions.chart.xAxis.tickFormat = function (d) {
            return d3.time.format('%I %p')(new Date(d).addHours(1));
        };
        vm.trips = [];
        var heatmap

        function getLive() {
            LiveService.getOverview({
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType,
            }, function (response) {
                //  PerformanceHandler.trips = response[0].trip
                vm.overview = response;
                console.log('response ', vm.overview)
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });

            PerformanceService.getTrips({
                city: $rootScope.city,
                startTime: $scope.dates.startDate,
                endTime: $scope.dates.endDate,
                count: 1,
                page: 1,
                rate: 'hour'
            }, {vehicle: $rootScope.vehicleType, frequency: 'hour'}, function (response) {
                //  PerformanceHandler.trips = response[0].trip
                vm.trips = PerformanceHandler.getTrips(response[0].trip)

                PerformanceService.getDrivers({
                    city: $rootScope.city,
                    startTime: $scope.dates.startDate,
                    endTime: $scope.dates.endDate,
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
            vm.resizeMap = function ()
            {
                google.maps.event.trigger(vm.map, 'resize')
            }
            $scope.heatMapData = [];
            vm.loadHeatMap= function () {

                var from =  moment($scope.dates.startDate).hour($scope.rangSlider.min).unix()
                var to =  moment($scope.dates.startDate).hour($scope.rangSlider.max).unix()
                LiveService.heatmap({
                    city: $rootScope.city,
                    vehicle: $rootScope.vehicleType,
                    from: from,
                    to: to,
                    state: vm.selected.id
                }, function (response) {
                    //  PerformanceHandler.trips = response[0].trip
                    var transformedData = [];
                    var pointArray = []
                    _.forEach(response, function (item) {
                        transformedData.push(new google.maps.LatLng(item.locPickupRequest.lt - 0, item.locPickupRequest.ln - 0));
                    })
                    //$scope.heatMapData = transformedData;
                    NgMap.getMap().then(function (map) {
                        vm.map = map;
                     //   heatmap = vm.map.heatmapLayers.foo;
                        if(heatmap )
                        {
                            heatmap.setMap(null);
                        }
                        pointArray = new google.maps.MVCArray(transformedData);
                        heatmap = new google.maps.visualization.HeatmapLayer({
                            data: pointArray
                        });
                        heatmap.setMap(vm.map);
                    });


                    //$scope.heatMapData = _.map(response,
                    //    function (obj) {
                    //        return new google.maps.LatLng(obj.locPickupRequest.lt - 0, obj.locPickupRequest.ln - 0)
                    //        //  [obj.locPickupRequest.lt, obj.locPickupRequest.ln]
                    //    });
                    //console.log('response ', $scope.heatMapData)
                }, function (err) {
                    console.log(err)
                    $scope.error = true;
                });
            }

            vm.loadHeatMap()
        }

        getLive()

        vm.refreshPage = function()
        {
            vm.loadHeatMap()
            getLive()
        }


    }
})();
