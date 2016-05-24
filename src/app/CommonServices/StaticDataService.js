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
        factory.cities = [{name:"Indore", value:"indore"},{name:"Bhopal", value:"bhopal"}];
        factory.vehicleTypes = [{name:"Auto", value:"auto"},{name:"Bike", value:"bike"}]

    return factory
}
