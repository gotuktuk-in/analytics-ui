(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('PayoutController', PayoutController);

    /** @ngInject */
    function PayoutController($scope, $stateParams, $log, $rootScope, $interval, StaticDataService, PayoutService, $resource, toastr, ngDialog, $confirm) {

        var vm = this;
        vm.prev = true;
        vm.next = false;
        $scope.dayWiseList = false;
        $scope.amountPaid = false;
        $scope.publishAllBtn = false;

        var today = moment();
        vm.date = moment().format("ddd, MMM Do YYYY");
        var current = moment();
        var year = current.year();
        var month = current.month();
        var date = current.date();
        var hour = current.hour();
        var minute = current.minute();
        var newDate = new Date(year, month, date, hour);
        vm.formattedStartWeek;
        vm.formattedEndWeek;

        //vm.startWeek = moment(newDate).startOf('week').isoWeekday(5).subtract(7, 'day');
        //vm.formattedStartWeekDs = vm.startWeek.format("ddd, MMM Do YYYY");
        //vm.formattedStartWeek = vm.startWeek.format("YYYYMMDD");
        //
        //vm.endWeek = moment(newDate).endOf('week').isoWeekday(4).subtract(7, 'day');
        //vm.formattedEndWeekDs = vm.endWeek.format("ddd, MMM Do YYYY");
        //vm.formattedEndWeek = vm.endWeek.format("YYYYMMDD");


        vm.getDataList = function () {
            PayoutService.getWeeks(
                function (response) {
                    getWeeks(response);
                }, function (err) {
                    console.log(err);
                    $scope.error = true;
                });
        };
        vm.getDataList();

        var i = 0;
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
            console.log(vm.formattedStartWeek + ':' + vm.formattedEndWeek);
            getInvoiceListData();
        }
        vm.changeDate = function (to) {
            if (to == 'next') {
                i--;
                vm.getDataList();
                if (i == 0) {
                    vm.next = false;
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
            }
        };
        function getInvoiceListData() {
            PayoutService.getInvoiceList({
                endDate: vm.formattedEndWeek,
                startDate: vm.formattedStartWeek
            }, function (response) {
                $scope.data = response;
                console.log($scope.data);
            }, function (err) {
                console.log(err);
                $scope.error = true;
            });
        }

        // checkbox start

        $scope.addDriver = [];

        $scope.checkedForPub = function (drID) {
            if ($scope.addDriver.indexOf(drID) === -1) {
                $scope.addDriver.push(drID);
                $scope.publishAllBtn = true;
            }
            else {
                $scope.addDriver.splice($scope.addDriver.indexOf(drID), 1);
            }
            console.log($scope.addDriver);
        };

        $scope.removeAllChecked = function () {
            $scope.addDriver = [];
            console.log($scope.addDriver);
            $scope.publishAllBtn = false;
            vm.setCheck = false;

        };

        //end


        $scope.confirmPublish = function (index) {
            $confirm({
                text: 'Are you sure want publish?',
                title: 'Are you Sure?',
                ok: 'Yes',
                cancel: 'No'
            })
                .then(function () {
                    vm.invoiceListPublish(index);
                });
        };

        vm.invoiceListPublish = function (index) {
            PayoutService.invoiceListPublish(
                {
                    startDate: vm.formattedStartWeek,
                    endDate: vm.formattedEndWeek,
                    drivers: $scope.addDriver
                },
                function (response) {
                    $scope.addDriver = [];
                    $scope.publishAllBtn = false;
                    vm.msg = 'Success';
                    toastr.success(vm.msg);
                    getInvoiceListData();
                }, function (err) {
                    vm.msg = 'Already Published.';
                    toastr.error(err.message);
                });
        };

        $scope.confirmPaid = function (index) {
            $confirm({
                text: 'Are you sure want pay?',
                title: 'Are you Sure?',
                ok: 'Yes',
                cancel: 'No'
            })
                .then(function () {
                    vm.invoiceListPaid(index);
                });
        };

        vm.checkValueCB = function(index){
            if($scope.data[index].closingBalance < $scope.data[index].newClosingBalance){
                $scope.data[index].newClosingBalance = 0;
                console.log($scope.data[index].closingBalance)
            }
        };

        vm.invoiceListPaid = function (index) {
            PayoutService.invoiceListPaid(
                {
                    drivers: $scope.data[index].driver
                }, {
                    startDate: $scope.data[index].startDate,
                    endDate: $scope.data[index].endDate,
                    paidAmount: $scope.data[index].newClosingBalance
                },
                function (response) {
                    vm.msg = 'Amount Paid';
                    $scope.amountPaid = true;
                    toastr.success(vm.msg);
                    getInvoiceListData();
                }, function (err) {
                    vm.msg = 'Already Published.';
                    toastr.error(err.message);
                });
        };


        vm.viewDaywiseListData = function (index) {
            PayoutService.viewDaywiseList(
                {
                    startDate: $scope.data[index].startDate,
                    endDate: $scope.data[index].endDate,
                    drivers: [$scope.data[index].driver]
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
                    //toastr.success(vm.msg);
                }, function (err) {
                    toastr.error(err.message);
                });
        };

        vm.hideDayWiseList = function (index) {
            $scope.dayWiseList = false;
        }

    }

})();
