(function() {
  'use strict';

  angular
    .module('tuktukV2Dahboard')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($scope, $log, $rootScope, $http, $state, LoginService, UserService, toastr, StaticDataService) {

    $scope.loginUser = function () {
      LoginService.doLogin($scope.user,
          function (response) {
            console.log(response)
            if (response.success) {
              UserService.setUser(response)
              $http.defaults.headers.common.Authorization = 'Basic '+response.token ;
             $rootScope.isAuthenticated = true;

              $state.go("home.performance" ,{city:  $rootScope.city , vehicleType:$rootScope.vehicleType})
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
