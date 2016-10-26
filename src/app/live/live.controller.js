(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('LiveController', LiveController);

    /** @ngInject */
    function LiveController($scope, $log, $rootScope, $state, $interval, $stateParams, NgMap, ChartConfigService, LiveService, PerformanceService, PerformanceHandler, LiveHandler) {

        var vm = this;
        var today = moment();
        Array.prototype.sum = function (prop) {
            var total = 0;
            for (var i = 0, _len = this.length; i < _len; i++) {
                total += this[i][prop]
            }
            return total
        };

        $scope.date = moment().format("ddd, MMM Do YYYY");
        vm.config = ChartConfigService.lineChartConfig;
        vm.tripChartOptions = angular.copy(ChartConfigService.lineChartOptions);

        /*** code starts for Chart of canceld trip by Driver ***/
        vm.drRideCancelReasonCode = {
            'dCR_TYRE_FLAT': 'Flat tyre',
            'dCR_VEH_ISSUE': 'Vehicle issues',
            'dCR_STUCK_TRAFFIC': 'Stuck in traffic',
            'dCR_CUSTOMER_LATE': 'Customer is late',
            'dCR_CUSTOMER_NOT_RESPONDED' : 'Customer not responded'
        };
        vm.cancelTripByDriverChartOptions = angular.copy(ChartConfigService.pieChartOptions);
        vm.cancelTripByDriverChartOptions.chart.x = function (d) {
            return vm.drRideCancelReasonCode[d.label];
        };
        /*** code ends for Chart of canceld trip by Driver ***/
        /*** code starts for Chart of canceld trip by Rider ***/
        vm.rdRideCancelReasonCode = {
            "rCR_MIND_CHANGE": "Changed my Mind",
            "rCR_ROUTE_CHANGE": "Changed the Route",
            "rCR_NOT_INTEREST": "Not need the ride anymore",
            "rCR_DRIVER_ASKED_TO": "Driver asked to cancel",
            "rCR_OTHER": "Other",
            "rCR_BEFORE_CONFIRM": "Ride canceled before confirmation"
        };

        vm.cancelTripByRiderChartOptions = angular.copy(ChartConfigService.pieChartOptions);
        vm.cancelTripByRiderChartOptions.chart.x = function (d) {
            return vm.rdRideCancelReasonCode[d.label];
        };
        /**/
        /*** code ends for Chart of canceld trip by Rider ***/



        var current = moment();
        vm.live = true;
        vm.changeDate = function (to) {

            if (to == 'next') {
                current = moment(current).add(1, 'day');
                $scope.date = moment(current).format("dddd, MMMM Do YYYY");

            }
            else {
                current = moment(current).subtract(1, 'day');
                $scope.date = moment(current).format("dddd, MMMM Do YYYY");

                console.log('$scope.date ', $scope.date)
            }
            if (moment(current).unix() == moment(today).unix()) {
                vm.live = true;
                getOverviewLive();
            }
            else {
                vm.live = false;
                getOverviewBack();
                getCanceledTripByDriver();
                getCanceledTripByRider();
            }
            getLive();
            getCanceledTripByDriver();
            getCanceledTripByRider();
        };
        /*** rest call for barchart for canceld trip by driver code starts ***/
        function getCanceledTripByDriver() {
            vm.canceledTripByDriver = [];

            LiveService.getCancelTripsDriver({
                startTime: moment(current).startOf('day'),
                endTime: moment(current).endOf('day'),
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType
            }, function (response) {
                //console.log(response);
                vm.canceledTripByDriver = LiveHandler.canTripDriver(response);
                $scope.totalCanDriver = vm.canceledTripByDriver.sum("value");

            }, function (err) {
                console.log(err);
                $scope.error = true;
            })
        }
        /*** rest call for barchart for canceld trip by driver code ends ***/
        /*** rest call for barchart for canceld trip by Rider code starts ***/
        function getCanceledTripByRider() {
            vm.canceledTripByRider = [];
            LiveService.getCancelTripsRider({
                startTime: moment(current).startOf('day'),
                endTime: moment(current).endOf('day'),
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType
            }, function (response) {
                //console.log(response);
                vm.canceledTripByRider = LiveHandler.canTripRider(response);
                $scope.totalCanRider = vm.canceledTripByRider.sum("value");

            }, function (err) {
                console.log(err);
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
                console.log(err);
                $scope.error = true;
            });
        }
        function getOverviewBack() {
            LiveService.getOverview({
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType,
                startTime: moment(current).startOf('day'),
                endTime: moment(current).endOf('day')
            }, function (response) {
                vm.overview = response;
            }, function (err) {
                console.log(err);
                $scope.error = true;
            });
        }

        //trip start
        vm.tripChartOptions = angular.copy(ChartConfigService.multiBarChartOptions);
        vm.tripFrequency = "hour";

        vm.tripChartOptions.chart.xAxis.tickFormat = function (d) {
            return d3.time.format('%I %p')(new Date(d).addHours(1));
        };
        vm.tripData = [];

        vm.getTrips = function () {
            LiveService.getTrips({
                    city: $rootScope.city,
                    vehicle: $rootScope.vehicleType,
                    startTime: moment(current).startOf('day'),
                    endTime: moment(current).endOf('day'),
                    rate: vm.tripFrequency,
                    count: 1,
                    page: 1
                }, {
                    vehicle: $rootScope.vehicleType,
                    frequency: vm.tripFrequency
                },
                function (response){
                    vm.tripData = transformTrips(response).map(function (series) {
                        series.values = series.values.map(function (d) {
                            return {x: d[0], y: d[1]}
                        });
                        return series;
                    });
                }, function (err) {
                    console.log(err);
                    $scope.error = true;
                });
        };

        function transformTrips(data) {
            var transformed = [];
            $scope.rT = 0;
            $scope.rUT = 0;
            $scope.cT =  0;
            $scope.cUT = 0;
            $scope.fT = 0;
            $scope.fUT =  0;
            $scope.faT =  0;
            $scope.faUT =  0;
            data = angular.fromJson(data);
            var newTripData = data[0].trip;
            console.log(newTripData.length);
            for (var a = 0; a < newTripData.length; a++) {
                $scope.rT += data[0].trip[a].requests.total;
                $scope.rUT += data[0].trip[a].requests.unique_riders;
                $scope.cT += data[0].trip[a].cancelled.total;
                $scope.cUT += data[0].trip[a].cancelled.unique;
                $scope.fT += data[0].trip[a].success.total;
                $scope.fUT += data[0].trip[a].success.unique_riders;
                $scope.faT += data[0].trip[a].failed.total;
                $scope.faUT += data[0].trip[a].failed.unique_riders;
            }


            //
            var arr = [
                'Requests(' + $scope.rT + ') ' ,
                'Requests(U ' + $scope.rUT + ') ' ,
                'Cancelled(' + $scope.cT + ') ' ,
                'Cancelled(U ' + $scope.cUT + ') ' ,
                'Fulfilled(' + $scope.fT + ') ' ,
                'Fulfilled(U ' + $scope.fUT + ') ' ,
                'Failed(' + $scope.faT + ') ' ,
                'Failed(U ' + $scope.faUT + ') '
            ];
            var newObj = {};
            newObj.key = arr[0];
            newObj.values = [];
            newObj.bar = true;
            for (var a = 0; a < newTripData.length; a++) {
                var x = moment(LiveHandler.getLongDate(data[0].trip[a].id)).unix() * 1000;
                newObj.values.push([x, data[0].trip[a].requests.total]);
            }
            transformed.push(newObj);

            var newObj = {};
            newObj.key = arr[1];
            newObj.values = [];
            newObj.bar = true;
            for (var a = 0; a < newTripData.length; a++) {
                var x = moment(LiveHandler.getLongDate(data[0].trip[a].id)).unix() * 1000;
                newObj.values.push([x, data[0].trip[a].requests.unique_riders]);
            }
            transformed.push(newObj);

            var newObj = {};
            newObj.key = arr[2];
            newObj.values = [];
            newObj.bar = true;
            for (var a = 0; a < newTripData.length; a++) {
                var x = moment(LiveHandler.getLongDate(data[0].trip[a].id)).unix() * 1000;
                newObj.values.push([x, data[0].trip[a].cancelled.total]);
            }
            transformed.push(newObj);

            var newObj = {};
            newObj.key = arr[3];
            newObj.values = [];
            newObj.bar = true;
            for (var a = 0; a < newTripData.length; a++) {
                var x = moment(LiveHandler.getLongDate(data[0].trip[a].id)).unix() * 1000;
                newObj.values.push([x, data[0].trip[a].cancelled.unique]);
            }
            transformed.push(newObj);

            var newObj = {};
            newObj.key = arr[4];
            newObj.values = [];
            newObj.bar = true;
            for (var a = 0; a < newTripData.length; a++) {
                var x = moment(LiveHandler.getLongDate(data[0].trip[a].id)).unix() * 1000;
                newObj.values.push([x, data[0].trip[a].success.total]);
            }
            transformed.push(newObj);

            var newObj = {};
            newObj.key = arr[5];
            newObj.values = [];
            newObj.bar = true;
            for (var a = 0; a < newTripData.length; a++) {
                var x = moment(LiveHandler.getLongDate(data[0].trip[a].id)).unix() * 1000;
                newObj.values.push([x, data[0].trip[a].success.unique_riders]);
            }
            transformed.push(newObj);

            var newObj = {};
            newObj.key = arr[6];
            newObj.values = [];
            newObj.bar = true;
            for (var a = 0; a < newTripData.length; a++) {
                var x = moment(LiveHandler.getLongDate(data[0].trip[a].id)).unix() * 1000;
                newObj.values.push([x, data[0].trip[a].failed.total]);
            }
            transformed.push(newObj);
            var newObj = {};
            newObj.key = arr[7];
            newObj.values = [];
            newObj.bar = true;
            for (var a = 0; a < newTripData.length; a++) {
                var x = moment(LiveHandler.getLongDate(data[0].trip[a].id)).unix() * 1000;
                newObj.values.push([x, data[0].trip[a].failed.unique_riders]);
            }
            transformed.push(newObj);

            return transformed;
        }

        vm.getTrips();
        //trip end

        //function getLive() {
        //    PerformanceService.getTrips({
        //        city: $rootScope.city,
        //        startTime: moment(current).startOf('day'),
        //        endTime: moment(current).endOf('day'),
        //        count: 1,
        //        page: 1,
        //        rate: 'hour'
        //    }, {vehicle: $rootScope.vehicleType, frequency: 'hour'}, function (response) {
        //        //  PerformanceHandler.trips = response[0].trip
        //        vm.trips = PerformanceHandler.getTrips(response[0].trip);
        //        PerformanceService.getDrivers({
        //            city: $rootScope.city,
        //            startTime: moment(current).startOf('day'),
        //            endTime: moment(current).endOf('day'),
        //            count: 1,
        //            page: 1,
        //            rate: 'hour'
        //        }, {vehicle: $rootScope.vehicleType, frequency: 'hour'}, function (response) {
        //            vm.drivers = PerformanceHandler.getDrivers(response);
        //            vm.trips = _.union(vm.trips, vm.drivers);
        //            vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'Cancelled trips (by rider)'}));
        //            vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'Cancelled trips (by driver)'}));
        //            vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'tCash'}));
        //            vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'New Drivers'}));
        //            vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'Active Drivers'}));
        //            vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'Avg Trip/Driver'}));
        //
        //        }, function (err) {
        //            console.log(err);
        //            $scope.error = true;
        //        });
        //    }, function (err) {
        //        console.log(err);
        //        $scope.error = true;
        //    });
        //
        //}

        //getLive();
        getOverviewLive();
        getCanceledTripByDriver();
        getCanceledTripByRider();

        vm.refreshPage = function () {
            //getLive();
            vm.getTrips();
            if (vm.live) {
                getOverviewLive();
                getCanceledTripByDriver();
                getCanceledTripByRider()
            }
            else {
                getOverviewBack()
            }

        }


    }
})();
