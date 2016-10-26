(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('TripsController', TripsController);

    /** @ngInject */
    function TripsController($scope, $filter, StaticDataService, ChartConfigService, TripsService, LiveService, $rootScope, TripsHandler, LiveHandler) {

        var vm = this;
        var today = moment();
        var current = moment();

        vm.termURL = 'd';
        vm.filterURL = 'id';
        vm.statusURL = 0;
        vm.startDateURL = moment(today).startOf('day').format("YYYYMMDD").toString();
        vm.endDateURL = moment(today).endOf('day').format("YYYYMMDD").toString();


        vm.live = true;
        vm.showTableData = false;
        var startDate, endDate;
        vm.ranges = StaticDataService.ranges;
        $scope.date = moment().format("dddd, MMMM Do YYYY");
        $scope.dateURL = moment().format("DD/MM/YYYY");

        $scope.tripDates = {};
        $scope.tripDates.startDate = StaticDataService.ranges['Last 7 Days'][0]; //moment().subtract(1, 'days').format("YYYY-MM-DD");
        $scope.tripDates.endDate = StaticDataService.ranges['Last 7 Days'][1]; //moment().subtract(1, 'days').format("YYYY-MM-DD");

        $scope.burnDates = {};
        $scope.burnDates.startDate = StaticDataService.ranges['Last 7 Days'][0]; //moment().subtract(1, 'days').format("YYYY-MM-DD");
        $scope.burnDates.endDate = StaticDataService.ranges['Last 7 Days'][1]; //moment().subtract(1, 'days').format("YYYY-MM-DD");

        $scope.rideDates = {};
        $scope.rideDates.startDate = StaticDataService.ranges['Last 7 Days'][0]; //moment().subtract(1, 'days').format("YYYY-MM-DD");
        $scope.rideDates.endDate = StaticDataService.ranges['Last 7 Days'][1]; //moment().subtract(1, 'days').format("YYYY-MM-DD");


        vm.timeFrequency = [{label: "Per Hour", value: "hour"}, {label: "Per Day", value: "day"}];
        vm.tripFrequency = {value: "day"};
        vm.config = ChartConfigService.lineChartConfig;


        vm.newRidersChartOptions = angular.copy(ChartConfigService.multiBarChartOptions);
        vm.newRidersChartOptions.chart.tooltip = {
            contentGenerator: function (key, x, y, e, graph) { //return html content
                var data = key.data;
                var formateDate;
                if (data.date === 'Others')
                    formateDate = 'Before a day';
                else
                    formateDate = moment(TripsHandler.getLongDate(data.date.toString())).format('MMMM Do YYYY');
                var str = '<div class="pd-10 text-left"><span><b>';
                str += formateDate + ' </b></span>' + '';
                //str += '<h6>New Rider Registered</h6>' + data.newRiderRegCount + ''
                //str += '<h3 class="no-mr">' + data.y + '<small style="color:#333;"> /' + data.uniqRides + '</small><br><small style="font-size:10px;color:#666;text-transform: uppercase;">Total Rides / Rides(U)</small></h3>'
                str += '<h3 class="no-mr">' + data.y + '<small style="color:#333;"> /' + data.uniqRides + '</small></h3>';
                // str += '<h1>Date</h1>' + data.date + '/n'
                str += '</div>';
                return str;
            }
        };

        /*** code starts for Chart of cancelled ***/
        Array.prototype.sum = function (prop) {
            var total = 0;
            for (var i = 0, _len = this.length; i < _len; i++) {
                total += this[i][prop]
            }
            return total
        };
        vm.drRideCancelReasonCode = {
            'dCR_TYRE_FLAT': 'Flat tyre',
            'dCR_VEH_ISSUE': 'Vehicle issues',
            'dCR_STUCK_TRAFFIC': 'Stuck in traffic',
            'dCR_CUSTOMER_LATE': 'Customer is late',
            'dCR_CUSTOMER_NOT_RESPONDED': 'Customer not responded'
        };
        vm.cancelTripByDriverChartOptions = angular.copy(ChartConfigService.pieChartOptions);
        vm.cancelTripByDriverChartOptions.chart.x = function (d) {
            //console.log(vm.drRideCancelReasonCode[d.label]);
            return vm.drRideCancelReasonCode[d.label];
        };

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
            //console.log(d.label);
            //return d.label
            return vm.rdRideCancelReasonCode[d.label];
        };

        function getCancelledTripByDriver() {
            vm.cancelledTripByDriver = [];
            LiveService.getCancelTripsDriver({
                startTime: $scope.tripDates.startDate,
                endTime: $scope.tripDates.endDate,
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType
            }, function (response) {
                //console.log(response);
                vm.cancelledTripByDriver = LiveHandler.canTripDriver(response);
                $scope.totalCanDriver = vm.cancelledTripByDriver.sum("value");

            }, function (err) {
                console.log(err);
                $scope.error = true;
            })
        }

        function getCancelledTripByRider() {
            vm.cancelledTripByRider = [];
            LiveService.getCancelTripsRider({
                startTime: $scope.tripDates.startDate,
                endTime: $scope.tripDates.endDate,
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType
            }, function (response) {
                //console.log(response);
                vm.cancelledTripByRider = LiveHandler.canTripRider(response);
                $scope.totalCanRider = vm.cancelledTripByRider.sum("value");

            }, function (err) {
                console.log(err);
                $scope.error = true;
            })
        }

        /*** rest call for barchart for cancelled ends ***/



        vm.tripChartOptions = angular.copy(ChartConfigService.multiBarChartOptions);
        vm.burnChartOptions = angular.copy(ChartConfigService.multiBarChartOptions);
        vm.tcashChartOptions = angular.copy(ChartConfigService.multiBarChartOptions);
        vm.tcashChartOptions.chart.xAxis = {
            rotateLabels: '-90',
            axisLabel: '',
            tickFormat: function (d) {
                var dx = vm.tcashData[0].values[d] && vm.tcashData[0].values[d].x || 0;
                if (dx > 0) {
                    return d3.time.format('%d %b %y')(new Date(dx))
                }
                return null;
            }
        };
        vm.onDateChangeTrips = function (freqModel) {
            vm.diffDays = Math.floor(( $scope.tripDates.endDate - $scope.tripDates.startDate ) / 86400000) + 1;
            vm.changeFrequencyTrips(freqModel);
        };

        vm.changeFrequencyTrips = function (freqModel) {
            vm.tripChartOptions.chart.xAxis.axisLabel = freqModel;
            if (vm.diffDays < 4) {
                vm.tripFrequency = {value: "hour"};
                vm.tripChartOptions.chart.xAxis.tickFormat = function (d) {
                    //return d3.time.format('%d %b %I %p')(new Date(d).addHours(1));
                    return d3.time.format('%I %p')(new Date(d).addHours(1));
                };
            }
            else {
                vm.tripFrequency = {value: "day"};
                vm.tripChartOptions.chart.xAxis.tickFormat = function (d) {
                    return d3.time.format('%d %b %y')(new Date(d));
                };
            }
            vm.getTrips()
        };

        vm.onDateChangeRide = function () {
            getNewRiders();
        };
        vm.onDateChangeBurn = function () {
            vm.getBurn();
        };
        vm.onDateChangeTripsCancelled = function () {
            getCancelledTripByDriver();
            getCancelledTripByRider();
        };
        //vm.onDateChangeTcash = function () {
        //    vm.getTCash();
        //};
        vm.onDateChange = function () {
            //vm.getTCash();
            vm.getTrips();
            vm.getBurn();
            vm.onDateChangeTripsCancelled();
            getNewRiders();
        };


        function getNewRiders() {
            var newRideStartDate = moment($scope.rideDates.startDate).startOf('day').unix();
            var newRideEndDate = moment($scope.rideDates.endDate).unix();

            TripsService.getNewRiders({
                from: newRideStartDate,
                to: newRideEndDate
            }, function (response) {
                vm.newRiders = transformNewRiders(response);
            }, function (err) {
                console.log(err);
                $scope.error = true;
            });
        }

        function transformNewRiders(ridresData) {
            var data = [];
            var riders = JSON.parse(angular.toJson(ridresData));
            var count = 0;
            var i = 0;
            var labelsArr = ['today', '1 day ago', '2 day ago', '3 day ago', '4 day ago', '5 day ago', '6 day ago', 'Before a day'];
            for (var a = 0; a <= 7; a++) {
                var obj = {};
                obj.key = labelsArr[i];
                obj.bar = true;
                obj.values = [];
                data.push(obj);
                i++;
            };
            _.each(riders, function (rides) {
                var ridesByDay = rides;
                for (var a = 0; a <= 7; a++) {
                    var total = rides.value[a] ? rides.value[a].totalRides : 0;
                    var uniqRides = rides.value[a] ? rides.value[a].uniqRides : 0;
                    var id = rides.value[a] ? rides.value[a].id : 0;
                    data[a].values[count] = {};
                    data[a].values[count].x = TripsHandler.getLongDate(ridesByDay.date);
                    data[a].values[count].y = Number(total);
                    data[a].values[count].uniqRides = Number(uniqRides);
                    if (id === 'Others')
                        data[a].values[count].date = rides.value[a].id || 0;
                    else
                        data[a].values[count].date = Number(id);
                }
                count++
            });
            return data;
        }

        //vm.getTCash = function () {
        //    TripsService.getTCash({
        //        city: $rootScope.city,
        //        startTime: $scope.tripDates.startDate,
        //        endTime: $scope.tripDates.endDate,
        //        vehicle: $rootScope.vehicleType
        //    }, {}, function (response) {
        //        //  TripsHandler.trips = response[0].trip
        //        vm.tcashData = transformTCash(response).map(function (series) {
        //            series.values = series.values.map(function (d) {
        //                return {x: d[0], y: d[1]}
        //            });
        //            return series;
        //        });
        //    }, function (err) {
        //        console.log(err);
        //        $scope.error = true;
        //    });
        //};
        //
        //function transformTCash(data) {
        //    var transformed = [];
        //    data = angular.fromJson(data);
        //    var arr = ['tCash', 'Trip'];
        //    var newObj = {};
        //    newObj.key = arr[0];
        //    newObj.values = [];
        //    newObj.bar = true;
        //    for (var a = 0; a < data.length; a++) {
        //        var x = moment(TripsHandler.getLongDate(data[a].date)).unix() * 1000;
        //        newObj.values.push([x, data[a].tcash])
        //    }
        //    transformed.push(newObj);
        //
        //    var newObj = {};
        //    newObj.key = arr[1];
        //    newObj.values = [];
        //    for (var a = 0; a < data.length; a++) {
        //        var x = moment(TripsHandler.getLongDate(data[a].date)).unix() * 1000;
        //        newObj.values.push([x, data[a].trip])
        //    }
        //    transformed.push(newObj);
        //    return transformed;
        //}


        //trip start
        vm.getTrips = function () {
            TripsService.getTrips({
                    city: $rootScope.city,
                    vehicle: $rootScope.vehicleType,
                    startTime: $scope.tripDates.startDate,
                    endTime: $scope.tripDates.endDate,
                    rate: vm.tripFrequency.value
                }, {
                        vehicle: $rootScope.vehicleType,
                        frequency: vm.tripFrequency.value
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
            data = angular.fromJson(data);
            var newTripData = data[0].trip;

            for (var a = 0; a < newTripData.length; a++) {
                $scope.rT = a + (data[0].trip[a].requests.total);
                $scope.rUT = a + (data[0].trip[a].requests.unique_riders);
                $scope.cT = a + (data[0].trip[a].cancelled.total);
                $scope.cUT = a + (data[0].trip[a].cancelled.unique);
                $scope.fT = a + (data[0].trip[a].success.total);
                $scope.fUT = a + (data[0].trip[a].success.unique_riders);
                $scope.faT = a + (data[0].trip[a].failed.total);
                $scope.faUT = a + (data[0].trip[a].failed.unique_riders);
            }

            //
            var arr = [
                'Requests: ' + $scope.rT ,
                'Requests(U): ' + $scope.rUT ,
                'Cancelled: ' + $scope.cT ,
                'Cancelled(U): ' + $scope.cUT ,
                'Fulfilled: ' + $scope.fT ,
                'Fulfilled(U): ' + $scope.fUT ,
                'Failed: ' + $scope.faT ,
                'Failed(U): ' + $scope.faUT
            ];
            var newObj = {};
            newObj.key = arr[0];
            newObj.values = [];
            newObj.bar = true;
            for (var a = 0; a < newTripData.length; a++) {
                var x = moment(TripsHandler.getLongDate(data[0].trip[a].id)).unix() * 1000;
                newObj.values.push([x, data[0].trip[a].requests.total]);
            }
            transformed.push(newObj);

            var newObj = {};
            newObj.key = arr[1];
            newObj.values = [];
            newObj.bar = true;
            for (var a = 0; a < newTripData.length; a++) {
                var x = moment(TripsHandler.getLongDate(data[0].trip[a].id)).unix() * 1000;
                newObj.values.push([x, data[0].trip[a].requests.unique_riders]);
            }
            transformed.push(newObj);

            var newObj = {};
            newObj.key = arr[2];
            newObj.values = [];
            newObj.bar = true;
            for (var a = 0; a < newTripData.length; a++) {
                var x = moment(TripsHandler.getLongDate(data[0].trip[a].id)).unix() * 1000;
                newObj.values.push([x, data[0].trip[a].cancelled.total]);
            }
            transformed.push(newObj);

            var newObj = {};
            newObj.key = arr[3];
            newObj.values = [];
            newObj.bar = true;
            for (var a = 0; a < newTripData.length; a++) {
                var x = moment(TripsHandler.getLongDate(data[0].trip[a].id)).unix() * 1000;
                newObj.values.push([x, data[0].trip[a].cancelled.unique]);
            }
            transformed.push(newObj);

            var newObj = {};
            newObj.key = arr[4];
            newObj.values = [];
            newObj.bar = true;
            for (var a = 0; a < newTripData.length; a++) {
                var x = moment(TripsHandler.getLongDate(data[0].trip[a].id)).unix() * 1000;
                newObj.values.push([x, data[0].trip[a].success.total]);
            }
            transformed.push(newObj);

            var newObj = {};
            newObj.key = arr[5];
            newObj.values = [];
            newObj.bar = true;
            for (var a = 0; a < newTripData.length; a++) {
                var x = moment(TripsHandler.getLongDate(data[0].trip[a].id)).unix() * 1000;
                newObj.values.push([x, data[0].trip[a].success.unique_riders]);
            }
            transformed.push(newObj);

            var newObj = {};
            newObj.key = arr[6];
            newObj.values = [];
            newObj.bar = true;
            for (var a = 0; a < newTripData.length; a++) {
                var x = moment(TripsHandler.getLongDate(data[0].trip[a].id)).unix() * 1000;
                newObj.values.push([x, data[0].trip[a].failed.total]);
            }
            transformed.push(newObj);
            var newObj = {};
            newObj.key = arr[7];
            newObj.values = [];
            newObj.bar = true;
            for (var a = 0; a < newTripData.length; a++) {
                var x = moment(TripsHandler.getLongDate(data[0].trip[a].id)).unix() * 1000;
                newObj.values.push([x, data[0].trip[a].failed.unique_riders]);
            }
            transformed.push(newObj);

            return transformed;
        }
        //trip end


        //burn start

        //vm.getBurn = function () {
        //    TripsService.getBurn({
        //        startTime: $scope.tripDates.startDate,
        //        endTime: $scope.tripDates.endDate
        //    }, function (response) {
        //        TripsHandler.burn = response;
        //        vm.burn = TripsHandler.getBurn(response);
        //    }, function (err) {
        //        console.log(err);
        //        $scope.error = true;
        //    });
        //};

        vm.getBurn = function () {
            TripsService.getBurn({
                    startTime: $scope.burnDates.startDate,
                    endTime: $scope.burnDates.endDate
                },
                function (response){
                    vm.burnData = transformBurns(response).map(function (series) {
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

        function transformBurns(data) {
            var transformedBurn = [];
            data = angular.fromJson(data);
            //var newTripData = data[0].trip;

            for (var a = 0; a < data.length; a++) {
                $scope.trip = a + (data[a].trip);
                $scope.offer = a + (data[a].offer);
                $scope.bonus = a + (data[a].bonus);
                $scope.tcash = a + (data[a].tcash);
                $scope.total = a + (data[a].total);
            }

            //
            var arrBurn = [
                'Trip: ' + $filter('number')($scope.trip, 2),
                'Offer: ' + $filter('number')($scope.offer, 2),
                'Bonus: ' + $filter('number')($scope.bonus, 2),
                'tCash: ' + $filter('number')($scope.tcash, 2),
                'Total: ' + $filter('number')($scope.total, 2)
            ];
            var newObj = {};
            newObj.key = arrBurn[0];
            newObj.values = [];
            newObj.bar = true;
            for (var a = 0; a < data.length; a++) {
                var x = moment(TripsHandler.getLongDate(data[a].date)).unix() * 1000;
                newObj.values.push([x, data[a].trip]);
            }
            transformedBurn.push(newObj);

            var newObj = {};
            newObj.key = arrBurn[1];
            newObj.values = [];
            newObj.bar = true;
            for (var a = 0; a < data.length; a++) {
                var x = moment(TripsHandler.getLongDate(data[a].date)).unix() * 1000;
                newObj.values.push([x, data[a].offer]);
            }
            transformedBurn.push(newObj);

            var newObj = {};
            newObj.key = arrBurn[2];
            newObj.values = [];
            newObj.bar = true;
            for (var a = 0; a < data.length; a++) {
                var x = moment(TripsHandler.getLongDate(data[a].date)).unix() * 1000;
                newObj.values.push([x, data[a].bonus]);
            }
            transformedBurn.push(newObj);

            var newObj = {};
            newObj.key = arrBurn[3];
            newObj.values = [];
            newObj.bar = true;
            for (var a = 0; a < data.length; a++) {
                var x = moment(TripsHandler.getLongDate(data[a].date)).unix() * 1000;
                newObj.values.push([x, $scope.tcash]);
            }
            transformedBurn.push(newObj);

            var newObj = {};
            newObj.key = arrBurn[4];
            newObj.values = [];
            newObj.bar = true;
            for (var a = 0; a < data.length; a++) {
                var x = moment(TripsHandler.getLongDate(data[a].date)).unix() * 1000;
                newObj.values.push([x, $scope.total]);
            }
            transformedBurn.push(newObj);

            return transformedBurn;
        }

        //burn end


        //vm.getTrips = function () {
        //    TripsService.getTrips({
        //        city: $rootScope.city,
        //        startTime: $scope.tripDates.startDate,
        //        endTime: $scope.tripDates.endDate,
        //        count: 1,
        //        page: 1,
        //        rate: vm.tripFrequency.value
        //    }, {
        //            vehicle: $rootScope.vehicleType,
        //            frequency: vm.tripFrequency.value
        //        },
        //        function (response) {
        //        TripsHandler.trips = response[0].trip;
        //        vm.trips = TripsHandler.getTrips(response[0].trip);
        //        vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'Cancelled trips (by rider)'}));
        //        vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'Cancelled trips (by driver)'}));
        //        vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'tCash'}));
        //    }, function (err) {
        //        console.log(err);
        //        $scope.error = true;
        //    });
        //};


        vm.onDateChange();
    }
})();

