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
    .factory('LiveService', LiveService)

function LiveService($q, $resource, API) {
  var url = API;
    return $resource(
        "",
        {},
        {
            getOverview: {
                method: 'GET',
                url:   url + 'overview/live/',
            },
            getTrips: {
                method: 'GET',
                url:   url + 'trip/live/',
            },
            getDrivers: {
                method: 'GET',
                url:   url + 'driver/live/',
              },
            getRiders: {
                method: 'GET',
                url:   url + 'rider/live/',
            },
            heatmap: {
            method: 'GET',
            url:   url + 'trips/heatmap',
        },

        }
    );
}
