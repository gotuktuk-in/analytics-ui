(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('DriversDetailController', DriversDetailController);

    /** @ngInject */
    function DriversDetailController($scope, $rootScope, $window, $stateParams, $confirm, toastr, $interval, StaticDataService, DriversService, DriverHandler, ChartConfigService, NgTableParams, ngTableEventsChannel, LiveService, $resource) {

        var vm = this;
        var current = moment();
        var today = moment();

        vm.prev = true;
        vm.next = false;
        vm.date = moment().format("ddd, MMM Do YYYY");
        var year = current.year();
        var month = current.month();
        var date = current.date();
        var hour = current.hour();
        var minute = current.minute();
        var newDate = new Date(year, month, date, hour);
        vm.formattedStartWeek;
        vm.formattedEndWeek;
        $scope.dayWiseList = false;

        vm.ranges = StaticDataService.ranges;
        vm.config = ChartConfigService.lineChartConfig;

        $scope.selectedDates = {};
        $scope.selectedDates.startDate = moment().format("YYYY-MM-DD");
        $scope.selectedDates.endDate = moment().format("YYYY-MM-DD");

        $scope.driverTripDates = {};
        $scope.driverTripDates.startDate = StaticDataService.ranges['Last 7 Days'][0]; //moment().subtract(1, 'days').format("YYYY-MM-DD");
        $scope.driverTripDates.endDate = StaticDataService.ranges['Last 7 Days'][1]; //moment().subtract(1, 'days').format("YYYY-MM-DD");
        vm.tripChartOptions = angular.copy(ChartConfigService.lineChartOptions);
        vm.tripChartOptions.chart.xAxis.tickFormat = function (d) {
            return d3.time.format('%d %b %y')(new Date(d));
        };

        vm.tripChartOptions.chart.yAxis.tickFormat = function (d) {
            return d3.format('.3n')(d);
        };

        vm.getTripsChart = function () {
            DriversService.getTripsChart({
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType,
                drivers: $stateParams.driverId,
                from: moment($scope.driverTripDates.startDate).startOf('day').format("YYYYMMDD").toString(),
                to: moment($scope.driverTripDates.endDate).endOf('day').format("YYYYMMDD").toString()
            }, function (response) {
                DriverHandler.trips = response;
                vm.trips = DriverHandler.getTripsFtr(response);
            }, function (err) {
                console.log(err);
                $scope.error = true;
            });
        };

        $scope.driverOnlineDates = {};
        $scope.driverOnlineDates.startDate = StaticDataService.ranges['Last 7 Days'][0]; //moment().subtract(1, 'days').format("YYYY-MM-DD");
        $scope.driverOnlineDates.endDate = StaticDataService.ranges['Last 7 Days'][1]; //moment().subtract(1, 'days').format("YYYY-MM-DD");
        vm.onlineChartOptions = angular.copy(ChartConfigService.lineChartOptions);
        vm.onlineChartOptions.chart.xAxis.tickFormat = function (d) {
            return d3.time.format('%d %b %y')(new Date(d));
        };

        vm.onlineChartOptions.chart.yAxis.tickFormat = function (d) {
            return d3.format('.3n')(d);
        };

        vm.getOnlineChart = function () {
            DriversService.getOnlineChart({
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType,
                drivers: $stateParams.driverId,
                from: moment($scope.driverOnlineDates.startDate).startOf('day').format("YYYYMMDD").toString(),
                to: moment($scope.driverOnlineDates.endDate).endOf('day').format("YYYYMMDD").toString()
            }, function (response) {
                DriverHandler.online = response;
                vm.online = DriverHandler.getOnlineFtr(response);
            }, function (err) {
                console.log(err);
                $scope.error = true;
            });
        };

        vm.getProfile = function () {
            DriversService.getProfile({
                id: $stateParams.driverId
                //from: moment( $scope.selectedDates.startDate).startOf('day').format("YYYYMMDD").toString(),
                //to: moment( $scope.selectedDates.endDate).endOf('day').format("YYYYMMDD").toString()
            }, function (response) {
                vm.profile = response;
            }, function (err) {
                console.log(err);
                $scope.error = true;
            });
        };

        vm.getProfile();
        vm.getAllData = function () {
            vm.getProfile();
            //  $scope.tableParams.page(1);
            $scope.tableParams.reload()
        };
        $scope.confirmSuspend = function () {
            $confirm({
                text: 'Are you sure want suspend?',
                title: 'Are you sure?',
                ok: 'Yes',
                cancel: 'No'
            })
                .then(function () {
                    vm.driverSuspend();
                });
        };
        $scope.confirmDelete = function () {
            $confirm({
                text: 'Are you sure want delete?',
                title: 'Are you sure?',
                ok: 'Yes',
                cancel: 'No'
            })
                .then(function () {
                    vm.driverDelete();
                });
        };
        vm.driverSuspend = function () {
            DriversService.accountDriver(
                {
                    id: $stateParams.driverId
                }, {
                    accountStatus: 2
                },
                function (response) {
                    vm.msg = 'Driver Suspend';
                    $scope.amountPaid = true;
                    toastr.success(vm.msg);
                    $window.close();
                }, function (err) {
                    vm.msg = 'Already Suspended.';
                    toastr.error(err.message);
                });
        };
        vm.driverDelete = function (dID) {
            DriversService.accountDriver(
                {
                    id: $stateParams.driverId
                }, {
                    accountStatus: 3
                },
                function (response) {
                    vm.msg = 'Driver Deleted';
                    $scope.amountPaid = true;
                    toastr.success(vm.msg);
                    $window.close();
                }, function (err) {
                    vm.msg = 'Already Deleted.';
                    toastr.error(err.message);
                });
        };
        //invoice start------------------------------------
        var i = 0;

        vm.getDataList = function () {
            DriversService.getWeeks(
                function (response) {
                    getWeeks(response);
                }, function (err) {
                    console.log(err);
                    $scope.error = true;
                });
        };
        vm.getDataList();

        function getWeeks(response) {
            var weekList = [];
            vm.totalWeek = response.length;
            var weekList = response;
            var sWN = weekList[i].startOn;
            var eWN = weekList[i].endOn;
            vm.formattedStartWeek = moment(sWN * 1000).format("YYYYMMDD");
            vm.formattedEndWeek = moment(eWN * 1000).format("YYYYMMDD");
            vm.formattedStartWeekDs = moment(sWN * 1000).format("ddd, MMM Do YYYY");
            vm.formattedEndWeekDs = moment(eWN * 1000).format("ddd, MMM Do YYYY");
            getInvoiceListData();
        }

        vm.changeDate = function (to) {
            if (to == 'next') {
                i--;
                vm.getDataList();
                if (i == 0) {
                    vm.next = false;
                    $scope.editable = true;
                }
                vm.prev = true;
            }
            else {
                i++;
                vm.getDataList();
                if (i >= vm.totalWeek - 1) {
                    vm.prev = false;
                }
                vm.next = true;
                $scope.editable = false;
            }
        };

        // call to get data for the tables
        vm.viewDaywiseListData = function (dID) {
            DriversService.viewDaywiseList(
                {
                    startDate: vm.formattedStartWeek,
                    endDate: vm.formattedEndWeek,
                    drivers: dID
                },
                function (response) {
                    $scope.dataDay = response;
                    $scope.dataSettledTrip = $scope.dataDay.settledTrip;
                    $scope.dayWiseList = true;
                    vm.emi = $scope.dataDay.emi;
                    vm.settled = $scope.dataDay.settled;
                    vm.totalTripCount = $scope.dataDay.balance.totalTripCount;
                    vm.totalEarning = $scope.dataDay.balance.totalEarning;
                    vm.cashCollection = $scope.dataDay.balance.cashCollection;
                    vm.totalShare = $scope.dataDay.balance.totalShare;
                    vm.totalBalance = $scope.dataDay.balance.totalBalance;
                    toastr.success(vm.msg);
                }, function (err) {
                    toastr.error(err.message);
                });
        };

        vm.hideDayWiseList = function () {
            $scope.dayWiseList = false;
        };

        function getInvoiceListData() {
            $scope.payoutTableParams = new NgTableParams(
                {
                    page: 1,
                    count: 20,
                    sorting: {name: 'ASC'}
                },
                {
                    counts: [],
                    total: 1,
                    getData: function (params) {
                        console.log($stateParams.driverId);
                        // ajax request to api
                        var start = params.page();
                        var orderBy = '';
                        var field = '';
                        if (params.orderBy().length > 0) {
                            orderBy = params.orderBy()[0].substr(0, 1);
                            field = params.orderBy()[0].substr(1);
                            if (orderBy === "+") {
                                orderBy = "DESC"
                            }
                            else {
                                orderBy = "ASC"
                            }
                        }
                        return DriversService.getInvoiceList(
                            {
                                // city: $rootScope.city,
                                // vehicle: $rootScope.vehicleType,
                                startDate: vm.formattedStartWeek,
                                endDate: vm.formattedEndWeek
                                //orderby: orderBy,
                                //field: field,
                                //start: start,
                                //count: params.count()

                            },
                            {
                                id: $stateParams.driverId
                            }
                        ).$promise.then(function (data) {
                                params.total(data.total);
                                $scope.dataInvoice = data;
                                if (data.length > 0) {
                                    $scope.tblNoData = false
                                }
                                else {
                                    $scope.tblNoData = true
                                }
                                //console.log($scope.dataInvoice.driver);
                                return data;
                            });
                    }
                });
        }
        //invoice end------------------------------------

        $scope.$on('$destroy', function () {
            $interval.cancel(interval);
        });
        $scope.getTimeDiff = function (dt1, dt2) {
            var then;
            if (dt1 == 0) {
                return '0'
            }

            if (dt2 == 0) {
                then = new Date();
            }
            else {
                then = new Date(dt2 * 1000);
            }
            var now = new Date(dt1 * 1000);

            var diff = moment.utc(moment(now, "DD/MM/YYYY HH:mm:ss").diff(moment(then, "DD/MM/YYYY HH:mm:ss")));//.format("HH:mm:ss")
            var timeInStr = "";
            if (diff.hours() > 0) {
                timeInStr = diff.hours() + " hr ";
            }
            timeInStr += diff.minute() + " min ";
            return timeInStr;
        };
        vm.getTripsList = function(){
            $scope.tableParams = new NgTableParams({
                page: 1, count: 20, sorting: {earning: 'desc'}
            }, {
                counts: [],
                getData: function (params) {
                    // ajax request to api
                    var start = ((params.page() - 1) * 20) + 1;
                    console.log("**************************");
                    var orderBy = '';
                    var field = '';
                    if (params.orderBy().length > 0) {
                        orderBy = params.orderBy()[0].substr(0, 1);
                        field = params.orderBy()[0].substr(1);
                        if (orderBy === "+") {
                            orderBy = "ASC"
                        }
                        else {
                            orderBy = "DESC"
                        }
                    }

                    return DriversService.getTrips(
                        {
                            //city: $rootScope.city,
                            //vehicle: $rootScope.vehicleType,
                            startDate: moment($scope.driverTripDates.startDate).startOf('day').unix(),
                            endDate: moment($scope.driverTripDates.endDate).endOf('day').unix(),
                            orderby: orderBy,
                            field: field,
                            start: start,
                            count: params.count()
                        },
                        {
                            id: $stateParams.driverId
                        }
                    ).$promise.then(function (data) {
                            params.total(data.total);
                            console.log('trop ', data);
                            if (data.data.length > 0) {
                                $scope.tblNoData = false
                            }
                            else {
                                $scope.tblNoData = true
                            }
                            return data.data;
                        });
                }
            });
        };
        vm.onDateChangeTrips = function () {
            vm.getTripsChart();
            vm.getTripsList();
            vm.getOnlineChart();
        };

        vm.onDateChangeTrips();

    }

})();