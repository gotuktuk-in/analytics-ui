(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('TripDetailController', TripDetailController);

    /** @ngInject */
    function TripDetailController($scope, $interval, $stateParams, TripsService, $rootScope, NgMap) {

        var vm = this;

        $scope.selectedTrip
        function getDetails() {
            TripsService.getTripDetail({
                dId: $stateParams.driverId,
                rId: $stateParams.riderId
            }, {id: $stateParams.id}, function (response) {
                $scope.selectedTrip = response;
                //vm.startPointLn = $scope.selectedTrip.pickUp.ln;
                //vm.startPointLt = $scope.selectedTrip.pickUp.lt;
                //vm.endPointLn = $scope.selectedTrip.pickUp.ln;
                //vm.endPointLt = $scope.selectedTrip.pickUp.lt;
                vm.snapCodes = $scope.selectedTrip.snapCode;
                initialize();
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });


            function initialize() {
                var encodedString = vm.snapCodes;

                function replaceAll(search, replacement) {
                    var target = this;
                    return target.split(search).join(replacement);
                };
                var myLatlng = new google.maps.LatLng(22.717081666666665, 75.87155666666666);
                var myOptions = {
                    zoom: 14,
                    center: myLatlng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }
                var map = new google.maps.Map(document.getElementById("driversMap"), myOptions);
                var decodedPath = google.maps.geometry.encoding.decodePath(encodedString);
                //var decodedLevels = decodeLevels("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
                var setRegion = new google.maps.Polyline({
                    path: decodedPath,
                    //levels: decodedLevels,
                    strokeColor: "#333",
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                    map: map
                });
            }
            //function decodeLevels(encodedLevelsString) {
            //    var decodedLevels = [];
            //
            //    for (var i = 0; i < encodedLevelsString.length; ++i) {
            //        var level = encodedLevelsString.charCodeAt(i) - 63;
            //        decodedLevels.push(level);
            //    }
            //    return decodedLevels;
            //}


        }

        getDetails();

    }
})();

