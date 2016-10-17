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
    .factory('DriverHandler', DriverHandler);

function DriverHandler() {
    var factory = {};

    factory.trips = [];
    factory.filteredTrips = [
        {"key": "Successful", "values": []},
        {"key": "Cancelled", "values": []},

        {"key": "Accepted Trip", "values": []},
        {"key": "Rejected Trip", "values": []},

        {"key": "Ignored Trip", "values": []},
        {"key": "Allocated Trip", "values": []}
    ];

    factory.getTrips = function () {
        var booking = [], successful_total = [], successful_unique_riders = [], in_process = [],
            cancelled_total = [], cancelled_unique_rider = [], failed_total = [], failed_unique_rider = [];
        _.each(factory.trips, function (value) {

            var longDate = factory.getLongDate(value.id);

            booking.push([longDate, value.booking]);
            successful_total.push([longDate, value.successful.total]);

            successful_unique_riders.push([longDate, value.successful.unique_riders]);
            in_process.push([longDate, value.in_process]);

            cancelled_total.push([longDate, value.cancelled.total]);
            cancelled_unique_rider.push([longDate, value.cancelled.unique_riders]);

            failed_total.push([longDate, value.failed.total]);
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
    };



    factory.supply = [];
    factory.filteredSupply = [
        {"key": "Hours", "values": []}
    ];
    factory.getSupply = function (data) {
        var totalOnline = [];
        var maxValueD = [];

        _.each(data, function (value) {
            var longDate = factory.getLongDate(value.id);
            totalOnline.push([longDate, secondsToTime(value.totalOnline)]);
            maxValueD.push(parseInt(secondsToTime(value.totalOnline)));
        });

        factory.maxValueDNew = _.max(maxValueD, function(d){ return d });
        factory.filteredSupply[0].values = totalOnline;
        return factory.filteredSupply;
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

    function secondsToTime(secs) {
        var hours = Math.floor(secs / (60 * 60));

        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);

        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);

        var obj = hours + minutes + seconds;
        return obj;
    }

    function _converts(second) {
        var onlineHour = '-';
        var hours = Math.floor(second / 3600) % 24;
        onlineHour = hours ? (hours == 0 ? '' : hours + '.' ) : '';
        var minutes = Math.floor(second / 60) % 60;
        onlineHour = onlineHour + (minutes ? (minutes == 0 ? '' : minutes) : '');
        return onlineHour;
    }
    return factory
}
