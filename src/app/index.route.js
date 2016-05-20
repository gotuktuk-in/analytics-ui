(function() {
  'use strict';

  angular
    .module('tuktukV2Dahboard')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'app/login/login.html',
            controller: 'LoginController',
            controllerAs: 'loginctrl'
        })
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main',
            abstract:true
      })
     .state('home.analytics', {
        url: 'analytics',
        templateUrl: 'app/analytics/analytics.html',
        controller: 'AnalyticsController',
        controllerAs: 'vm'
      })
      .state('home.maps', {
            url: 'maps',
            templateUrl: 'app/maps/maps.html',
            controller: 'MapsController',
            controllerAs: 'maps'
        });

    $urlRouterProvider.otherwise('/analytics');
  }

})();
