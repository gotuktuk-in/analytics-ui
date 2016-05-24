/**
 * Created by dell on 24-05-2016.
 */

'use strict';

/*

 */

angular
    .module('tuktukV2Dahboard')
    .service('UserService', UserService)

function UserService($http,$cookies, $resource, $rootScope, API) {
    this.user
    this.setUser = function (user) {
        this.user = user;
        $cookies.putObject("tuktuk.analytics.admin", this.user)
        $rootScope.isAuthenticated = true
    }
    this.getUser = function () {
        if (this.user != null) {
            return this.user;
        }
        else {

            this.user = $cookies.getObject('tuktuk.analytics.admin')
            if (this.user == undefined || this.user == 'undefined') {
                this.user = null
            }
            return this.user;
        }
    }
    this.clearUser = function () {
        this.user = null;
        $cookies.remove('tuktuk.analytics.admin')
        $http.defaults.headers.common.Authorization = '';
    }

}
