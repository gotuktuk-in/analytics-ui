(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('OnboardingController', OnboardingController);

    /** @ngInject */
    function OnboardingController($scope, $stateParams, $log, $rootScope, $interval, StaticDataService, OnboardingService, $resource, toastr, ngDialog) {

        var vm = this;
        vm.countryCode = 91;
        vm.basic = {}
        vm.bank = {}
        vm.vehicle = {}
        vm.licence = {}
        vm.identity = {}
        vm.device = {}
        vm.others = {}

        /* vm.countryCodeVerify = 91;
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
*/
        vm.verifyDriver = function () {
            OnboardingService.verifyDriver({},{mobile: "+"+vm.countryCode + '' + vm.mobile}, function (response) {
                vm.driverDetailOnboard = response;
            }, function (err) {
                $scope.error = true;
            });
        };
    }

})();
