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

    factory.getTripsFtr = function (data) {
        var successful = [],
            cancelled = [],
            accepted_trip = [],
            rejected_trip = [],
            ignored_trip = [],
            maxValueD = [],
            allocated_trip = [];

        _.each(data, function (value) {
            var longDate = factory.getLongDate(value.date);
            successful.push([longDate, value.successful]);
            cancelled.push([longDate, value.cancelled]);

            accepted_trip.push([longDate, value.acceptedTrip]);
            rejected_trip.push([longDate, value.rejectedTrip]);

            ignored_trip.push([longDate, value.ignoredTrip]);
            allocated_trip.push([longDate, value.allocatedTrip]);
        });
        factory.filteredTrips[0].values = successful;
        factory.filteredTrips[1].values = cancelled;
        factory.filteredTrips[2].values = accepted_trip;
        factory.filteredTrips[3].values = rejected_trip;
        factory.filteredTrips[4].values = ignored_trip;
        factory.filteredTrips[5].values = allocated_trip;
        return factory.filteredTrips
    };

    factory.online = [];
    factory.filteredOnline = [
        {"key": "Hours", "values": []}
    ];

    factory.getOnlineFtr = function (data) {
        var onlineHours = [];

        _.each(data, function (value) {
            var longDate = factory.getLongDate(value.date);
            onlineHours.push([longDate, value.successful]);
        });
        factory.filteredOnline[0].values = onlineHours;
        return factory.filteredOnline
    };



    factory.supply = [];
    factory.filteredSupply = [
        {"key": "Hours", "values": []}
    ];
    factory.getSupply = function (data) {
        var totalOnline = [],
            maxValueD = [];

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
