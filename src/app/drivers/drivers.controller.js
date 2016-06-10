(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('DriversController', DriversController);

    /** @ngInject */
    function DriversController($scope, $log, $rootScope, $window, DriversService, NgTableParams, LiveService, $resource) {

        var vm = this
        var currentDate = moment()
        vm.live = true
        $scope.date = moment(currentDate).format("dddd, MMMM Do YYYY")
        /*    $scope.dates = {};
         $scope.dates.startDate = moment().format("YYYY-MM-DD");
         $scope.dates.endDate = moment().format("YYYY-MM-DD");*/
        vm.changeDate = function (to) {
            console.log('$scope.date ', moment().unix($scope.date))
            console.log('currentDate ', moment().unix(currentDate))
            if( moment().unix($scope.date != moment().unix(currentDate)))
            {
                vm.live = false;
            }
            if (to == 'next') {
                $scope.date = moment(currentDate).add(1, 'day')//.format("dddd, MMMM Do YYYY")

            }
            else {
                $scope.date = moment(currentDate).subtract(1, 'day')//.format("dddd, MMMM Do YYYY")
            }
            currentDate = $scope.date
            $scope.date = moment(currentDate).format("dddd, MMMM Do YYYY")
            getTopDrivers()
        }
        function getLive() {
            LiveService.getOverview({
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType,
            }, function (response) {
                //  PerformanceHandler.trips = response[0].trip
                vm.overview = response;
                console.log('response ', vm.overview)
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }
        function getTopDrivers() {
            DriversService.getTopDrivers({
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType,
                from: moment( currentDate).startOf('day').format("YYYYMMDD").toString(),
                to: moment( currentDate).startOf('day').format("YYYYMMDD").toString()
            }, function (response) {
                vm.topDrivers = response;
                console.log('response ', vm.topDrivers)
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }
        getLive()
        getTopDrivers()
    }
})();
