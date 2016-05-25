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
        {id:"@id"},
        {
            getTrips: {
                method: 'GET',
                url:   url + 'trip/hour',
                isArray:true
            },
            overview: {
                method: 'GET',
                url:   url + 'rider/day'
            },

            registerList: {
                method: 'GET',
                url:   url + 'rider/hour',
                isArray:true
            },

            inprocessList: {
                method: 'GET',
                url:   url + 'rider/inprocess',
                //isArray:true

            },
          deleteInProcessDriver: {
            method: 'DELETE',
            url:   url + 'rider/:id',
            //isArray:true

          },
        }
    );
}
