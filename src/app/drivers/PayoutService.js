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
    .factory('PayoutService', PayoutService);

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
            invoiceListPublishAll: {
                method: 'PUT',
                url:   url + 'allDrivers/invoice/publish',
                isArray:false
            },
            invoiceListPaid: {
                method: 'POST',
                url:   url + 'drivers/invoice/paid/:drivers',
                isArray:false
            },
            addFine: {
                method: 'PUT',
                url:   url + 'drivers/invoice/fine/:drivers',
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
            },
            getWeeks: {
                method: 'GET',
                url:   url + 'payout/weeks',
                isArray:true
            }
        }
    );
}
