(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('PayoutController', PayoutController);

    /** @ngInject */
    function PayoutController($scope, $stateParams, $log, $rootScope, $interval, StaticDataService, PayoutService, NgTableParams, $resource, toastr, ngDialog, $confirm, $localStorage, $sessionStorage) {

        var vm = this;
        vm.prev = true;
        vm.next = false;
        $scope.editable = true;
        $scope.dayWiseList = false;
        $scope.addFineModel = false;
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
        vm.fineAmount = '';
        vm.fineReason = '';

        vm.selectedRow = null;
        vm.setSelected = function (selectedRow) {
            vm.selectedRow = selectedRow;
            console.log(selectedRow);
        };

        //vm.startWeek = moment(newDate).startOf('week').isoWeekday(5).subtract(7, 'day');
        //vm.formattedStartWeekDs = vm.startWeek.format("ddd, MMM Do YYYY");
        //vm.formattedStartWeek = vm.startWeek.format("YYYYMMDD");
        //
        //vm.endWeek = moment(newDate).endOf('week').isoWeekday(4).subtract(7, 'day');
        //vm.formattedEndWeekDs = vm.endWeek.format("ddd, MMM Do YYYY");
        //vm.formattedEndWeek = vm.endWeek.format("YYYYMMDD");

        var i = 0;

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
        function getInvoiceListData() {
            $scope.payoutTableParams = new NgTableParams({
                    page: 1, count: 20, sorting: {name: 'ASC'}
                },
                {
                    counts: [],
                    getData: function (params) {
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
                        var dataObj = {
                            endDate: vm.formattedEndWeek,
                            startDate: vm.formattedStartWeek,
                            type: orderBy,
                            order: field
                            //, start: start
                            //, count: params.count()
                        };
                        return PayoutService.getInvoiceList(dataObj).$promise.then(function (data) {
                            params.total(data.total); // recal. page nav controls
                            $scope.data = data;
                            if (data.length > 0) {
                                $scope.tblNoData = false
                            }
                            else {
                                $scope.tblNoData = true
                            }
                            return data;
                        });
                    }
                });
        }

        //function getInvoiceListData() {
        //    PayoutService.getInvoiceList({
        //        endDate: vm.formattedEndWeek,
        //        startDate: vm.formattedStartWeek
        //    }, function (response) {
        //        $scope.data = response;
        //    }, function (err) {
        //        console.log(err);
        //        $scope.error = true;
        //    });
        //}

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
                    //vm.invoiceListPublish(index);
                    vm.invoiceListPublishAll();
                });
        };

        //vm.invoiceListPublish = function (index) {
        //    PayoutService.invoiceListPublish(
        //        {
        //            startDate: vm.formattedStartWeek,
        //            endDate: vm.formattedEndWeek,
        //            drivers: $scope.addDriver
        //        },
        //        function (response) {
        //            $scope.addDriver = [];
        //            $scope.publishAllBtn = false;
        //            vm.msg = 'Success';
        //            toastr.success(vm.msg);
        //            getInvoiceListData();
        //        }, function (err) {
        //            vm.msg = 'Already Published.';
        //            toastr.error(err.message);
        //        });
        //};

        vm.invoiceListPublishAll = function (index) {
            PayoutService.invoiceListPublishAll(
                {
                    startDate: vm.formattedStartWeek, endDate: vm.formattedEndWeek
                },
                function (response) {
                    vm.msg = 'All drivers published successfully.';
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

        //vm.checkValueCB = function (index) {
        //    if ($scope.data[index].closingBalance < $scope.data[index].newClosingBalance) {
        //        $scope.data[index].newClosingBalance = 0;
        //    }
        //};

        vm.invoiceListPaid = function (index) {
            PayoutService.invoiceListPaid(
                {
                    drivers: $scope.data[index].driver
                }, {
                    startDate: vm.formattedStartWeek,
                    endDate: vm.formattedEndWeek,
                    paidAmount: $scope.data[index].newClosingBalance || $scope.data[index].closingBalance
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
                    startDate: vm.formattedStartWeek,
                    endDate: vm.formattedEndWeek,
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

        vm.addFine = function (index) {
            PayoutService.addFine(
                {
                    drivers: vm.newDriverID
                }, {
                    startDate: vm.formattedStartWeek,
                    endDate: vm.formattedEndWeek,
                    fine: vm.fineAmount,
                    fineReason: vm.fineReason
                },
                function (response) {
                    vm.msg = 'Amount Paid';
                    $scope.addFineModel = true;
                    toastr.success(vm.msg);
                    getInvoiceListData();
                }, function (err) {
                    vm.msg = 'Already Published.';
                    toastr.error(err.message);
                });
        };


        vm.hideDayWiseList = function (index) {
            $scope.dayWiseList = false;
        };

        vm.hideFineModel = function (index) {
            $scope.addFineModel = false;
        };
        vm.showFineModel = function (index, newDriverID, fineAmount, fineReason) {
            $scope.addFineModel = true;
            vm.newDriverID = newDriverID;
            vm.fineReason = fineReason;
            vm.fineAmount = fineAmount;
        }
    }

})();
