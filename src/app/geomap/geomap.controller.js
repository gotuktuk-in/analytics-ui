(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('GeoMapController', GeoMapController);

    /** @ngInject */
    function GeoMapController($scope, $log, $rootScope, $interval, StaticDataService, ChartConfigService, PerformanceService, PerformanceHandler, RidersService, NgTableParams, ngTableEventsChannel, LiveService, $resource) {

        var vm = this;
        var map;
        function initMap() {
            map = new google.maps.Map(document.getElementById('tuktukGeoMap'), {
                center: {lat: -34.397, lng: 150.644},
                zoom: 8
            });
        }
        initMap()
    }
})();
