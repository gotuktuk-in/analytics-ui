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
    .factory('LiveHandler', LiveHandler)

function LiveHandler() {
    var factory = {}
    factory.trips = []
    factory.drivers = []
    factory.riders = []
    factory.filteredTrips = [
        {"key": "Total Booking", "values": []},
        {"key": "Total Successful Booking", "values": []},

        {"key": "Unique Successful Booking", "values": []},
        {"key": "In-Progress", "values": []},

        {"key": "Total Cancelled", "values": []},
        {"key": "Unique Cancelled", "values": []},

        {"key": "Total Failed", "values": []},
        {"key": "Unique Failed", "values": []},

    ]

    factory.filteredDrivers = [
        {"key": "Total Drivers", "values": []},
        {"key": "Free Drivers", "values": []},
        {"key": "Occupied Driver", "values": []},
    ]
    factory.filteredRiders = [
        {"key": "Total Riders", "values": []},
        {"key": "New Riders", "values": []},
    ]
    factory.getTrips = function () {
        var booking = [], successful_total = [], successful_unique_riders = [], in_process = [],
            cancelled_total = [], cancelled_unique_rider = [], failed_total = [], failed_unique_rider = [];
        _.each(factory.trips, function (value) {

            var longDate = factory.getLongDate(value.id)

            booking.push([longDate, value.booking])
            successful_total.push([longDate, value.successful.total])

            successful_unique_riders.push([longDate, value.successful.unique_riders])
            in_process.push([longDate, value.in_process])

            cancelled_total.push([longDate, value.cancelled.total])
            cancelled_unique_rider.push([longDate, value.cancelled.unique_riders])

            failed_total.push([longDate, value.failed.total])
            failed_unique_rider.push([longDate, value.failed.unique_rider])
        });
        factory.filteredTrips[0].values = booking;
        factory.filteredTrips[1].values = successful_total;
        factory.filteredTrips[2].values = successful_unique_riders;
        factory.filteredTrips[3].values = in_process;
        factory.filteredTrips[4].values = cancelled_total;
        factory.filteredTrips[5].values = cancelled_unique_rider;
        factory.filteredTrips[6].values = failed_total;
        factory.filteredTrips[7].values = failed_unique_rider;
        return factory.filteredTrips
    }
    factory.getDrivers = function () {
        var total_count = [],free_driver = [],occupied_driver = [];
        _.each(factory.drivers, function (value) {
            var longDate = factory.getLongDate(value.id)
            total_count.push([longDate, value.total_count]);
            free_driver.push([longDate, value.free_driver]);
            occupied_driver.push([longDate, value.occupied_driver]);
        })
        factory.filteredDrivers[0].values = total_count
        factory.filteredDrivers[1].values = free_driver
        factory.filteredDrivers[2].values = occupied_driver

        return factory.filteredDrivers
    }
    factory.getRiders = function () {
        var total_riders = [], new_rider_reg = [];
        _.each(factory.riders, function (value) {
            var longDate = factory.getLongDate(value.id)
            total_riders.push([longDate, value.total_riders]);
            new_rider_reg.push([longDate, value.new_rider_reg]);
        })
        factory.filteredRiders[0].values = total_riders;
        factory.filteredRiders[1].values = new_rider_reg;
        return factory.filteredRiders;
    }
    factory.getLongDate = function (date) {
        var dateString = date;
        var year = dateString.substring(0, 4);
        var month = dateString.substring(4, 6);
        var day = dateString.substring(6, 8);
        var hour = dateString.substring(8, 10);

        var newDate = new Date(year, month - 1, day, hour);
        return newDate
        //  return moment().unix(newDate)

    }
    return factory

}
