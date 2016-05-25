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
            controllerAs: 'vm'
        })
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main',
            abstract:true
      })
     .state('home.performance', {
        url: 'performance/:city/:vehicleType',
        templateUrl: 'app/performance/performance.html',
        controller: 'PerformanceController',
        controllerAs: 'vm'
      })
      .state('home.maps', {
            url: 'maps',
            templateUrl: 'app/maps/maps.html',
            controller: 'MapsController',
            controllerAs: 'vm'
        })
  .state('home.drivers', {
          url: 'drivers',
          templateUrl: 'app/drivers/drivers.html',
          controller: 'DriversController',
          controllerAs: 'drivers'
      });

    $urlRouterProvider.otherwise('/login');
  }

})();
