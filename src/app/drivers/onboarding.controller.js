(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('OnboardingController', OnboardingController);

    /** @ngInject */
    function OnboardingController($scope, $stateParams, $log, $rootScope, $interval, StaticDataService, DriversService, $resource, toastr, ngDialog) {

        var vm = this;
        vm.mobileNumber = '';
        vm.countryCode = 91;
        vm.countryCodeVerify = 91;
        $scope.AddVehicleForm = false;

        vm.hideAddVehicleForm = function () {
            $scope.AddVehicleForm = false;
        };

        vm.showAddVehicleForm = function () {
            $scope.AddVehicleForm = true;
        };

        vm.renderOnboardingForm = function () {
            vm.ownershipArr = [
                {name: "Self Owned", value: 0},
                {name: "Rented", value: 1}
            ];
            vm.selectedOwnership = vm.ownershipArr[0];
        };
        vm.renderOnboardingForm();

        vm.verifyDriver = function () {
            DriversService.verifyDriver({
                mobile:'+' + vm.countryCodeVerify + '' + vm.mobileNumber
            }, function (response) {
                vm.driverDetailOnboard = response;
            }, function (err) {
                $scope.error = true;
            });
        };
    }

})();
