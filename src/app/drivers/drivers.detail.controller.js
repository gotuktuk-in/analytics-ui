(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('DriversDetailController', DriversDetailController);

    /** @ngInject */
    function DriversDetailController($scope, $stateParams, $rootScope, $window, DriversService, NgTableParams, ngTableEventsChannel, LiveService, $resource) {

        var vm = this
        var current = moment()
        $scope.selectedDates = {};
        $scope.selectedDates.startDate = moment().subtract(1, 'days').format("YYYY-MM-DD");
        $scope.selectedDates.endDate = moment().subtract(1, 'days').format("YYYY-MM-DD");


        vm.getProfile = function () {
            DriversService.getProfile({id:$stateParams.driverId
            }, function (response) {
                vm.profile = response;
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }

        vm.getTrips = function () {
            DriversService.getTrips({id:$stateParams.driverId
            }, function (response) {
                vm.profile = response;
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }
        vm.getAcquisition()
        vm.getProfile()
        vm.getTrips()
    }
})();
