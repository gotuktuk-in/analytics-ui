(function() {
  'use strict';

  angular
    .module('tuktukV2Dahboard')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($scope, $log, $rootScope, $http, $state, LoginService, UserService, toastr, StaticDataService, $localStorage , setNavByRoleService) {
    var vm = this;
    $scope.loginUser = function () {
      LoginService.doLogin($scope.user,
          function (response) {
            vm.modules = response.resources;
            console.log('vm.modules' , vm.modules);
            if (response.success) {
              UserService.setUser(response)
              $http.defaults.headers.common.Authorization = 'Basic '+response.token ;
             $rootScope.isAuthenticated = true;

              $state.go("home.live" ,{city:  $rootScope.city , vehicleType:$rootScope.vehicleType})
              toastr.success("You are successfully logged in.");
            }
            else
            {
              toastr.error(response.msg);
            }
            setNavByRoleService.setNav(vm.modules);
            /*$scope.$storage = $localStorage.$default({
              var nav = vm.modules
            });*/
            //RoleBasedNavs.getNavs(vm.modules);

            //$rootScope.$broadcast('roleBasedShowModules', vm.modules);

          }, function (err) {
            console.log(err)
            toastr.error(err.data.msg);

          });
    }
  }
})();
