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
    .factory('SurgeService', SurgeService)

function SurgeService($q, $resource, API) {
  var url = API;
    return $resource(
        "",
        {id:"@id"},
        {
            getGroups: {
                method: 'GET',
                url:   url + 'serge/group',
                isArray:true
            },
            createGroup: {
                method: 'POST',
                url:   url + 'serge/create/group',
                isArray:true
            },
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
