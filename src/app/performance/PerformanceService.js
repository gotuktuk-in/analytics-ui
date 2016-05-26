'use strict';

/**
 * @ngdoc function
 * @name ly.services:Message
 * @description
 * # Message Resource Api service
 * Message Resource for connecting Message api
 */

angular
    .module('tuktukV2Dahboard')
    .factory('PerformanceService', PerformanceService)

function PerformanceService($q, $resource, API) {
  var url = API;
    return $resource(
        "",
        {frequency:"@frequency", vehicle:"@vehicle"},
        {
            getTrips: {
                method: 'GET',
                url:   url + 'trip/:frequency/:vehicle',
                isArray:true
            },
            getDrivers: {
                method: 'GET',
                url:   url + 'driver/:frequency/:vehicle',
                isArray:true
            },
            getRiders: {
                method: 'GET',
                url:   url + 'rider/:frequency/:vehicle',
                isArray:true
            },

        }
    );
}
