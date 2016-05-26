/**
 * Created by dell on 24-05-2016.
 */

'use strict';

/*

 */

angular
    .module('tuktukV2Dahboard')
    .factory('StaticDataService', StaticDataService)

function StaticDataService($q, $resource, API) {
    var factory = {}
    factory.cities = [{name: "Indore", value: "indore"}, {name: "Bhopal", value: "bhopal"}];
    factory.vehicleTypes = [{name: "Auto", value: "auto"}, {name: "Bike", value: "bike"}];
    factory.ranges = {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    }

    return factory
}
