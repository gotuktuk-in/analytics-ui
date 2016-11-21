(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('TripsSearchController', TripsSearchController);

    /** @ngInject */
    function TripsSearchController($scope, $state, StaticDataService, NgTableParams, $stateParams, TripsHandler, TripsService, $rootScope, $interval) {

        var vm = this;
        var today = moment();
        var current = moment();

        vm.termURL = $stateParams.term;
        vm.filterURL = $stateParams.filterURL;
        //vm.statusURL = $stateParams.status;
        //vm.startDateURL = $stateParams.startDate;
        //vm.endDateURL = $stateParams.endDate;

        vm.searchTerm = vm.termURL;
        vm.showTableData = true;
        vm.enblBtn = false;

        vm.selectedRow = null;
        vm.setSelected = function (selectedRow) {
            vm.selectedRow = selectedRow;
        };

        vm.ranges = StaticDataService.ranges;
        $scope.date = moment().format("dddd, MMMM Do YYYY");


        $scope.datesForSearch = {};
        $scope.datesForSearch.startDate =  StaticDataService.ranges['Last 7 Days'][0];
        $scope.datesForSearch.endDate =  StaticDataService.ranges['Last 7 Days'][1];
        //if (vm.startDateURL !==''){
        //    $scope.datesForSearch.startDate =  moment(TripsHandler.getLongDate(vm.startDateURL)).unix() * 1000;
        //} else{
        //    $scope.datesForSearch.startDate =  StaticDataService.ranges['Last 7 Days'][0];
        //}
        //if (vm.endDateURL !==''){
        //    $scope.datesForSearch.endDate =  moment(TripsHandler.getLongDate(vm.endDateURL)).unix() * 1000;
        //} else{
        //    $scope.datesForSearch.endDate =  StaticDataService.ranges['Last 7 Days'][1];
        //}

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
            {value: "dvehicle", name: "Vehicle Number"}
            //{value: "date", name: "Date"}
        ];
        vm.statusCodes = '';
        vm.tripStatusFilters = [{name: 'All', value: "20,22,30,40,50,60,61,70,71,80,81,82"},
            {name: 'Success', value: "61"},
            {name: 'Cancelled ', value: '70,71'},
            {name: 'Failed', value: '80,81,82'},
            {name: 'In Progress', value: '20,22,30,40,50,60'}
        ];

        //if(vm.statusURL !== ''){
        //    vm.statusCodes = vm.tripStatusFilters[vm.statusURL];
        //}else{
        //    vm.statusCodes = vm.tripStatusFilters[0];
        //}

        vm.checkMinChr = function (index) {
            if (vm.searchTerm.length > 2) {
                vm.enblBtn = true;
            }else{
                vm.enblBtn = false;
            }
        };
        //vm.checkMinChr();



        vm.selectedFilterFields = _.find(vm.filterFields, function(rw){ return rw.value == vm.filterURL });
        vm.filterTerm = vm.selectedFilterFields;

        vm.searchTable = function () {
            $state.go('home.search', {filterURL: vm.filterTerm.value, term:vm.searchTerm });
        };

        //vm.searchTable = function () {
        //    $state.go(
        //        'home.search',
        //        {
        //            city: $rootScope.city,
        //            vehicleType: $rootScope.vehicleType,
        //            filterURL: vm.filterTerm.value,
        //            term: vm.searchTerm,
        //            //startDate: moment($scope.datesForSearch.startDate).unix(),
        //            //endDate: moment($scope.datesForSearch.endDate).unix()
        //            //status: vm.statusCodes.value
        //        }
        //    );
        //};

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
                        dataObj.startDate =  moment($scope.datesForSearch.startDate).startOf('day').unix();
                        dataObj.endDate =  moment($scope.datesForSearch.endDate).endOf('day').unix();

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
                        if (vm.filterTerm && vm.filterTerm != '' && vm.searchTerm != '') {
                            dataObj.term = vm.filterTerm.value + "|" + vm.searchTerm;
                        }
                        if (vm.filterURL != '' && vm.termURL != '') {
                            dataObj.term = vm.filterURL + "|" + vm.termURL;
                        }else{
                            dataObj.term = '';
                            //return;
                        }
                        if (vm.statusCodes.value != '') {
                            dataObj.filterByStatus = vm.statusCodes.value;
                        }
                        return TripsService.getAllTrips(dataObj).$promise.then(function (data) {
                            params.total(data.total); // recal. page nav controls
                            if (data.data.length > 0) {
                                vm.showTableData = true;
                            }
                            else {
                                vm.showTableData = false;
                            }
                            return data.data;
                        });
                    }
                });
        };
        vm.getResult();
    }
})();

