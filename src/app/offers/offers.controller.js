(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('OffersController', OffersController);

    /** @ngInject */
    function OffersController($scope, OfferService, NgTableParams,  $element) {
        var vm = this

        vm.offers = []
        vm.selectedOffers = []

        vm.drivers = []
        vm.selectedDrivers = []
        vm.offerCheckboxes = {};
        vm.driverCheckboxes = {};
        vm.addOffer = function (offer) {
            vm.selectedOffers.push(offer)
        }
        vm.removeOffer = function (index) {
            vm.selectedOffers.splice(index, 1)
        }
        vm.addDriver = function (driver) {
            vm.selectedDrivers.push(driver)
        }
        vm.addDrivers = function()
        {
            _.each(vm.driverCheckboxes.items,function(item){
                console.log(item)
            })
        }
        vm.removeDriver = function (index) {
            vm.selectedDrivers.splice(index, 1)
        }
        vm.searchOffers = function () {
            $scope.offerTableParams.reload()
        }
        vm.searchDrivers = function () {
            $scope.driverTableParams.reload()
        }
        $scope.offerTableParams = new NgTableParams({page: 1, count: 10}, {
            counts: [],
            getData: function (params) {
                // ajax request to api
                var start = ((params.page() - 1) * 10) + 1;
                console.log("**************************")
                var dataObj = {}
                dataObj.start = start;
                dataObj.count = params.count();
                if (params.orderBy().length > 0) {
                    var orderby = params.orderBy()[0].substr(0, 1);
                    dataObj.field = params.orderBy()[0].substr(1);
                    if (orderby === "+") {
                        dataObj.orderby = "ASC"
                    }
                    else {
                        dataObj.orderby = "DESC"
                    }
                }

                if (vm.offerTxt && vm.offerTxt != '') {
                    dataObj.term = "code|" + vm.offerTxt
                }

                return OfferService.getOffers(dataObj).$promise.then(function (data) {

                    params.total(data.total); // recal. page nav controls

                    if (data.data.length > 0) {
                        $scope.tblNoData = false
                    }
                    else {
                        $scope.tblNoData = true
                    }
                    vm.offerCheckboxes = {
                        checked: false,
                        items: {}
                    };
                    return data.data;
                });
            }
        });
        //--------------- Drivers section
        $scope.driverTableParams = new NgTableParams({page: 1, count: 10}, {
            counts: [],
            getData: function (params) {
                // ajax request to api
                var start = ((params.page() - 1) * 10) + 1;
                console.log("**************************")
                var dataObj = {}
                dataObj.start = start;
                dataObj.count = params.count();
                if (params.orderBy().length > 0) {
                    var orderby = params.orderBy()[0].substr(0, 1);
                    dataObj.field = params.orderBy()[0].substr(1);
                    if (orderby === "+") {
                        dataObj.orderby = "ASC"
                    }
                    else {
                        dataObj.orderby = "DESC"
                    }
                }

                if (vm.driverTxt && vm.driverTxt != '') {
                    dataObj.term = "name|" + vm.driverTxt
                }

                return OfferService.getDrivers(dataObj).$promise.then(function (data) {

                    params.total(data.total); // recal. page nav controls

                    if (data.data.length > 0) {
                        $scope.tblNoData = false
                    }
                    else {
                        $scope.tblNoData = true
                    }
                    vm.driverCheckboxes = {
                        checked: false,
                        items: {}
                    };
                    return data.data;
                });
            }
        });

        // for offers table
        // watch for check all checkbox
        $scope.$watch(function() {
            return vm.offerCheckboxes.checked;
        }, function(value) {

            angular.forEach($scope.offerTableParams.data , function(item) {
                vm.offerCheckboxes.items[item.id] = value;
                console.log('value ', value)
            });
        });

        // watch for data checkboxes
        $scope.$watch(function() {
            return vm.offerCheckboxes.items;
        }, function(values) {
            var checked = 0, unchecked = 0,
                total = $scope.offerTableParams.data.length;
            angular.forEach( $scope.offerTableParams.data , function(item) {
                checked   +=  (vm.offerCheckboxes.items[item.id]) || 0;
                unchecked += (!vm.offerCheckboxes.items[item.id]) || 0;
            });
            if ((unchecked == 0) || (checked == 0)) {
                vm.offerCheckboxes.checked = (checked == total);
            }
            // grayed checkbox
            angular.element($element[0].getElementsByClassName("select-all")).prop("indeterminate", (checked != 0 && unchecked != 0));
        }, true);

        //----------------------------------------------
        // for drivers table
        // watch for check all checkbox
        $scope.$watch(function() {
            return vm.driverCheckboxes.checked;
        }, function(value) {
            var a=0
           // console.log('total ', $scope.driverTableParams.total())
            angular.forEach($scope.driverTableParams.data , function(item) {
                vm.driverCheckboxes.items[item.id] = value;
          //      console.log('value ', value)
                a++
            });
         //   console.log(a)
        });

        // watch for data checkboxes
        $scope.$watch(function() {
            return vm.driverCheckboxes.items;
        }, function(values) {
            var checked = 0, unchecked = 0,
                total = $scope.driverTableParams.data.length;
           // console.log('total 1 ', $scope.driverTableParams.total())
            angular.forEach( $scope.driverTableParams.data , function(item) {
                checked   +=  (vm.driverCheckboxes.items[item.id]) || 0;
                unchecked += (!vm.driverCheckboxes.items[item.id]) || 0;
            });
            if ((unchecked == 0) || (checked == 0)) {
                vm.driverCheckboxes.checked = (checked == total);
            }
            // grayed checkbox
            angular.element($element[0].getElementsByClassName("select-all-drivers")).prop("indeterminate", (checked != 0 && unchecked != 0));
        }, true);
    }
})();
