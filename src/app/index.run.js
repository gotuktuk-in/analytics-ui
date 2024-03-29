(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .run(runBlock);

    /** @ngInject */
    function runBlock($log, UserService, StaticDataService, $http, toastr, $state, $rootScope, LoginService, $templateCache, setNavByRoleService) {
        if (UserService.getUser() != null) {
            $http.defaults.headers.common.Authorization = 'Basic ' + UserService.getUser().token;
        }
        $log.debug('runBlock end');
        $rootScope.city = StaticDataService.cities[0].value
        $rootScope.vehicleType = StaticDataService.vehicleTypes[0].value
        /* $rootScope.$on('$viewContentLoaded', function() {
             var currentPageTemplate = $state.current.templateUrl;
             $templateCache.remove(currentPageTemplate);
             $state.reload();
         });*/
        $rootScope.logout = function () {
            LoginService.logout({}, function (response) {
                setNavByRoleService.clearNav();
                    toastr.error("You have logged out successfully.");
                },
                function (error) {
                    toastr.error(error);
                })
            UserService.clearUser()
            $state.go("login")
            $rootScope.isAuthenticated = false;
        }
        $rootScope.$on('unauthorized', function() {
            UserService.clearUser()
            $state.go("login")
            $rootScope.isAuthenticated = false;
        });
        $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
            console.log("to - " + toState.name + " $state.current.name - " + $state.current.name)
            if (UserService.getUser() != null && (toState.name == "login")) {
                $rootScope.isAuthenticated = true;
                $state.go("home.live" ,{city:  $rootScope.city , vehicleType:$rootScope.vehicleType})
                e.preventDefault();
                //   returna

            }
        });
    }

    /*angular
        .module('tuktukV2Dahboard')
    .factory('RoleBasedNavs', RoleBasedNavs);
    RoleBasedNavs.$inject = ["$rootScope"];

    function RoleBasedNavs($rootScope){
       var service = {
            getNavs : getNavs,
            throwNavs : throwNavs
       }
       return service;

       function getNavs(obj){
        $rootScope.$broadcast("Navsharing", obj);
       }
       function throwNavs(obj){

        $rootScope.$on("Navsharing", function(event, response){
            return obj;
        });
       }
    }*/

})();
