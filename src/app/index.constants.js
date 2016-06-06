/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('tuktukV2Dahboard')
    .constant('malarkey', malarkey)
    .constant('moment', moment)

       .constant('API', "https://analytics.gotuktuk.in/rest/v1/")
	   .constant('AUTH_API', "https://analytics.gotuktuk.in/rest/o/v1/")
         //  .constant('API', "http://192.168.1.107:8088/rest/v1/")
//     .constant('AUTH_API', "http://192.168.1.107:8088/rest/o/v1/")



})();
