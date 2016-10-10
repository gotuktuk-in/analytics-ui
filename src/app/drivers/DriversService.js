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
    .factory('DriversService', DriversService);

function DriversService($q, $resource, API) {
    var url = API;
    return $resource(
        "",
        {id: "@id", mobile: "@mobile"},
        {
            getTopDrivers: {
                method: 'GET',
                url: url + 'drivers/topdrivers',
                isArray: true
            },
            getLeaderboard: {
                method: 'GET',
                url: url + 'drivers/leaderboard',
                isArray: false
            },
            getAcquisition: {
                method: 'GET',
                url: url + 'drivers/acquisition',
                isArray: true
            },
            getSupply: {
                method: 'GET',
                url: url + 'drivers/supply/hours',
                isArray: true
            },
            getProfile: {
                method: 'GET',
                url: url + 'drivers/profile/:id',
                isArray: false
            },
            getTrips: {
                method: 'GET',
                url: url + 'drivers/:id/trips',
                isArray: false
            },
            verifyDriver: {
                method: 'GET',
                url: url + 'drivers/:mobile/',
                isArray: false
            },
            accountDriver: {
                method: 'PUT',
                url: url + 'driver/account/:id/',
                isArray: false
            },
            getWeeks: {
                method: 'GET',
                url:   url + 'payout/weeks',
                isArray:true
            }
        }
    );
}
