(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('OffersController', OffersController);

    /** @ngInject */
    function OffersController($scope,OfferService, NgTableParams) {
        var vm = this

        vm.offers = []
        vm.selectedOffers = []

        vm.drivers = []
        vm.selectedDrivers = []
        vm.offerCheckboxes = {
            checked: false,
            items: {}
        };
        vm.addOffer = function(offer)
        {
            vm.selectedOffers.push(offer)
        }
        vm.addDrivers = function()
        {

        }
        $scope.offerTableParams = new NgTableParams({page: 1, count: 20}, {
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

                if (vm.searchTerm && vm.searchTerm != '') {
                    dataObj.term = vm.filterTerm.value + "|" + vm.searchTerm
                }

                return OfferService.getOffers(dataObj).$promise.then(function (data) {

                    params.total(data.total); // recal. page nav controls

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

                if (vm.searchTerm && vm.searchTerm != '') {
                    dataObj.term = vm.filterTerm.value + "|" + vm.searchTerm
                }

                return OfferService.getDrivers(dataObj).$promise.then(function (data) {

                    params.total(data.total); // recal. page nav controls

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
})();
