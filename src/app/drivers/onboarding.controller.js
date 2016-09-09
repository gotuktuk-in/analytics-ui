(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('OnboardingController', OnboardingController);

    /** @ngInject */
    function OnboardingController($scope, $stateParams, $log, $rootScope, $interval, StaticDataService, OnboardingService, $resource, toastr, ngDialog) {

        var vm = this;
        vm.countryCode = '+91';
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
        vm.calender.maxDate = new Date()
        vm.numberVarified = false;
        vm.DRIVER_ACCOUNT = {
            STATUS_DRAFT: 0,
            STATUS_ACTIVE: 1,
            STATUS_SUSPENDED: 2,
            STATUS_DELETED: 3
        }
        vm.openCalender = function()
        {
            vm.calender.opened = true
        }
        vm.verifyDriver = function () {
            OnboardingService.verifyDriver({},{phone: vm.countryCode + '' + vm.basic.phone}, function (response) {

                if(response.ac_status == vm.DRIVER_ACCOUNT.STATUS_ACTIVE || response.ac_status == vm.DRIVER_ACCOUNT.STATUS_SUSPENDED)
                {
                    vm.basic = response.basic_info;
                    vm.basic.phone = vm.basic.phone.substring(3)
                    vm.numberVarified = false;
                }
                else
                {
                    vm.numberVarified = true;
                }


            }, function (err) {
                $scope.error = true;
            });
        };
        vm.SaveBasicInfo = function () {
            if(!vm.numberVarified)
            {
                OnboardingService.saveDriverInfo( vm.basic, function (response) {
                    toastr.success(response.message)
                    vm.driveId = response.id
                }, function (err) {
                    toastr.error(err.message)
                });
            }
            else
            {
                OnboardingService.updateDriverInfo( vm.basic, function (response) {
                    toastr.success(response.message)
                    vm.driveId = response.id
                }, function (err) {
                    toastr.error(err.message)
                });
            }

        };
        vm.SaveBankInfo = function () {
            vm.bank.driverId = vm.driveId;
            OnboardingService.saveDriverInfo( vm.bank , function (response) {
                toastr.success(response.message)
            }, function (err) {
                toastr.error(err.message)
            });
        };
        vm.SaveVehicleInfo = function () {
            OnboardingService.saveDriverInfo( vm.basic,{}, function (response) {
                toastr.success(response.message)
            }, function (err) {
                toastr.error(err)
            });
        };
        vm.SaveLicenseInfo = function () {
            OnboardingService.saveDriverInfo( vm.basic,{}, function (response) {
                toastr.success(response)
            }, function (err) {
                toastr.error(err.message)
            });
        };
        vm.SaveIdentityInfo = function () {
            OnboardingService.saveDriverInfo( vm.basic,{}, function (response) {
                toastr.success(response.message)
            }, function (err) {
                toastr.error(err)
            });
        };
        vm.SaveDeviceInfo = function () {
            OnboardingService.saveDriverInfo( vm.basic,{}, function (response) {
                toastr.success(response)
            }, function (err) {
                toastr.error(err.message)
            });
        };
        vm.SaveOthers = function () {
            OnboardingService.saveDriverInfo( vm.basic,{}, function (response) {
                toastr.success(response.message)
            }, function (err) {
                toastr.error(err.message)
            });
        };
    }

})();
