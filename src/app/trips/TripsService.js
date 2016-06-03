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
    .factory('TripsService', TripsService)

function TripsService($q, $resource, API) {
  var url = API;
    return $resource(
        "",
        {frequency:"@frequency", vehicle:"@vehicle"},
        {
            getAllTrips: {
                method: 'GET',
                url:   url + 'trips',
             //   isArray:true
            },
            getTripDetail: {
                method: 'GET',
                url:   url + 'trips/info',
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
