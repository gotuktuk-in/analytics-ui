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
    .factory('TripsHandler', TripsHandler);

function TripsHandler() {
    var factory = {};

    //trips
    factory.trips = [];
    factory.filteredTrips = [
        {"key": "Requests", "values": []},
        {"key": "Requests (U)", "values": []},

        {"key": "Cancelled", "values": []},
        {"key": "Cancelled (U)", "values": []},

        {"key": "Fulfilled", "values": []},
        {"key": "Fulfilled (U)", "values": []},

        {"key": "Cancelled trips (by rider)", "values": []},
        {"key": "Cancelled trips (by driver)", "values": []},

        {"key": "tCash", "values": []},
        {"key": "Failed", "values": []},
        {"key": "Failed (U)", "values": []}
    ];

    factory.getTrips = function (data) {
        var requests = [],
            unique_requests = [],
            cancelled_requests = [],
            unique_cancelled_requests = [],
            successful_requests = [],
            unique_successful_requests = [],
            cancelled_trips_rider = [],
            cancelled_trips_driver = [],
            tCash = [],
            failed_total = [],
            failed_unique_riders = [];

        _.each(data, function (value) {

            var longDate = factory.getLongDate(value.id);

            requests.push([longDate, value.requests.total]);
            unique_requests.push([longDate, value.requests.unique_riders]);

            cancelled_requests.push([longDate, value.cancelled.total]);
            unique_cancelled_requests.push([longDate, value.cancelled.unique]);

            successful_requests.push([longDate, value.success.total]);
            unique_successful_requests.push([longDate, value.success.unique_riders]);

            cancelled_trips_rider.push([longDate, value.cancelled.cancelled_by_riders]);
            cancelled_trips_driver.push([longDate, value.cancelled.cancelled_by_drivers]);

            failed_total.push([longDate, value.failed.total]);
            failed_unique_riders.push([longDate, value.failed.unique_riders]);

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
        factory.filteredTrips[9].values = failed_total;
        factory.filteredTrips[10].values = failed_unique_riders;
        console.log(factory.filteredTrips);
        return factory.filteredTrips
    };

    //burn
    factory.burn = [];
    factory.filteredBurn = [
        {"key": "Trip", "values": []},
        {"key": "Offer", "values": []},
        {"key": "Bonus", "values": []},
        {"key": "Tcash", "values": []},
        {"key": "Total", "values": []}
    ];
    factory.getBurn = function (data) {
        var trip = [],
            offer = [],
            bonus = [],
            tcash = [],
            total = [];

        _.each(data, function (value) {
            var longDate = factory.getLongDateBurn(value.date);
            trip.push([longDate, value.trip]);
            offer.push([longDate, value.offer]);
            bonus.push([longDate, value.bonus]);
            tcash.push([longDate, value.tcash]);
            total.push([longDate, value.total]);

        });

        factory.filteredBurn[0].values = trip;
        factory.filteredBurn[1].values = offer;
        factory.filteredBurn[2].values = bonus;
        factory.filteredBurn[3].values = tcash;
        factory.filteredBurn[4].values = total;
        return factory.filteredBurn
    };

    //drivers
    factory.drivers = [];
    factory.filteredDrivers = [
        {"key": "New Drivers", "values": []},
        {"key": "Active Drivers", "values": []},
        {"key": "Avg Trip/Driver", "values": []}
    ];
    factory.getDrivers = function (data) {
        var new_drivers = [],
            active_drivers = [],
            average_rides_per_drivers = [];
        //, total_availability=[]

        _.each(data, function (value) {
            var longDate = factory.getLongDate(value.id);
            new_drivers.push([longDate, value.total_offline]);
            active_drivers.push([longDate, value.total_online]);
            average_rides_per_drivers.push([longDate, value.average_rides_per_driver]);
        });
        factory.filteredDrivers[0].values = new_drivers;
        factory.filteredDrivers[1].values = active_drivers;
        factory.filteredDrivers[2].values = average_rides_per_drivers;

        return factory.filteredDrivers
    };

    //riders
    factory.riders = [];
    factory.filteredRiders = [
        {"key": "New Riders", "values": []},
        {"key": "Active Riders", "values": []},
        {"key": "Total Riders", "values": []}
    ];
    factory.getRiders = function (data) {
        var new_riders = [],
            active_riders = [],
            total_riders = [];
        _.each(data, function (value) {
            var longDate = factory.getLongDate(value.id);
            new_riders.push([longDate, value.newly_reg_riders]);
            active_riders.push([longDate, value.active_riders]);
            total_riders.push([longDate, value.total_riders]);
        });
        factory.filteredRiders[0].values = new_riders;
        factory.filteredRiders[1].values = active_riders;
        factory.filteredRiders[2].values = total_riders;
        return factory.filteredRiders;
    };
    factory.getLongDate = function (date) {
        var dateString = date;
        var year = dateString.substring(0, 4);
        var month = dateString.substring(4, 6);
        var day = dateString.substring(6, 8);
        var hour = dateString.substring(8, 10);

        var newDate = new Date(year, month - 1, day, hour);
        return newDate;
        //  return moment().unix(newDate)
    };

    factory.getLongDateBurn = function (date) {
        var dateString = date;
        var year = dateString.substring(0, 4);
        var month = dateString.substring(4, 6);
        var day = dateString.substring(6, 8);

        var newDate = new Date(year, month - 1, day);
        return newDate;
        //  return moment().unix(newDate)
    };

    return factory
}
