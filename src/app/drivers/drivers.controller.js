(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('DriversController', DriversController);

    /** @ngInject */
    function DriversController($scope, $log, $rootScope, $interval, StaticDataService, ChartConfigService, PerformanceService, PerformanceHandler, DriversService, NgTableParams, ngTableEventsChannel, LiveService, $resource) {

        var vm = this
        var today = moment()
        var currentDate = moment()
        var current = moment()
        vm.live = true
        vm.acquisitionData = []
        vm.ranges = StaticDataService.ranges
        vm.config = ChartConfigService.lineChartConfig;
        vm.acquisitionChart = angular.copy(ChartConfigService.discreteBarChartOptions)
        vm.acquisitionChart.chart.xAxis.tickFormat = function (d) {
            return d3.time.format('%d %b %y')(new Date(d));
        };
        $scope.date = moment().format("ddd, MMM Do YYYY")
        $scope.datesForAcq = {}
        $scope.datesForAcq.startDate = moment().subtract(10, 'days').format("YYYY-MM-DD");
        $scope.datesForAcq.endDate = moment().format("YYYY-MM-DD");
        vm.changeDate = function (to) {

            if (to == 'next') {
                current = moment(current).add(1, 'day')
                $scope.date = moment(current).format("dddd, MMMM Do YYYY")

            }
            else {
                current = moment(current).subtract(1, 'day')
                $scope.date = moment(current).format("dddd, MMMM Do YYYY")

                console.log('$scope.date ', $scope.date)
            }
            if (moment(current).unix() == moment(today).unix()) {
                vm.live = true;
            }
            else {
                vm.live = false;
            }
            $scope.tableParams.reload()
            $scope.tableParams.page(1)
            vm.getAcquisition()
        }

        vm.filterTerm = '';
        vm.filterFields = [{value: "id", name: "Driver ID"},
            //{filed:"requestOn",title:"Date"},
            {value: "dname", name: "Driver Name"},
            {value: "dphone", name: "Driver Phone"},
            {value: "dvehicle", name: "Vehicle Number"},
            {value: "vehicleType", name: "Vehicle Type"},
            {value: "riderFeedbackRating", name: "Feedback Rating "}
        ]
        vm.statusCodes = ''
        vm.driverStatusFilters = [{name: 'All', value: "all"},
            {name: 'Occupied', value: "22"},
            {name: 'Unoccupied ', value: '11'},
            {name: 'Offline', value: '10'},
        ]
        vm.searchTable = function () {
            $scope.tableParams.reload()
        }
        function getLive() {
            LiveService.getOverview({
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType,
            }, function (response) {
                vm.overview = response;
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }

        vm.getAcquisition = function () {
            console.log($scope.datesForAcq)
            DriversService.getAcquisition({
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType,
                from: moment($scope.datesForAcq.startDate).startOf('day').format("YYYYMMDD").toString(),
                to: moment($scope.datesForAcq.endDate).endOf('day').format("YYYYMMDD").toString()
            }, function (response) {
                vm.acquisitionData = []
                var values = []
                _.each(response, function (value) {
                    values.push({label: PerformanceHandler.getLongDate(value.id), value: value.count})
                })
                vm.acquisitionData.push({key: 'Drivers', values: values})
                console.log('vm.acquisitionData ', vm.acquisitionData)
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }

        getLive()
        vm.getAcquisition()
        //var interval = $interval(function () {
        //    getLive()
        //    vm.getAcquisition()
        //    $scope.tableParams.reload()
        //    $scope.tableParams.page(1)
        //}, 30000)

        vm.refreshPage = function () {
            getLive()
            vm.getAcquisition()
            $scope.tableParams.reload()
            $scope.tableParams.page(1)
        }

        $scope.$on('$destroy', function () {
            $interval.cancel(interval);
        });
        // call to get data for the tables
        $scope.tableParams = new NgTableParams({
            page: 1, count: 20, sorting: {earning: 'desc'},
        }, {
            counts: [],
            getData: function (params) {
                // ajax request to api
                var start = params.page()
                console.log("**************************")
                var orderBy = ''
                var field = ''
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
                var dataObj = {
                    city: $rootScope.city,
                    vehicle: $rootScope.vehicleType,
                    from: moment(current).startOf('day').format("YYYYMMDD").toString(),
                    to: moment(current).endOf('day').format("YYYYMMDD").toString(),
                    orderby: orderBy,
                    field: field,
                    start: start,
                    count: params.count()
                }
                if (vm.searchTerm && vm.searchTerm != '') {
                    dataObj.term = vm.filterTerm.value + "|" + vm.searchTerm
                }
                if (vm.statusCodes.value != '') {
                    dataObj.filterByStatus = vm.statusCodes.value
                }
                return DriversService.getTopDrivers(dataObj).$promise.then(function (data) {

                        params.total(data.total); // recal. page nav controls

                        console.log('trop ', data)
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
