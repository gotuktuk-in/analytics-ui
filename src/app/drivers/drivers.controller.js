(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('DriversController', DriversController);

    /** @ngInject */
    function DriversController($scope, $log, $rootScope, $window, DriversService, NgTableParams, LiveService, $resource) {

        var vm = this
        var today = moment()
        var currentDate = moment()
        var current = moment()
        vm.live = true
        $scope.date = moment().format("dddd, MMMM Do YYYY")
        /*    $scope.dates = {};
         $scope.dates.startDate = moment().format("YYYY-MM-DD");
         $scope.dates.endDate = moment().format("YYYY-MM-DD");*/
        vm.changeDate = function (to) {

            if (to == 'next') {
                current =  moment(current).add(1, 'day')
                $scope.date = moment(current).format("dddd, MMMM Do YYYY")

            }
            else {
                current =  moment(current).subtract(1, 'day')
                $scope.date = moment(current).format("dddd, MMMM Do YYYY")

                console.log('$scope.date ', $scope.date)
              //  console.log('currentDate ',moment(today).unix() )
            }
          //  currentDate = angular.copy($scope.date)
          //  $scope.date = moment(currentDate).format("dddd, MMMM Do YYYY")



            if( moment(current).unix() == moment(today).unix())
            {
                vm.live = true;
            }
            else { vm.live = false; }
            vm.getTopDrivers()
        }
        function getLive() {
            LiveService.getOverview({
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType,
            }, function (response) {
                //  PerformanceHandler.trips = response[0].trip
                vm.overview = response;
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }
        vm.getTopDrivers = function() {

            DriversService.getTopDrivers({
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType,
                from: moment( current).startOf('day').format("YYYYMMDD").toString(),
                to: moment( current).endOf('day').format("YYYYMMDD").toString(),
                orderby:'DESC',
                field:'earning'
            }, function (response) {
                vm.topDrivers = response;
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }
        getLive()
        vm.getTopDrivers()
    }
})();
