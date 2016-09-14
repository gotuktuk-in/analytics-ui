(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('PayoutController', PayoutController);

    /** @ngInject */
    function PayoutController($scope, $stateParams, $log, $rootScope, $interval, StaticDataService, PayoutService, $resource, toastr, ngDialog, $confirm) {

        var vm = this;
        $scope.dayWiseList = false;
        $scope.amountPaid = false;
        var today = moment();
        vm.date = moment().format("ddd, MMM Do YYYY");
        var current = moment();
        var year = current.year();
        var month = current.month();
        var date = current.date();
        var hour = current.hour();
        var minute = current.minute();
        var newDate = new Date(year, month, date, hour);

        vm.startWeek = moment(newDate).startOf('week').isoWeekday(5).subtract(7, 'day');
        vm.formattedStartWeekDs = vm.startWeek.format("ddd, MMM Do YYYY");
        vm.formattedStartWeek = vm.startWeek.format("YYYYMMDD");

        vm.endWeek = moment(newDate).endOf('week').isoWeekday(4).subtract(7, 'day');
        vm.formattedEndWeekDs = vm.endWeek.format("ddd, MMM Do YYYY");
        vm.formattedEndWeek = vm.endWeek.format("YYYYMMDD");

        vm.changeDate = function (to) {
            if (to == 'next') {

            }
            else {


            }
        };


        function getInvoiceListData() {
            PayoutService.getInvoiceList({
                endDate: vm.formattedEndWeek,
                startDate: vm.formattedStartWeek
            }, function (response) {
                $scope.data = response;
            }, function (err) {
                console.log(err);
                $scope.error = true;
            });
        }

        getInvoiceListData();

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
                    startDate: $scope.data[index].startDate,
                    endDate: $scope.data[index].endDate,
                    drivers: [$scope.data[index].driver]
                },
                function (response) {
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

        vm.invoiceListPaid = function (index) {
            PayoutService.invoiceListPaid(
                {
                    drivers:$scope.data[index].driver
                },{
                    startDate: $scope.data[index].startDate,
                    endDate: $scope.data[index].endDate,
                    paidAmount: vm.paidAmount
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

        // checkbox start

        vm.drForPublish = [];

        //vm.check = function(value, drID) {
        //    vm.drForPublish.push({drivers: drID});
        //    console.log(vm.drForPublish);
        //};

        //end


        vm.viewDaywiseListData = function (index) {
            PayoutService.viewDaywiseList(
                {
                    startDate: $scope.data[index].startDate,
                    endDate: $scope.data[index].endDate,
                    drivers: [$scope.data[index].driver]
                },
                function (response) {
                    $scope.dataDay = response;
                    $scope.dayWiseList = true;
                    vm.emi = $scope.dataDay.emi;
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
