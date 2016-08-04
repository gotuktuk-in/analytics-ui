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
    .factory('MapService', MapService)

function MapService($q, $resource, API, AUTH_API) {
    var url = API;
    return $resource(
        "",
        {id: "@id", precision: "@precision"},
        {
            getDrivers: {
                method: 'GET',
                url: url + 'map/driver'
                //http://111.118.241.68:8088/rest/v1/geofence
            },
            loadGeoJson: {
                method: 'GET',
                url: AUTH_API + 'geofence'
                //http://111.118.241.68:8088/rest/v1/geofence
            },

            registerList: {
                method: 'GET',
                url: url + 'drivers/registered',
                isArray: true
            },

            inprocessList: {
                method: 'GET',
                url: url + 'drivers/inprocess'
                //isArray:true

            },
            deleteInProcessDriver: {
                method: 'DELETE',
                url: url + 'drivers/:id'
                //isArray:true

            },
            getDemandSupply: {
                method: 'GET',
                url: url + 'supply/demand/indore/auto/:precision',
                isArray: true
            },
            getGroups: {
                method: 'GET',
                url: url + 'surge/group/',
                isArray: true
            }
        }
    );
}
