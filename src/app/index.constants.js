/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('tuktukV2Dahboard')
    .constant('malarkey', malarkey)
    .constant('moment', moment)

      .constant('API', "https://dev-api-analytics.gotuktuk.in/rest/v1/")
   /* .constant('MAPAPI', "https://qa-api.gotuktuk.in/rest/o/v1/")
    .constant('AUTH_API', "https://qa-api-dashboard.gotuktuk.in/api/o/v1/")
*/


})();
