/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('tuktukV2Dahboard')
    .constant('malarkey', malarkey)
    .constant('moment', moment)

      	.constant('API', "https://analytics.gotuktuk.in/rest/v1/")
		.constant('AUTH_API', "https://analytics.gotuktuk.in/rest/o/v1/")
        // .constant('API', "https://dev-api-analytics.gotuktuk.in/rest/v1/")
//         .constant('AUTH_API', "https://dev-api-analytics.gotuktuk.in/rest/o/v1/")



})();
