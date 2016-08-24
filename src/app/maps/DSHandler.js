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
    .factory('DSHandler', DSHandler)

function DSHandler() {
    var factory = {}
    factory.trips = []
    factory.filteredTrips = [
      /*  {"key": "Total Supply", "values": []},
        {"key": "Total Demand", "values": []},

        {"key": "Title", "values": []},
        {"key": "Sub Title", "values": []},*/

        {"key": "Demand", "values": []},
        {"key": "Supply", "values": []},

    ]

    factory.getDS = function (data) {
        var total_supply = [], total_demand = [], title = [], subtitle = [],
            supply = [], demand = []
        _.each(data.value, function (value) {

            var longDate = factory.getLongDate(value.id)

           // total_supply.push([longDate, data.totalSupply])
           // total_demand.push([longDate, data.totalDemand])

          //  title.push([longDate, data.title])
          //  subtitle.push([longDate, data.subTitle])

            supply.push([longDate, value.supply])
            demand.push([longDate, value.demand])

         });
       /* factory.filteredTrips[0].values = total_supply;
        factory.filteredTrips[1].values = total_demand;
        factory.filteredTrips[2].values = title;
        factory.filteredTrips[3].values = subtitle;*/
        factory.filteredTrips[0].values = supply;
        factory.filteredTrips[1].values = demand;
        return factory.filteredTrips
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
