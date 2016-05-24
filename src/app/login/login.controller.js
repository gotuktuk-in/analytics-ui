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
              $state.go("home.analytics" ,{city: StaticDataService.cities[0].value, vehicleType:StaticDataService.vehicleTypes[0].value})
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
