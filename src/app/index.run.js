(function() {
  'use strict';

  angular
    .module('tuktukV2Dahboard')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, UserService, toastr, $state, $rootScope, LoginService) {

    $log.debug('runBlock end');

    $rootScope.logout = function()
    {
      LoginService.logout({},function(response){
            toastr.error("You have logged out successfully.");
      },
      function(error){
        toastr.error(error);
      })
      UserService.clearUser()
      $state.go("login")
      $rootScope.isAuthenticated = false;
    }
  }

})();
