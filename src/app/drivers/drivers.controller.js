(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('DriversController', DriversController);

    /** @ngInject */
    function DriversController($scope, $rootScope, StaticDataService, toastr, ChartConfigService, DriverHandler, DriversService, NgTableParams, LiveService) {

        var vm = this;
        $scope.date = moment().format("ddd, MMM Do YYYY");
        $scope.dateURL = moment().format("DD/MM/YYYY");
        var today = moment();

        vm.ranges = StaticDataService.ranges;
        vm.config = ChartConfigService.lineChartConfig;

        $scope.datesForLeaderboard = {};
        $scope.datesForLeaderboard.startDate =  moment(today).subtract(1, 'days');
        $scope.datesForLeaderboard.endDate =  moment(today).subtract(1, 'days');

        $scope.datesForAcq = {};
        $scope.datesForAcq.startDate = StaticDataService.ranges['Last 7 Days'][0];
        $scope.datesForAcq.endDate = StaticDataService.ranges['Last 7 Days'][1];
        vm.acquisitionData = [];
        vm.acquisitionChart = angular.copy(ChartConfigService.discreteBarChartOptions);
        vm.acquisitionChart.chart.xAxis.tickFormat = function (d) {
            return d3.time.format('%d %b %y')(new Date(d));
        };

        $scope.driverSupplyDates = {};
        $scope.driverSupplyDates.startDate = StaticDataService.ranges['Last 7 Days'][0]; //moment().subtract(1, 'days').format("YYYY-MM-DD");
        $scope.driverSupplyDates.endDate = StaticDataService.ranges['Last 7 Days'][1]; //moment().subtract(1, 'days').format("YYYY-MM-DD");
        vm.supplyChartOptions = angular.copy(ChartConfigService.lineChartOptions);
        vm.supplyChartOptions.chart.xAxis.tickFormat = function (d) {
            return d3.time.format('%d %b %y')(new Date(d));
        };

        //vm.supplyChartOptions.chart.yAxis.tickFormat = function (d) {
        //    return d3.format('.3n')(d);
        //};

        vm.getLive = function() {
            LiveService.getOverview({
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType
            }, function (response) {
                vm.overview = response;
            }, function (err) {
                console.log(err);
                $scope.error = true;
            });
        };

        vm.getLeaderboard = function () {
            vm.leaderboradData = '';
            DriversService.getLeaderboard(
                {
                    from: moment($scope.datesForLeaderboard.startDate).startOf('day').format("YYYYMMDD").toString()
                },
                function (response) {
                    vm.leaderboradData = response;
                    vm.dataCount = _.size(vm.leaderboradData);
                }, function (err) {
                    toastr.error(err.message);
                });
        };
        vm.getLeaderboard();

        vm.getAcquisition = function () {
            console.log($scope.datesForAcq);
            DriversService.getAcquisition({
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType,
                from: moment($scope.datesForAcq.startDate).startOf('day').format("YYYYMMDD").toString(),
                to: moment($scope.datesForAcq.endDate).endOf('day').format("YYYYMMDD").toString()
            }, function (response) {
                vm.acquisitionData = [];
                var values = [];
                _.each(response, function (value) {
                    values.push({label: DriverHandler.getLongDate(value.id), value: value.count})
                });
                vm.acquisitionData.push({key: 'Drivers', values: values});
                console.log('vm.acquisitionData ', vm.acquisitionData)
            }, function (err) {
                console.log(err);
                $scope.error = true;
            });
        };

        vm.onDateChangeSupply = function () {
            vm.getSupply();
        };
        vm.getLeaderboardLength = function (a) {
            console.log(_.size(a));
        };

        vm.getSupply = function () {
            DriversService.getSupply({
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType,
                from: moment($scope.driverSupplyDates.startDate).startOf('day').format("YYYYMMDD").toString(),
                to: moment($scope.driverSupplyDates.endDate).endOf('day').format("YYYYMMDD").toString()
            }, function (response) {
                DriverHandler.supply = response;
                vm.supply = DriverHandler.getSupply(response);
                vm.hourMax = DriverHandler.maxValueDNew;
                vm.supplyChartOptions.chart.yDomain = [0, vm.hourMax];
            }, function (err) {
                console.log(err);
                $scope.error = true;
            });
        };


        vm.getLive();
        vm.getAcquisition();
        vm.getSupply();
    }
})();
