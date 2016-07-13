(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('surgeController', surgeController);

    /** @ngInject */
    function surgeController($scope, $log, $rootScope, MapService, NgMap, AUTH_API) {

        $scope.toggle = false;

    }
})();
