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
    .factory('PerformanceHandler', PerformanceHandler)

function PerformanceHandler() {
    var factory = {}
    factory.trips = []
    factory.filteredTrips = [
        {"key":"Requests","values":[]},
        {"key":"Unique Requests","values":[]},

        {"key":"Cancelled Requests","values":[]},
        {"key":"Unique Cancelled Requests","values":[]},

        {"key":"Successful Requests","values":[]},
        {"key":"Unique Successful Requests","values":[]},

        {"key":"Cancelled trips (by rider)","values":[]},
        {"key":"Cancelled trips (by driver)","values":[]},

        {"key":"tCash","values":[]},
    ]
    factory.getTrips = function()
    {
        var requests = [], unique_requests = [], cancelled_requests = [],unique_cancelled_requests = [],
            successful_requests = [], unique_successful_requests = [], cancelled_trips_rider = [], cancelled_trips_driver = [],tCash = []
        _.each(factory.trips , function(value){

            var longDate = factory.getLongDate(value.id)

            requests.push([longDate, value.requests.total])
            unique_requests.push([longDate, value.requests.unique_riders])

            cancelled_requests.push([longDate, value.cancelled.total])
            unique_cancelled_requests.push([longDate, value.cancelled.unique])

            successful_requests.push([longDate, value.success.total])
            unique_successful_requests.push([longDate, value.success.unique_riders])

            cancelled_trips_rider.push([longDate, value.cancelled.cancelled_by_riders])
            cancelled_trips_driver.push([longDate, value.cancelled.cancelled_by_drivers])

            tCash.push([longDate, value.tcash_used])
        });
       factory.filteredTrips[0].values = requests;
        factory.filteredTrips[1].values = unique_requests;
        factory.filteredTrips[2].values = cancelled_requests;
        factory.filteredTrips[3].values = unique_cancelled_requests;
        factory.filteredTrips[4].values = successful_requests;
        factory.filteredTrips[5].values = unique_successful_requests;
        factory.filteredTrips[6].values = cancelled_trips_rider;
        factory.filteredTrips[7].values = cancelled_trips_driver;
        factory.filteredTrips[8].values = tCash;
        return factory.filteredTrips
    }
    factory.getDrivers = function()
    {

    }
    factory.getRiders = function()
    {

    }
    factory.getLongDate = function(date)
    {
        var dateString  = date;
        var year        = dateString.substring(0,4);
        var month       = dateString.substring(4,6);
        var day         = dateString.substring(6,8);
        var hour         = dateString.substring(8,10);

        var newDate        = new Date(year, month-1, day, hour);
        return newDate
      //  return moment().unix(newDate)

    }
    return factory

}
