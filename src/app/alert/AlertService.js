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
    .factory('AlertService', AlertService)

function AlertService($q, $resource, API) {
  var url = API;
    return $resource(
        "",
        {},
        {

            sendNotification: {
                method: 'POST',
                url:   url + 'notification',
               },
            getNotification: {
                method: 'GET',
                url:   url + '/rest/v1/notification',
                isArray:false
            }

        }
    );
}
