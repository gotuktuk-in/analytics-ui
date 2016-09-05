(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('OnboardingController', OnboardingController);

    /** @ngInject */
    function OnboardingController($scope, $log, $rootScope, $interval, StaticDataService, DriversService, $resource, toastr, ngDialog) {
        var vm = this;

        vm.renderOnboardingForm = function () {
            vm.ownershipArr = [
                {name: "Self Owned", value: 0},
                {name: "Rented", value: 1}
            ];
            vm.selectedOwnership = vm.ownershipArr[0];
        };
        vm.renderOnboardingForm();
    }

})();
