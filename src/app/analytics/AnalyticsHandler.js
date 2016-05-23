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
    .factory('AnalyticsHandler', AnalyticsHandler)

function AnalyticsHandler() {
    var factory = {}
    factory.trips = []
    factory.getTrips = function()
    {
        _.each(factory.trips , function(value){
            var theDate = moment().toDate(value.id)
            value.duration = moment(theDate).format("hh")+"-"+ moment(theDate).add(1, 'hour').format("hh")
        });
        return factory.trips
    }
    factory.getDrivers = function()
    {

    }
    factory.getRiders = function()
    {

    }
    return factory

}
