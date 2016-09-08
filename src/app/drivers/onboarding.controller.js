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
        vm.basic.dob = new Date()
        vm.bank = {}
        vm.vehicle = {}
        vm.licence = {}
        vm.identity = {}
        vm.device = {}
        vm.others = {}
        vm.calender = {}
        vm.calender.opened = false
        vm.calender.minDate = new Date()
        vm.openCalender = function()
        {
            vm.calender.opened = true
        }
        vm.verifyDriver = function () {
            OnboardingService.verifyDriver({},{phone: "+"+vm.countryCode + '' + vm.basic.phone}, function (response) {
                vm.basic = response.basic_info;
            }, function (err) {
                $scope.error = true;
            });
        };
        vm.SaveBasicInfo = function () {
            OnboardingService.saveDriverInfo( vm.basic, function (response) {
                toastr.success(response)
                vm.driveId = response.id
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
