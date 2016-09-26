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
    .factory('TripsService', TripsService);

function TripsService($q, $resource, API) {
    var url = API;
    return $resource(
        "",
        {frequency: "@frequency", vehicle: "@vehicle", id: '@id', term: '@term', filterURL: '@filterURL'},
        {
            getTrips: {
                method: 'GET',
                url: url + 'trip/:frequency/:vehicle',
                isArray: true
            },
            getBurn: {
                method: 'GET',
                url: url + 'burn',
                isArray: true
            },
            getAllTrips: {
                method: 'GET',
                url: url + 'trips'
            },
            getTripDetail: {
                method: 'GET',
                url: url + 'tripinfo/:id',
                isArray: false
            },
            getRiders: {
                method: 'GET',
                url: url + 'rider/:frequency/:vehicle',
                isArray: true
            },
            getTCash: {
                method: 'GET',
                url: url + 'trips/tcash',
                isArray: true
            },
            getBidDetail: {
                method: 'GET',
                url: url + 'trip/bid/drivers/:id',
                isArray: true
            },
            getProfile: {
                method: 'GET',
                url: url + 'drivers/profile/:id',
                isArray: false
            },
            updateFare: {
                method: 'POST',
                url: url + 'trip/settled/:id'
            },
            cancelTrip: {
                method: 'PUT',
                url: url + 'trip/cancelled/:id'
            }

        }
    );
}
