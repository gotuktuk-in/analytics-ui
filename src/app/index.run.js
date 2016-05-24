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

    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
      console.log("to "+toState.name +" $state.current.name "+ $state.current.name)
      if(UserService.getUser() != null && (toState.name=="login"))
      {
        $rootScope.isAuthenticated = true;
        $state.go("home.analytics")
        e.preventDefault();
        //   return

      }
    });
  }

})();
