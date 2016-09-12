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
        vm.canEdit= false;
        vm.canCreate= false;
        vm.canView= false;
        vm.DRIVER_ACCOUNT = {
            STATUS_DRAFT: 0,
            STATUS_ACTIVE: 1,
            STATUS_SUSPENDED: 2,
            STATUS_DELETED: 3,
            NEW_ACCOUNT: -1
        }

        vm.openCalender = function()
        {
            vm.calender.opened = true
        }
        vm.verifyDriver = function () {
            OnboardingService.verifyDriver({},{phone: vm.countryCode + '' + vm.basic.phone}, function (response) {
                if(response.ac_status == vm.DRIVER_ACCOUNT.NEW_ACCOUNT) {
                    vm.canCreate= true;
                }
                else if(response.ac_status == vm.DRIVER_ACCOUNT.STATUS_DELETED || response.ac_status == vm.DRIVER_ACCOUNT.STATUS_DRAFT)
                {
                    vm.basic = response.basic_info;
                    vm.basic.phone = vm.basic.phone.substring(3)
                    vm.canEdit = true;
                }
                else
                {
                    vm.canView = true;
                }


            }, function (err) {
                $scope.error = true;
            });
        };
        vm.SaveBasicInfo = function () {

            vm.basic.phone =  angular.copy(vm.countryCode + '' + vm.basic.phone)
            if(vm.canCreate)
            {
                OnboardingService.saveDriverInfo( vm.basic, function (response) {
                    toastr.success(response.message)
                    vm.driveId = response.id
                    vm.basic.phone = vm.basic.phone.substring(3)
                    vm.canCreate= false;
                    vm.canEdit = true;
                }, function (err) {
                    toastr.error(err.message)
                });
            }
            else
            {
                OnboardingService.updateDriverInfo( {driveId: vm.driveId},vm.basic, function (response) {
                    toastr.success(response.message)
                    vm.basic.phone = vm.basic.phone.substring(3)
                }, function (err) {
                    toastr.error(err.message)
                });
            }

        };
        vm.SaveBankInfo = function () {
            vm.bank.driverId = vm.driveId;
            OnboardingService.saveAccountInfo( vm.bank , function (response) {
                toastr.success(response.message)
            }, function (err) {
                toastr.error(err.data.message)
            });
        };
        vm.SaveVehicleInfo = function () {
            OnboardingService.saveVehicleInfo( vm.basic,{}, function (response) {
                toastr.success(response.message)
            }, function (err) {
                toastr.error(err)
            });
        };
        vm.SaveLicenseInfo = function () {
            OnboardingService.saveLicenseInfo( vm.basic,{}, function (response) {
                toastr.success(response)
            }, function (err) {
                toastr.error(err.message)
            });
        };
        vm.SaveIdentityInfo = function () {
            OnboardingService.saveIdentityInfo( vm.basic,{}, function (response) {
                toastr.success(response.message)
            }, function (err) {
                toastr.error(err)
            });
        };
        vm.SaveDeviceInfo = function () {
            OnboardingService.saveDeviceInfo( vm.basic,{}, function (response) {
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
        vm.SearchVehiclesByReg = function () {
            OnboardingService.vehicleSearch( {vehicleRegNumber:vm.vehicle.vehicleRegNumber}, function (response) {
                toastr.success(response.message)
            }, function (err) {
                toastr.error(err.message)
            });
        };

        vm.showAddVehicleForm = function () {
            ngDialog.open({
                template: 'AddVehicleForm.html',
                className: 'ngdialog-theme-plain',
                scope: $scope
            });
        }
    }

})();
