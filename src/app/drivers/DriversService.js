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
    .factory('DriversService', DriversService)

function DriversService($q, $resource, API) {
  var url = API;
    return $resource(
        "",
        {id:"@id"},
        {
            getdrivers: {
                method: 'GET',
                url:   url + 'driver/day'
            },


        }
    );
}
