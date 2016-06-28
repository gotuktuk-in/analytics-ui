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
        var heatmap;
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
        vm.newRidersChartOptions = angular.copy(ChartConfigService.multiBarChartOptions);

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

        function getOverviewLive() {
            LiveService.getOverview({
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType,
            }, function (response) {
                vm.overview = response;
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }
        vm.newRiders =[ {
         "values":[
         {x:1359072000000, y:10,label:'C1.1'},
         {x:1365116400000, y:30,label:'C1.2'},
         {x:1357516800000, y:40,label:'C1.3'},
         ],
         "bar":true,
         "key":"Carrier1"

         },
         {
         "values":[
         {x:1359072000000, y:30,label:'C2.1'},
         {x:1365116400000, y:10,label:'C2.2'},
         {x:1357516800000, y:79,label:'C2.3'},
         ],
         "bar":true,
         "key":"Carrier2"

         }
         ]
var a = [{"20160624":{"20160618":{"rider":20,"trips":60,"uniqtrips":40},"20160619":{"rider":50,"trips":90,"uniqtrips":50},"20160620":{"rider":20,"trips":50,"uniqtrips":30},"20160621":{"rider":40,"trips":70,"uniqtrips":67},"20160622":{"rider":10,"trips":20,"uniqtrips":17},"20160623":{"rider":30,"trips":40,"uniqtrips":38},"20160624":{"rider":20,"trips":50,"uniqtrips":30},"totalrides":400}},{"20160623":{"20160617":{"rider":70,"trips":100,"uniqtrips":98},"20160618":{"rider":20,"trips":60,"uniqtrips":40},"20160619":{"rider":50,"trips":90,"uniqtrips":50},"20160620":{"rider":20,"trips":50,"uniqtrips":30},"20160621":{"rider":40,"trips":70,"uniqtrips":67},"20160622":{"rider":10,"trips":20,"uniqtrips":17},"20160623":{"rider":30,"trips":40,"uniqtrips":38},"totalrides":500}},{"20160622":{"20160616":{"rider":80,"trips":110,"uniqtrips":98},"20160617":{"rider":70,"trips":100,"uniqtrips":98},"20160618":{"rider":20,"trips":60,"uniqtrips":40},"20160619":{"rider":50,"trips":90,"uniqtrips":50},"20160620":{"rider":20,"trips":50,"uniqtrips":30},"20160621":{"rider":40,"trips":70,"uniqtrips":67},"20160622":{"rider":10,"trips":20,"uniqtrips":17},"totalrides":600}},{"20160621":{"20160615":{"rider":60,"trips":90,"uniqtrips":88},"20160616":{"rider":80,"trips":110,"uniqtrips":98},"20160617":{"rider":70,"trips":100,"uniqtrips":98},"20160618":{"rider":20,"trips":60,"uniqtrips":40},"20160619":{"rider":50,"trips":90,"uniqtrips":50},"20160620":{"rider":20,"trips":50,"uniqtrips":30},"20160621":{"rider":40,"trips":70,"uniqtrips":67},"totalrides":400}},{"20160620":{"20160614":{"rider":90,"trips":190,"uniqtrips":188},"20160615":{"rider":60,"trips":90,"uniqtrips":88},"20160616":{"rider":80,"trips":110,"uniqtrips":98},"20160617":{"rider":70,"trips":100,"uniqtrips":98},"20160618":{"rider":20,"trips":60,"uniqtrips":40},"20160619":{"rider":50,"trips":90,"uniqtrips":50},"20160620":{"rider":20,"trips":50,"uniqtrips":30},"totalrides":300}},{"20160619":{"20160613":{"rider":10,"trips":20,"uniqtrips":18},"20160614":{"rider":90,"trips":190,"uniqtrips":188},"20160615":{"rider":60,"trips":90,"uniqtrips":88},"20160616":{"rider":80,"trips":110,"uniqtrips":98},"20160617":{"rider":70,"trips":100,"uniqtrips":98},"20160618":{"rider":20,"trips":60,"uniqtrips":40},"20160619":{"rider":50,"trips":90,"uniqtrips":50},"totalrides":200}},{"20160618":{"20160612":{"rider":100,"trips":120,"uniqtrips":118},"20160613":{"rider":10,"trips":20,"uniqtrips":18},"20160614":{"rider":90,"trips":190,"uniqtrips":188},"20160615":{"rider":60,"trips":90,"uniqtrips":88},"20160616":{"rider":80,"trips":110,"uniqtrips":98},"20160617":{"rider":70,"trips":100,"uniqtrips":98},"20160618":{"rider":20,"trips":60,"uniqtrips":40},"totalrides":700}}]
        function getNewRiders() {
            LiveService.getNewRiders({
                from: moment(current).subtract(6, 'days').startOf('day').unix(),
                to: moment(current).endOf('day').unix(),
            }, function (response) {
                vm.newRiders = transformNewRiders(response);
               console.log('response ', vm.newRiders)
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }

        function transformNewRiders(ridresData) {
            var data = []
            var riders =JSON.parse(angular.toJson(ridresData));
            var count = 0
            var i=0
            var labelsArr = ['today','1 day ago','2 day ago','3 day ago','4 day ago','5 day ago','6 day ago','Others']
            _.each(riders, function(rides){
                var obj = {}
                //obj.key = moment(PerformanceHandler.getLongDate(rides.date)).format('MMMM Do YYYY')
                obj.key = labelsArr[i]
                obj.bar = true;
                obj.values = []
                data.push(obj)
                i++
            })
            _.each(riders, function(rides){
                var ridesByDay = rides;
               for (var a=0;a<=6;a++)
                {
                    data[a].values[count] = {}
                    data[a].values[count].x = PerformanceHandler.getLongDate(ridesByDay.date)
                    data[a].values[count].y = Number(rides.value[a].totalRides)
                    data[a].values[count].uniqRides = Number(rides.value[a].uniqRides)
                  //  data[a].values[count].newRiderRegCount = Number(rides.value[a].newRiderRegCount)
                    data[a].values[count].date = Number(rides.value[a].id)
                }
                count++
            })
            return data;
        }

        getNewRiders()
        function getOverviewBack() {
            LiveService.getOverview({
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType,
                startTime: moment(current).startOf('day'),
                endTime: moment(current).endOf('day'),
            }, function (response) {
                //  PerformanceHandler.trips = response[0].trip
                vm.overview = response;
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

                    NgMap.getMap({id: 'live_map'}).then(function (map) {
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
        var interval = $interval(function () {
            vm.refreshPage()
        }, 30000)

        $scope.$on('$destroy', function () {
            $interval.cancel(interval);
        });
        vm.refreshPage = function () {
            getLive()
            vm.loadHeatMap()
            //  vm.loadHeatMap()
            if (vm.live) {
                getOverviewLive()
            }
            else {
                getOverviewBack()
            }

        }


    }
})();
