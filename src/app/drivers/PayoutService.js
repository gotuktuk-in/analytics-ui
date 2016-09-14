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
    .factory('PayoutService', PayoutService)

function PayoutService($q, $resource, API) {
  var url = API;
    return $resource(
        "",
        {drivers:"@drivers"},
        {
            invoiceListPublish: {
                method: 'PUT',
                url:   url + 'drivers/invoice/publish',
                isArray:false
            },
            invoiceListPaid: {
                method: 'POST',
                url:   url + 'drivers/invoice/paid/:drivers',
                isArray:false
            },
            getInvoiceList: {
                method: 'GET',
                url:   url + 'drivers/invoice',
                isArray:true
            },
            viewDaywiseList: {
                method: 'GET',
                url:   url + 'drivers/invoice/detail/:drivers',
                isArray:false
            }
        }
    );
}
