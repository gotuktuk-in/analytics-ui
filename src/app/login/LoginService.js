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

function LoginService($q, $resource, API, AUTH_API) {
  var url = API;
  var authURL = AUTH_API;
    return $resource(
        "",
        {id:"@id"},
        {
            doLogin: {
                method: 'POST',
                url:   authURL + 'login'
            },
            logout: {
                method: 'GET',
                url:   url + 'logout'
            },


        }
    );
}
