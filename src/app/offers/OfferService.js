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
    .factory('OfferService', OfferService)

function OfferService($q, $resource, API, AUTH_API) {
  var url = API;
    return $resource(
        "",
        {id:"@id"},
        {
            getOffers: {
                method: 'GET',
                url:   url + 'offers',
                isArray:false
            },
            getDrivers: {
                method: 'GET',
                url:   url + 'drivers/list',
                isArray:false
            },
            getDriverOffers: {
                method: 'GET',
                url:   url + 'offers/driver/:id',
                isArray:false
            },
            assignOffers: {
                method: 'POST',
                url:   url + 'drivers/offers',
                isArray:false
            },


        }
    );
}
