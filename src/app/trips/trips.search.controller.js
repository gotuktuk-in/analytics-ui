(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('TripsSearchController', TripsSearchController);

    /** @ngInject */
    function TripsSearchController($scope, $state, NgTableParams, $stateParams, TripsService, $rootScope, $interval) {

        var vm = this;
        vm.termURL = $stateParams.term;
        vm.filterURL = $stateParams.filterURL;
        vm.searchTerm = vm.termURL;
        vm.showTableData = false;
        vm.enblBtn = false;
        vm.trips = [];
        vm.filterTerm = '';
        vm.filterFields = [
            {value: "dname", name: "Driver Name"},
            {value: "rname", name: "Rider Name"},
            {value: "id", name: "Trip ID"},
            {value: "did", name: "Driver ID"},
            {value: "remail", name: "Rider Email"},
            {value: "dphone", name: "Driver Phone"},
            {value: "rphone", name: "Rider Phone"},
            {value: "dvehicle", name: "Vehicle Number"},
            {value: "date", name: "Date"}
        ];
        vm.statusCodes = '';
        vm.tripStatusFilters = [{name: 'All', value: "20,22,30,40,50,60,61,70,71,80,81,82"},
            {name: 'Success', value: "61"},
            {name: 'Cancelled ', value: '70,71'},
            {name: 'Failed', value: '80,81,82'},
            {name: 'In Progress', value: '20,22,30,40,50,60'}
        ];
        vm.statusCodes = vm.tripStatusFilters[0];

        vm.checkMinChr = function (index) {
            if (vm.searchTerm.length > 2) {
                vm.enblBtn = true;
            }else{
                vm.enblBtn = false;
            }
        };
        vm.checkMinChr();

        vm.selectedFilterFields = _.find(vm.filterFields, function(rw){ return rw.value == vm.filterURL });
        vm.filterTerm = vm.selectedFilterFields;

        vm.searchTable = function () {
            $state.go('home.search', {filterURL: vm.filterTerm.value, term: vm.searchTerm});
        };
        $scope.$back = function () {
            window.history.back();
        };
        var interval = $interval(function () {
            vm.tblNoData = false;
        }, 8000);

        $scope.$on('$destroy', function () {
            $interval.cancel(interval);
        });

        vm.live = true;
        var sorting;
        $scope.getTimeDiff = function (dt1, dt2) {
            if (dt1 == 0 || dt2 == 0) {
                return '0'
            }
            if (dt2) {
                var diff = (dt2 - dt1);
                return diff
            }
            else {
                return '0'
            }
        };
        vm.getResult = function () {
            $scope.tableParams = new NgTableParams(
                {
                    page: 1,
                    count: 20
                }, {
                    counts: [],
                    getData: function (params) {
                        // ajax request to api
                        var start = ((params.page() - 1) * 20) + 1;
                        console.log("**************************");
                        var dataObj = {};
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
                        if (vm.searchTerm != '' && vm.searchTerm != '') {
                            dataObj.term = vm.filterTerm.value + "|" + vm.searchTerm;
                        }
                        if (vm.filterURL != '' && vm.termURL != '') {
                            dataObj.term = vm.filterURL + "|" + vm.termURL;
                        }else{
                            dataObj.term = '';
                            return;
                        }
                        if (vm.statusCodes.value != '') {
                            dataObj.filterByStatus = vm.statusCodes.value;
                        }
                        return TripsService.getAllTrips(dataObj).$promise.then(function (data) {

                            params.total(data.total); // recal. page nav controls

                            if (data.data.length > 0) {
                                vm.tblNoData = false;
                                vm.showTableData = true;
                            }
                            else {
                                vm.showTableData = true;
                                vm.tblNoData = true
                            }
                            return data.data;
                        });
                    }
                });
        };
        vm.getResult();
    }
})();

