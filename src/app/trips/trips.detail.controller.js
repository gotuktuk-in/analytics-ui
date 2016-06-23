(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('TripDetailController', TripDetailController);

    /** @ngInject */
    function TripDetailController($scope, $interval,  PerformanceService, $stateParams, TripsService, $rootScope) {

        $scope.selectedTrip
        function getDetails() {
            TripsService.getTripDetail({
               dId:$stateParams.driverId,
                rId:$stateParams.riderId,
            }, {id:$stateParams.id}, function (response) {
               $scope.selectedTrip = response
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }
        getDetails()
    }
})();

