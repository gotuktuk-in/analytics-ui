(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('OffersController', OffersController);

    /** @ngInject */
    function OffersController($scope, OfferService, NgTableParams, $element, toastr, ngDialog) {
        var vm = this

        vm.offers = []
        vm.drivers = []
        vm.selectedOffers = []
        vm.selectedDrivers = []
        vm.offerCheckboxes = {};
        vm.driverCheckboxes = {};
        vm.noDriversSelected = false;
        vm.noOffersSelected = false;
        vm.filterTerm = '';
        vm.filterFields = [{value: "id", name: "Driver ID"},
            {value: "name", name: "Driver Name"},
            {value: "phone", name: "Driver Phone"},
        ]
        vm.addOffer = function (offer) {
            vm.selectedOffers.push(offer)
        }
        vm.removeOffer = function (index) {
            vm.selectedOffers.splice(index, 1)
        }
        vm.addDriver = function (driver) {
            vm.selectedDrivers.push(driver)
        }
        vm.addDrivers = function () {

            vm.noDriversSelected = false;
            var selectedItems = _.pairs(vm.driverCheckboxes.items)
            if (selectedItems.length == 0) {
                vm.noDriversSelected = true
                return;
            }
            _.each(selectedItems, function (item) {
                if (item[1] == true && !_.find(vm.selectedDrivers, {id: item[0]})) {
                    var toPush = _.find($scope.driverTableParams.data, {id: item[0]})
                    vm.addDriver(toPush)
                }

            })
        }

        vm.addOffers = function () {
            var selectedItems = _.pairs(vm.offerCheckboxes.items)

            _.each(selectedItems, function (item) {
                if (vm.selectedOffers.length == 0 && item[1] == true) {
                    var toPush = _.find($scope.offerTableParams.data, {id: Number(item[0])})
                    vm.addOffer(toPush)
                }
                if (item[1] == true && !_.find(vm.selectedOffers, {id: Number(item[0])})) {
                    var toPush = _.find($scope.offerTableParams.data, {id: Number(item[0])})
                    vm.addOffer(toPush)
                }

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
        vm.clearOfferSearch = function () {
            vm.offerTxt = ""
            $scope.offerTableParams.reload()
        }
        vm.refreshPage = function () {
            $scope.driverTableParams.reload()
            $scope.offerTableParams.reload()

        }
        vm.clearDriverSearch = function () {
            vm.driverTxt = ""
            $scope.driverTableParams.reload()
        }
        vm.assignOffers = function () {
            var obj = {}
            obj.drivers = _.pluck(vm.selectedDrivers, 'id')
            obj.offers = _.pluck(vm.selectedOffers, 'code')
            obj.status = true;
            OfferService.assignOffers({}, obj, function (response) {
                toastr.success("Offers assigned to selected drivers.");

            }, function (error) {
                toastr.error("Error : " + error);
            })
        }
        vm.removeSingleOffer = function (index, row) {
            var obj = {}
            obj.drivers = [row.id]
            obj.offers = [row.offers[index]]
            obj.status = false;
            OfferService.assignOffers({}, obj, function (response) {
                toastr.success("Offers removed.");
                row.offers.splice(index, 1)
            }, function (error) {
                toastr.error("Error : " + error);
            })
        }
        vm.alertDeleteAllOffers = function (row) {
            vm.currentRow = row
            ngDialog.open({
                template: 'alert.html',
                className: 'ngdialog-theme-plain',
                scope: $scope,
            overlay:false
        });
        }
        vm.removeAllAssignedOffers = function () {
            OfferService.getDriverOffers({id: vm.currentRow.id}, function (response) {

                var obj = {}
                obj.drivers = [vm.currentRow.id]
                obj.offers = response.offers
                obj.status = false;
                OfferService.assignOffers({}, obj, function (response) {
                    toastr.success("All offers removed for this driver.");

                }, function (error) {
                    toastr.error("Error : " + error);
                })
            }, function (error) {
                toastr.error("Error : " + error);
            })
           /* var obj = {}
            obj.drivers = [vm.currentRow.id]
            obj.offers = row.offers
            obj.status = false;
            OfferService.assignOffers({}, obj, function (response) {
                toastr.success("Offers assigned to selected drivers.");

            }, function (error) {
                toastr.error("Error : " + error);
            })*/
        }
        vm.getDriverOffers = function (row) {

            OfferService.getDriverOffers({id: row.id}, function (response) {
                row.offers = response.offers;

            }, function (error) {
                toastr.error("Error : " + error);
            })
        }
        vm.clearAll = function () {
            vm.selectedOffers = []
            vm.selectedDrivers = []
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
                    dataObj.term = vm.filterTerm.value + "|" + vm.driverTxt

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
        //************** New Code *****************//
        /* $scope.$watch(
         // This function returns the value being watched. It is called for each turn of the $digest loop
         function() { return vm.driverCheckboxes.checked; },
         // This is the change listener, called when the value returned from the above function changes
         function(newValue, oldValue) {
         console.log('newValue ',newValue)
         console.log('oldValue ',oldValue)
         if ( newValue !== oldValue ) {
         angular.forEach($scope.driverTableParams.data , function(item) {
         item.checked = newValue;
         console.log('newValue ', newValue)
         });
         }
         }
         );*/

        //************************

        // for offers table
        // watch for check all checkbox
        $scope.$watch(function () {
            return vm.offerCheckboxes.checked;
        }, function (value) {

            angular.forEach($scope.offerTableParams.data, function (item) {
                vm.offerCheckboxes.items[item.id] = value;
                console.log('value ', value)
            });
        });

        // watch for data checkboxes
        $scope.$watch(function () {
            return vm.offerCheckboxes.items;
        }, function (values) {
            var checked = 0, unchecked = 0,
                total = $scope.offerTableParams.data.length;
            angular.forEach($scope.offerTableParams.data, function (item) {
                checked += (vm.offerCheckboxes.items[item.id]) || 0;
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
        $scope.$watch(function () {
            return vm.driverCheckboxes.checked;
        }, function (value) {
            var a = 0
            // console.log('total ', $scope.driverTableParams.total())
            angular.forEach($scope.driverTableParams.data, function (item) {
                vm.driverCheckboxes.items[item.id] = value;
                //      console.log('value ', value)
                a++
            });
            //   console.log(a)
        });

        // watch for data checkboxes
        $scope.$watch(function () {
            return vm.driverCheckboxes.items;
        }, function (values) {
            var checked = 0, unchecked = 0,
                total = $scope.driverTableParams.data.length;
            // console.log('total 1 ', $scope.driverTableParams.total())
            angular.forEach($scope.driverTableParams.data, function (item) {
                checked += (vm.driverCheckboxes.items[item.id]) || 0;
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
