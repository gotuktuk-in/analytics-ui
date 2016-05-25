(function() {
  'use strict';

  angular
    .module('tuktukV2Dahboard')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, UserService,StaticDataService, toastr, $state, $rootScope, LoginService, $templateCache) {

    $log.debug('runBlock end');
      $rootScope.city = StaticDataService.cities[0].value
      $rootScope.vehicleType = StaticDataService.vehicleTypes[0].value
   /* $rootScope.$on('$viewContentLoaded', function() {
      $templateCache.removeAll();
    });*/
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
        $state.go("home.performance")
        e.preventDefault();
        //   return

      }
    });
  }

})();
