(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('LiveController', LiveController);

    /** @ngInject */
    function LiveController($scope, $log, $rootScope, $state, $interval, $stateParams, NgMap, ChartConfigService, LiveService, PerformanceService, PerformanceHandler, LiveHandler) {
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

        $scope.ddSettings = {enableSearch: false};
        //range slider end

        $scope.date = moment().format("dddd, MMMM Do YYYY")
        vm.config = ChartConfigService.lineChartConfig;
        vm.tripChartOptions = angular.copy(ChartConfigService.lineChartOptions);
        vm.newRidersChartOptions = angular.copy(ChartConfigService.multiBarChartOptions);
        vm.newRidersChartOptions.chart.tooltip = {
            contentGenerator: function (key, x, y, e, graph) { //return html content
                var data = key.data
                var formateDate;
                if (data.date === 'Others')
                    formateDate = 'Above 7 days';
                else
                    formateDate = moment(PerformanceHandler.getLongDate(data.date.toString())).format('MMMM Do YYYY');
                var str = '<div class="pd-10 text-left"><span><b>'
                str += formateDate + ' </b></span>' + ''
                //str += '<h6>New Rider Registered</h6>' + data.newRiderRegCount + ''
                str += '<h3 class="no-mr">' + data.y + '<small style="color:#333;"> /' + data.uniqRides + '</small><br><small style="font-size:10px;color:#666;text-transform: uppercase;">Total Rides / Rides(U)</small></h3>'
                // str += '<h1>Date</h1>' + data.date + '/n'
                str += '</div>'
                return str;
            }
        }

        /*** code starts for Chart of canceld trip by Driver ***/
        vm.drRideCancelReasonCode = {'dCR_TYRE_FLAT':'Flat tyre', 'dCR_VEH_ISSUE':'Vehicle issues', 'dCR_STUCK_TRAFFIC':'Stuck in traffic', 'dCR_CUSTOMER_LATE':'Customer is late'};
        vm.cancelTripByDriverChartOptions = angular.copy(ChartConfigService.pieChartOptions);
        vm.cancelTripByDriverChartOptions.chart.x = function (d) {
            //console.log(vm.drRideCancelReasonCode[d.label]);
            return vm.drRideCancelReasonCode[d.label];
        }
        /*** code ends for Chart of canceld trip by Driver ***/
        /*** code starts for Chart of canceld trip by Rider ***/
        vm.rdRideCancelReasonCode = {
            "rCR_MIND_CHANGE":"Changed my mind",
            "rCR_ROUTE_CHANGE":"Changed the route",
            "rCR_NOT_INTEREST":"not need the ride anymore",
            "rCR_DRIVER_ASKED_TO":"Driver asked to cancel",
            "rCR_OTHER":"Other",
            "rCR_BEFORE_CONFIRM":"Ride canceled before confirmation"};

        vm.cancelTripByRiderChartOptions = angular.copy(ChartConfigService.pieChartOptions);
        vm.cancelTripByRiderChartOptions.chart.x = function (d) {
            console.log(d.label);
            //return d.label
            return vm.rdRideCancelReasonCode[d.label];
        } /**/
        /*** code ends for Chart of canceld trip by Rider ***/

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
                getCanceledTripByDriver()
                getCanceledTripByRider()
            }
            getLive()
            getNewRiders()
            vm.loadHeatMap()
            getCanceledTripByDriver()
            getCanceledTripByRider()
        }
        /*** rest call for barchart for canceld trip by driver code starts ***/
        function getCanceledTripByDriver(){
            vm.canceledTripByDriver = [];

            LiveService.getCancelTripsDriver({
               startTime: moment(current).startOf('day'),
                endTime: moment(current).endOf('day'),
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType
            }, function (response){
                console.log(response);
                vm.canceledTripByDriver = LiveHandler.canTripDriver(response);
                console.log('hey ', vm.canceledTripByDriver);
            }, function (err){
                console.log(err)
                $scope.error = true;
            })
        }
        /*** rest call for barchart for canceld trip by driver code ends ***/

        /*** rest call for barchart for canceld trip by Rider code starts ***/
        function getCanceledTripByRider(){
           vm.canceledTripByRider = [];
            LiveService.getCancelTripsRider({
               startTime: moment(current).startOf('day'),
                endTime: moment(current).endOf('day'),
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType
            }, function (response){
                console.log(response);
                vm.canceledTripByRider = LiveHandler.canTripRider(response);
                console.log('heyfsfsf ', vm.canceledTripByRider);
            }, function (err){
                console.log(err)
                $scope.error = true;
            })
        }
        /*** rest call for barchart for canceld trip by Rider code ends ***/

        function getOverviewLive() {
            LiveService.getOverview({
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType
            }, function (response) {
                vm.overview = response;
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }
        function getNewRiders() {
            LiveService.getNewRiders({
                from: moment(current).subtract(6, 'days').startOf('day').unix(),
                to: moment(current).endOf('day').unix()
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
            var riders = JSON.parse(angular.toJson(ridresData));
            var count = 0
            var i = 0
            var labelsArr = ['today', '1 day ago', '2 day ago', '3 day ago', '4 day ago', '5 day ago', '6 day ago', 'Above 7 days']

            _.each(riders, function (rides) {
                var obj = {}
                //obj.key = moment(PerformanceHandler.getLongDate(rides.date)).format('MMMM Do YYYY')
                obj.key = labelsArr[i]
                obj.bar = true;
                obj.values = []
                data.push(obj)
                i++
            })
            var obj = {}
            //obj.key = moment(PerformanceHandler.getLongDate(rides.date)).format('MMMM Do YYYY')
            obj.key = labelsArr[i]
            obj.bar = true;
            obj.values = []
            data.push(obj);
            _.each(riders, function (rides) {
                var ridesByDay = rides;
                for (var a = 0; a <= 7; a++) {
                    data[a].values[count] = {}
                    data[a].values[count].x = PerformanceHandler.getLongDate(ridesByDay.date)
                    data[a].values[count].y = Number(rides.value[a].totalRides)
                    data[a].values[count].uniqRides = Number(rides.value[a].uniqRides)
                    //  data[a].values[count].newRiderRegCount = Number(rides.value[a].newRiderRegCount)
                    if (rides.value[a].id === 'Others')
                        data[a].values[count].date = rides.value[a].id
                    else
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
                endTime: moment(current).endOf('day')
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
        getCanceledTripByDriver()
        getCanceledTripByRider()
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
            getNewRiders()
            if (vm.live) {
                getOverviewLive()
                getCanceledTripByDriver()
                getCanceledTripByRider()
            }
            else {
                getOverviewBack()
            }

        }


    }
})();
