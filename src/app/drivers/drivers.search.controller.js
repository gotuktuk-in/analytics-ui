(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('DriversSearchController', DriversSearchController);

    /** @ngInject */
    function DriversSearchController($scope, $window, toastr, $rootScope, $state, $stateParams, StaticDataService, ChartConfigService, DriversService, NgTableParams) {

        var vm = this;
        var today = moment();
        var current = moment();

        vm.termURL = $stateParams.term;
        vm.filterURL = $stateParams.filterURL;
        vm.statusURL = $stateParams.status;
        vm.startDateURL = $stateParams.startDate;
        vm.endDatefilterURL = $stateParams.endDate;
        vm.searchTerm = vm.termURL;
        vm.showTableData = true;
        vm.enblBtn = false;

        vm.selectedRow = null;
        vm.setSelected = function (selectedRow) {
            vm.selectedRow = selectedRow;
        };

        vm.ranges = StaticDataService.ranges;
        vm.config = ChartConfigService.lineChartConfig;
        $scope.date = moment().format("ddd, MMM Do YYYY");


        $scope.datesForSearch = {};
        $scope.datesForSearch.startDate =  moment(today);
        $scope.datesForSearch.endDate =  moment(today);

        vm.filterTerm = '';
        vm.filterFields = [{value: "id", name: "Driver ID"},
            {value: "dname", name: "Driver Name"},
            {value: "phone", name: "Driver Phone"},
            {value: "vehicle", name: "Vehicle Number"},
            //{value: "vehicleType", name: "Vehicle Type"},
            //{value: "riderFeedbackRating", name: "Feedback Rating"},
            {value: "joined", name: "Joined On"}
        ];
        vm.statusCodes = '';
        vm.driverStatusFilters = [{name: 'All', value: "all"},
            {name: 'Occupied', value: "22"},
            {name: 'Unoccupied ', value: '11'},
            {name: 'Offline', value: '10'}
        ];
        vm.checkMinChr = function (index) {
            if (vm.searchTerm.length > 2) {
                vm.enblBtn = true;
            } else {
                vm.enblBtn = false;
            }
        };
        vm.checkMinChr();

        vm.selectedFilterFields = _.find(vm.filterFields, function (rw) {
            return rw.value == vm.filterURL
        });
        vm.filterTerm = vm.selectedFilterFields;

        vm.searchTable = function () {
            $state.go('home.drivers_search', {filterURL: vm.filterTerm.value, term: vm.searchTerm, startDate: vm.startDate, endDate:vm.endDate});
        };

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

        vm.getAllData = function () {
            vm.getResult();
            $scope.tableParams.reload();
        };
        vm.refreshPage = function () {
            vm.getAllData()
        };
        vm.onFocus = function(){
            vm.getAllData();
        };

        //$window.onfocus = vm.onFocus;

        vm.getResult = function () {
            $scope.tableParams = new NgTableParams({
                    page: 1,
                    count: 20
                    //noPager: true
                },
                {
                    counts: [],
                    total: 1,
                    getData: function (params) {
                        // ajax request to api
                        var start = params.page();
                        console.log("**************************");
                        var dataObj = {};
                        dataObj.city = $rootScope.city;
                        dataObj.vehicle = $rootScope.vehicleType;
                        dataObj.from =  moment($scope.datesForSearch.startDate).startOf('day').format("YYYYMMDD").toString();
                        dataObj.to =  moment($scope.datesForSearch.startDate).startOf('day').format("YYYYMMDD").toString();
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
                        if (vm.filterTerm != '' && vm.searchTerm != '') {
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
                        return DriversService.getTopDrivers(dataObj).$promise.then(function (data) {
                            params.total(data.total); // recal. page nav controls
                            if (data.length > 0) {
                                vm.showTableData = true;
                            }
                            else {
                                vm.showTableData = false;
                            }
                            return data;
                        });
                    }
                });
        };
        vm.getResult();
    }
})();
