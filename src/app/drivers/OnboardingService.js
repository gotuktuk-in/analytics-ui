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
    .factory('OnboardingService', OnboardingService)

function OnboardingService($q, $resource, API) {
  var url = API;
    return $resource(
        "",
        {id:"@id"},
        {
            saveDriverInfo: {
                method: 'POST',
                url:   url + 'drivers/BasicInfo',
                isArray:false
            },
            updateDriverInfo: {
                method: 'PUT',
                url:   url + 'drivers/BasicInfo',
                isArray:false
            },
            getDriverInfo: {
                method: 'GET',
                url:   url + 'driver/basic/info',
                isArray:true
            },
            verifyDriver: {
                method: 'POST',
                url:   url + 'driver/verify',
                isArray:false
            },
            getTrips: {
                method: 'GET',
                url:   url + 'drivers/:id/trips',
                isArray:false
            },


        }
    );
}
