(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('TripsController', TripsController);

    /** @ngInject */
    function TripsController($scope, StaticDataService, ChartConfigService, NgTableParams, TripsService, LiveService, $rootScope, TripsHandler, LiveHandler) {

        var vm = this;
        var today = moment();
        vm.showTableData = false;
        var startDate, endDate;
        vm.ranges = StaticDataService.ranges;
        $scope.date = moment().format("dddd, MMMM Do YYYY");
        $scope.tripDates = {};
        $scope.dateURL = moment().format("DD/MM/YYYY");
        $scope.tripDates.startDate = StaticDataService.ranges['Last 7 Days'][0]; //moment().subtract(1, 'days').format("YYYY-MM-DD");
        $scope.tripDates.endDate = StaticDataService.ranges['Last 7 Days'][1]; //moment().subtract(1, 'days').format("YYYY-MM-DD");


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
                    formateDate = 'Above 7 days';
                else
                    formateDate = moment(TripsHandler.getLongDate(data.date.toString())).format('MMMM Do YYYY');
                var str = '<div class="pd-10 text-left"><span><b>';
                str += formateDate + ' </b></span>' + '';
                //str += '<h6>New Rider Registered</h6>' + data.newRiderRegCount + ''
                str += '<h3 class="no-mr">' + data.y + '<small style="color:#333;"> /' + data.uniqRides + '</small><br><small style="font-size:10px;color:#666;text-transform: uppercase;">Total Rides / Rides(U)</small></h3>'
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



        vm.tripChartOptions = angular.copy(ChartConfigService.lineChartOptions);
        vm.burnChartOptions = angular.copy(ChartConfigService.lineChartOptions);
        vm.tcashChartOptions = angular.copy(ChartConfigService.linePlusBarChartOptions);
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
        vm.trips = [];
        vm.filterTerm = '';
        vm.filterFields = [
            {value: "dname", name: "Driver Name"},
            {value: "rname", name: "Rider Name"},
            {value: "id", name: "Trip ID"},
            {value: "did", name: "Driver ID"},
            {value: "remail", name:"Rider Email"},
            {value: "dphone", name: "Driver Phone"},
            {value: "rphone", name: "Rider Phone"},
            {value: "dvehicle", name: "Vehicle Number"},
            {value: "date", name:"Date"}
        ];
        vm.statusCodes = '';
        vm.tripStatusFilters = [{name: 'All', value: "20,22,30,40,50,60,61,70,71,80,81,82"},
            {name: 'Success', value: "61"},
            {name: 'Cancelled ', value: '70,71'},
            {name: 'Failed', value: '80,81,82'},
            {name: 'In Progress', value: '20,22,30,40,50,60'}
        ];
        //vm.searchTable = function () {
        //    vm.showTableData = true;
        //    vm.getResult();
        //};
        this.changeFrequency = function (section, freqModel) {
            console.log("Frequency changed ", freqModel.value);

            vm.tripChartOptions.chart.xAxis.axisLabel = freqModel;
            if (freqModel == 'hour') {
                vm.tripChartOptions.chart.xAxis.tickFormat = function (d) {
                    return d3.time.format('%d %b %I %p')(new Date(d).addHours(1));
                };
            }
            else {
                vm.tripChartOptions.chart.xAxis.tickFormat = function (d) {
                    return d3.time.format('%d %b %y')(new Date(d));
                };
            }
            vm.getTrips()

        };
        vm.onDateChangeTrips = function () {
            vm.getTrips();
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
        vm.onDateChangeTcash = function () {
            vm.getTCash();
        };
        vm.onDateChange = function () {
            vm.getTCash();
            vm.getTrips();
            vm.getBurn();
            vm.onDateChangeTripsCancelled();
            getNewRiders();
        };


        var current = moment();
        vm.live = true;
        //vm.changeDate = function (to) {
        //    if (to == 'next') {
        //        current = moment(current).add(1, 'day');
        //        $scope.date = moment(current).format("dddd, MMMM Do YYYY");
        //    }
        //    else {
        //        current = moment(current).subtract(1, 'day');
        //        $scope.date = moment(current).format("dddd, MMMM Do YYYY");
        //
        //        console.log('$scope.date ', $scope.date)
        //    }
        //    if (moment(current).unix() == moment(today).unix()) {
        //        vm.live = true;
        //    }
        //    else {
        //        vm.live = false;
        //    }
        //    getNewRiders();
        //};


        function getNewRiders() {
            var newRideStartDate = moment($scope.rideDates.startDate).unix();
            var newRideEtartDate = moment($scope.rideDates.endDate).unix();

            LiveService.getNewRiders({
                from: newRideStartDate,
                to: newRideEtartDate
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
            var labelsArr = ['today', '1 day ago', '2 day ago', '3 day ago', '4 day ago', '5 day ago', '6 day ago', 'Above 7 days'];
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
                    var total = rides.value[a] ? rides.value[a].totalRides:0;
                    var uniqRides = rides.value[a] ? rides.value[a].uniqRides:0;
                    var id = rides.value[a] ? rides.value[a].id:0;
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

        vm.getTCash = function () {
            TripsService.getTCash({
                city: $rootScope.city,
                startTime: $scope.tripDates.startDate,
                endTime: $scope.tripDates.endDate,
                vehicle: $rootScope.vehicleType
            }, {}, function (response) {
                //  TripsHandler.trips = response[0].trip
                vm.tcashData = transformTCash(response).map(function (series) {
                    series.values = series.values.map(function (d) {
                        return {x: d[0], y: d[1]}
                    });
                    return series;
                });
                console.log('response ', vm.tcashData)
            }, function (err) {
                console.log(err);
                $scope.error = true;
            });
        };

        function transformTCash(data) {
            var transformed = [];
            data = angular.fromJson(data);
            var arr = ['tCash', 'Trip'];

            var newObj = {};
            newObj.key = arr[0];
            newObj.values = [];
            newObj.bar = true;
            for (var a = 0; a < data.length; a++) {
                var x = moment(TripsHandler.getLongDate(data[a].date)).unix() * 1000;
                newObj.values.push([x, data[a].tcash])
            }
            transformed.push(newObj);

            var newObj = {};
            newObj.key = arr[1];
            newObj.values = [];
            for (var a = 0; a < data.length; a++) {
                var x = moment(TripsHandler.getLongDate(data[a].date)).unix() * 1000;
                newObj.values.push([x, data[a].trip])
            }
            transformed.push(newObj);

            return transformed;
        }

        vm.getBurn = function () {
            TripsService.getBurn({
                startTime: $scope.tripDates.startDate,
                endTime: $scope.tripDates.endDate
            }, function (response) {
                TripsHandler.burn = response;
                vm.burn = TripsHandler.getBurn(response);
            }, function (err) {
                console.log(err);
                $scope.error = true;
            });
        };

        vm.getTrips = function () {
            TripsService.getTrips({
                city: $rootScope.city,
                startTime: $scope.tripDates.startDate,
                endTime: $scope.tripDates.endDate,
                count: 1,
                page: 1,
                rate: vm.tripFrequency.value
            }, {vehicle: $rootScope.vehicleType, frequency: vm.tripFrequency.value}, function (response) {
                TripsHandler.trips = response[0].trip;
                vm.trips = TripsHandler.getTrips(response[0].trip);
                vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'Cancelled trips (by rider)'}));
                vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'Cancelled trips (by driver)'}));
                vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'tCash'}));
            }, function (err) {
                console.log(err);
                $scope.error = true;
            });
        };
        //var sorting;
        //$scope.getTimeDiff = function (dt1, dt2) {
        //    if (dt1 == 0 || dt2 == 0) {
        //        return '0'
        //    }
        //    if (dt2) {
        //        var diff = (dt2 - dt1);
        //        return diff
        //    }
        //    else {
        //        return '0'
        //    }
        //};
        //vm.getResult = function (){
        //    $scope.tableParams = new NgTableParams({page: 1, count: 20}, {
        //        counts: [],
        //        getData: function (params) {
        //            // ajax request to api
        //            var start = ((params.page() - 1) * 20) + 1;
        //            console.log("**************************");
        //            var dataObj = {};
        //            dataObj.start = start;
        //            dataObj.count = params.count();
        //
        //            if (params.orderBy().length > 0) {
        //                var orderby = params.orderBy()[0].substr(0, 1);
        //                dataObj.field = params.orderBy()[0].substr(1);
        //                if (orderby === "+") {
        //                    dataObj.orderby = "ASC"
        //                }
        //                else {
        //                    dataObj.orderby = "DESC"
        //                }
        //            }
        //
        //            if (vm.searchTerm && vm.searchTerm != '') {
        //                dataObj.term = vm.filterTerm.value + "|" + vm.searchTerm
        //            }
        //            if (vm.statusCodes.value != '') {
        //                dataObj.filterByStatus = vm.statusCodes.value
        //            }
        //            return TripsService.getAllTrips(dataObj).$promise.then(function (data) {
        //
        //                params.total(data.total); // recal. page nav controls
        //
        //                if (data.data.length > 0) {
        //                    vm.tblNoData = false
        //                }
        //                else {
        //                    vm.tblNoData = true
        //                }
        //                return data.data;
        //            });
        //        }
        //    });
        //
        //}
        vm.onDateChange();
    }
})();

