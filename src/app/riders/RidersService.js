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
    .factory('RidersService', RidersService)

function RidersService($q, $resource, API) {
  var url = API;
    return $resource(
        "",
        {id:"@id", frequency: "@frequency"},
        {
            getRiders: {
                method: 'GET',
                url:   url + 'trips/:frequency/riderChart',
                isArray:true
            }
/*            getAcquisition: {
                method: 'GET',
                url:   url + 'drivers/acquisition',
                isArray:true
            },
            getProfile: {
                method: 'GET',
                url:   url + 'drivers/profile/:id',
                isArray:false
            },
            getTrips: {
                method: 'GET',
                url:   url + 'drivers/:id/trips',
                isArray:false
            },*/


        }
    );
}
