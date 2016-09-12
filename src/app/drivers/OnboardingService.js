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
    .factory('OnboardingService', OnboardingService)

function OnboardingService($q, $resource, API) {
  var url = API;
    return $resource(
        "",
        {driverId:"@driverId",vehicleRegNumber:"@vehicleRegNumber"},
        {
            saveDriverInfo: {
                method: 'POST',
                url:   url + 'drivers/BasicInfo',
                isArray:false
            },

            updateDriverInfo: {
                method: 'PUT',
                url:   url + 'drivers/:driverId/BasicInfo',
                isArray:false
            },
            saveAccountInfo: {
                method: 'POST',
                url:   url + 'drivers/AccountInfo',
                isArray:false
            },
            saveVehicleInfo: {
                method: 'POST',
                url:   url + 'drivers/VehicleInfo',
                isArray:false
            },
            saveLicenseInfo: {
                method: 'POST',
                url:   url + 'drivers/LicenseInfo',
                isArray:false
            },
            saveIdentityInfo: {
                method: 'POST',
                url:   url + 'drivers/IdentityInfo',
                isArray:false
            },
            saveDeviceInfo: {
                method: 'POST',
                url:   url + 'drivers/saveDeviceInfo',
                isArray:false
            },
            saveOtherInfo: {
                method: 'POST',
                url:   url + 'drivers/AccountInfo',
                isArray:false
            },
            verifyDriver: {
                method: 'POST',
                url:   url + 'driver/verify',
                isArray:false
            },
            vehicleSearch: {
                method: 'GET',
                url:   url + 'vehicle/:vehicleRegNumber',
                isArray:false
            },


        }
    );
}
