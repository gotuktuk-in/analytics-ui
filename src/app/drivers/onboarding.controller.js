(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('OnboardingController', OnboardingController);

    /** @ngInject */
    function OnboardingController($scope, $log, $rootScope, $interval, StaticDataService, DriversService, $resource, toastr, ngDialog) {
        var vm = this;
    }

})();
