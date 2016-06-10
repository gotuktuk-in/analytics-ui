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
            getTopDrivers: {
                method: 'GET',
                url:   url + 'drivers/topdrivers',
                isArray:true
            },


        }
    );
}
