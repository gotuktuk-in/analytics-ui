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
    .factory('LiveService', LiveService)

function LiveService($q, $resource, API) {
    var url = API;
    return $resource(
        "",
        {frequency: "@frequency", vehicle: "@vehicle", id: '@id', term: '@term', filterURL: '@filterURL'},
        {
            getOverview: {
                method: 'GET',
                url: url + 'overview/live/'
            },
            getTrips: {
                method: 'GET',
                url: url + 'trip/:frequency/:vehicle',
                isArray: true
            },
            getDrivers: {
                method: 'GET',
                url: url + 'driver/live/'
            },
            getCancelTripsDriver: {
                method: 'GET',
                url: url + 'drivers/cancelled'
            },
            getCancelTripsRider: {
                method: 'GET',
                url: url + 'riders/cancelled'
            },
            getRiders: {
                method: 'GET',
                url: url + 'rider/live/',
            },
            heatmap: {
                method: 'GET',
                url: url + 'trips/heatmap',
                isArray: true
            }

        }
    );
}
