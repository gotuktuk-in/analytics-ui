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

        vm.verifyDriver = function () {
            OnboardingService.verifyDriver({},{mobile: "+"+vm.countryCode + '' + vm.mobile}, function (response) {
                vm.driverDetailOnboard = response;
            }, function (err) {
                $scope.error = true;
            });
        };
        vm.SaveBasicInfo = function () {
            OnboardingService.saveDriverInfo( vm.basic,{}, function (response) {
                toastr.success(response)
            }, function (err) {
              toastr.error(err)
            });
        };
        vm.SaveBankInfo = function () {
            OnboardingService.saveDriverInfo( vm.basic,{}, function (response) {
                toastr.success(response)
            }, function (err) {
                toastr.error(err)
            });
        };
        vm.SaveVehicleInfo = function () {
            OnboardingService.saveDriverInfo( vm.basic,{}, function (response) {
                toastr.success(response)
            }, function (err) {
                toastr.error(err)
            });
        };
        vm.SaveLicenseInfo = function () {
            OnboardingService.saveDriverInfo( vm.basic,{}, function (response) {
                toastr.success(response)
            }, function (err) {
                toastr.error(err)
            });
        };
        vm.SaveIdentityInfo = function () {
            OnboardingService.saveDriverInfo( vm.basic,{}, function (response) {
                toastr.success(response)
            }, function (err) {
                toastr.error(err)
            });
        };
        vm.SaveDeviceInfo = function () {
            OnboardingService.saveDriverInfo( vm.basic,{}, function (response) {
                toastr.success(response)
            }, function (err) {
                toastr.error(err)
            });
        };
        vm.SaveOthers = function () {
            OnboardingService.saveDriverInfo( vm.basic,{}, function (response) {
                toastr.success(response)
            }, function (err) {
                toastr.error(err)
            });
        };
    }

})();
