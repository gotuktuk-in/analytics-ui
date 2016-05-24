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
    .factory('LoginService', LoginService)

function LoginService($q, $resource, API) {
  var url = API;
    return $resource(
        "",
        {id:"@id"},
        {
            doLogin: {
                method: 'POST',
                url:   url + 'login'
            },
            logout: {
                method: 'POST',
                url:   url + 'logout'
            },


        }
    );
}
