(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/login');
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/login/login.html',
                controller: 'LoginController',
                controllerAs: 'vm'
            })
            .state('home', {
                url: '/home',
                templateUrl: 'app/main/main.html',
                controller: 'MainController',
                controllerAs: 'main',
                abstract: true
            })
            .state('home.performance', {
                url: '/performance/:city/:vehicleType',
                templateUrl: 'app/performance/performance.html',
                controller: 'PerformanceController',
                controllerAs: 'vm'
            })
            .state('home.maps', {
                url: '/maps/:city/:vehicleType',
                templateUrl: 'app/maps/maps.html',
                controller: 'MapsController',
                controllerAs: 'vm',
                cache: false
            })
            .state('home.live', {
                    url: '/live/:city/:vehicleType',
                    templateUrl: 'app/live/live.html',
                    controller: 'LiveController',
                    controllerAs: 'vm',
                    /*resolve: {
                        heatmapResolve: function (LiveService) {
                            LiveService.heatmap({
                                city: $rootScope.city,
                                vehicle: $rootScope.vehicleType,
                                from: from,
                                to: to,
                                state: vm.selected.id
                            })
                    }}*/
                })
            .state('home.drivers', {
                    url: '/drivers/:city/:vehicleType',
                    templateUrl: 'app/drivers/drivers.html',
                    controller: 'DriversController',
                    controllerAs: 'vm'
                })
            .state('home.offers', {
                url: '/offers/',
                templateUrl: 'app/offers/offers.html',
               // controller: 'DriversController',
              //  controllerAs: 'vm'
            })
            .state('home.drivers_detail', {
                url: '/detail/:driverId',
                templateUrl: 'app/drivers/detail.html',
                controller: 'DriversDetailController',
                controllerAs: 'vm'
            })
            .state('home.trips', {
                url: '/trips',
                templateUrl: 'app/trips/trips.html',
                controller: 'TripsController',
                controllerAs: 'vm'
            })
            .state('home.trip_detail', {
                    url: '/tripdetail/:id/:driverId/:riderId',
                    templateUrl: 'app/trips/trip_details.html',
                    controller: 'TripDetailController',
                    controllerAs: 'vm'
                })

    }

})();
