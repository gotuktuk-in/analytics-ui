(function() {
  'use strict';

  angular
    .module('tuktukV2Dahboard')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($scope, $log, $timeout, $rootScope, $http, $state, LoginService, UserService, toastr, StaticDataService, setNavByRoleService) {
    var vm = this;
    $scope.loginUser = function () {
      LoginService.doLogin($scope.user,
          function (response) {
            
            console.log('vm.modules' , vm.modules);
            if (response.success) {
              vm.modules = response.resources;
              UserService.setUser(response)
              $http.defaults.headers.common.Authorization = 'Basic '+response.token ;
             $rootScope.isAuthenticated = true;
              setNavByRoleService.setNav(vm.modules);
              $timeout(function() { 
                $state.go("home.live" ,{city:  $rootScope.city , vehicleType:$rootScope.vehicleType})
              }, 20);
             
              toastr.success("You are successfully logged in.");
            }
            else
            {
              toastr.error(response.msg);
            }
            
            /*$scope.$storage = $localStorage.$default({
              var nav = vm.modules
            });*/
            //setNavByRoleService.getNavs(vm.modules);

            //$rootScope.$broadcast('roleBasedShowModules', vm.modules);

          }, function (err) {
            console.log(err)
            toastr.error(err.data.msg);

          });
    }
  }
})();
