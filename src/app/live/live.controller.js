(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('LiveController', LiveController);

    /** @ngInject */
    function LiveController($scope, $log, $rootScope, $state, $stateParams, NgMap, ChartConfigService, LiveService, PerformanceService, PerformanceHandler) {
        var vm = this;
		//range slider , Failed(2), Cancel(2), Success.
		vm.heatMapFilers = [{name:"Request" , value:'20'},{name:"Failed" , value:'72,82'}, {name:"Cancel" , value:'70,71'}, {name:"Success" , value:'61'}]
        vm.selected = vm.heatMapFilers[0]
        $scope.rangSlider = {
    			max: 24,
    			min: 1,
				};
				
		//range slider end
       
        $scope.today = moment().format("dddd, MMMM Do YYYY")
        $scope.dates = {};
        $scope.dates.startDate = moment().format("YYYY-MM-DD");
        $scope.dates.endDate = moment().format("YYYY-MM-DD");
        vm.config = ChartConfigService.lineChartConfig;
        vm.tripChartOptions = angular.copy(ChartConfigService.lineChartOptions);

        vm.tripChartOptions.chart.xAxis.tickFormat = function (d) {
            return d3.time.format('%I %p')(new Date(d));
        };
        vm.trips = [];
        var heatmap
        NgMap.getMap().then(function(map) {
            vm.map = map;
           // heatmap = vm.map.heatmapLayers.foo;
           // heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
        });
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
                    vm.trips = _.union( vm.trips, vm.drivers)
                    vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'Cancelled trips (by rider)'}));
                    vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'Cancelled trips (by driver)'}));
                    vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'tCash'}));
                    vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'New Drivers'}));

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
            vm.heatMapData = [
                new google.maps.LatLng(37.782551, -122.445368),
                new google.maps.LatLng(37.782745, -122.444586),
                new google.maps.LatLng(37.782842, -122.443688),
                new google.maps.LatLng(37.782919, -122.442815),
                new google.maps.LatLng(37.782992, -122.442112)]
            function loadHeatMap()
            {

                LiveService.heatmap({
                    city: $rootScope.city,
                    vehicle: $rootScope.vehicleType,
                    from:  moment($scope.dates.startDate).unix()
                }, function (response) {
                    //  PerformanceHandler.trips = response[0].trip
                   // vm.heatMapData = _.map( response , function(obj){ return [obj.locPickupRequest.lt, obj.locPickupRequest.ln] });
                    console.log('response ', vm.heatMapData)
                }, function (err) {
                    console.log(err)
                    $scope.error = true;
                });
            }
            loadHeatMap()
        }

        getLive()
    }
})();
