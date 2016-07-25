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
                url:   url + 'surge/group/',
                isArray:true
            },
            createGroup: {
                method: 'POST',
                url:   url + 'surge/create/group/'
               },
            updateSurgeForGroup: {
                method: 'POST',
                url:   url + 'surge/apply'
            },
            createSurge: {
                method: 'POST',
                url:   url + 'surge/create',
                isArray:true
            },
            removeGroup: {
                method: 'DELETE',
                url:   url + 'surge/delete/group/:id/indore/auto'
            },
            updateGroup: {
                method: 'PUT',
                url:   url + 'surge/edit/group',
                isArray:true
            },

            getGroupSetting: {
                method: 'GET',
                url:   url + 'surge/apply/group/:id'
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
