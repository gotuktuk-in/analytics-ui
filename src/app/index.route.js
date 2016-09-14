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
            /*.state('home.maps', {
                url: '/maps/:city/:vehicleType',
                templateUrl: 'app/maps/maps.html',
                controller: 'MapsController',
                controllerAs: 'vm',
                cache: false
            })
            .state('home.demandsupply', {
                url: '/maps/demand-supply/:city/:vehicleType',
                templateUrl: 'app/maps/demand-supply.html',
                controller: 'DemandSupplyController',
                controllerAs: 'vm',
                cache: false
            })*/
            .state('home.map', {
                url: '/maps/:city/:vehicleType',
                templateUrl: 'app/maps/demand-supply.html',
                controller: 'DemandSupplyController',
                controllerAs: 'vm',
                cache: false
            })
            .state('home.live', {
                    url: '/live/:city/:vehicleType',
                    templateUrl: 'app/live/live.html',
                    controller: 'LiveController',
                    controllerAs: 'vm'
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
            .state('home.onboarding', {
                url: '/drivers/onboarding/:city/:vehicleType',
                templateUrl: 'app/drivers/onboarding.html',
                controller: 'OnboardingController',
                controllerAs: 'vm'
            })
            .state('home.payout', {
                url: '/drivers/payout/:city/:vehicleType',
                templateUrl: 'app/drivers/payout.html',
                controller: 'PayoutController',
                controllerAs: 'vm'
            })
            .state('home.offers', {
                url: '/offers/',
                templateUrl: 'app/offers/offers.html',
                controller: 'OffersController',
                controllerAs: 'vm'
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
                    url: '/tripdetail/:id',
                    templateUrl: 'app/trips/trip_details.html',
                    controller: 'TripDetailController',
                    controllerAs: 'vm'
                })
            .state('home.riders', {
                url: '/riders',
                templateUrl: 'app/riders/riders.html',
                controller: 'RidersController',
                controllerAs: 'vm'
            })
            .state('home.surge', {
                url: '/surge',
                templateUrl: 'app/surge/surge.html',
                controller: 'SurgeController',
                controllerAs: 'vm'
            })
            .state('home.alert', {
                url: '/alert',
                templateUrl: 'app/alert/alert.html',
                controller: 'AlertController',
                controllerAs: 'vm'
            })
    }

})();
