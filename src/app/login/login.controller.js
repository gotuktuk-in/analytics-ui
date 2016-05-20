(function() {
  'use strict';

  angular
    .module('tuktukV2Dahboard')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($scope, $log, $rootScope, $http, $state, LoginService, toastr) {

    $scope.loginUser = function () {
      LoginService.doLogin($scope.user,
          function (response) {
            console.log(response)
            if (response.success) {
              $http.defaults.headers.common.Authorization = 'Basic '+response.token ;
              //CommonService.setUser(response)
              $rootScope.isAuthenticated = true;

              $state.go("home.analytics")
              toastr.success("You are successfully logged in.");
            }
            else
            {
              toastr.error(response.msg);
            }

          }, function (err) {
            console.log(err)
            toastr.error(err.data.msg);

          });
    }
  }
})();
