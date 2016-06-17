(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('DriversDetailController', DriversDetailController);

    /** @ngInject */
    function DriversDetailController($scope, $stateParams, $rootScope, $window, DriversService, NgTableParams, ngTableEventsChannel, LiveService, $resource) {

        var vm = this
        var current = moment()
        $scope.selectedDates = {};
        $scope.selectedDates.startDate = moment().subtract(1, 'days').format("YYYY-MM-DD");
        $scope.selectedDates.endDate = moment().subtract(1, 'days').format("YYYY-MM-DD");


        vm.getProfile = function () {
            DriversService.getProfile({id:$stateParams.driverId
            }, function (response) {
                vm.profile = response;
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }

        vm.getTrips = function () {
            DriversService.getTrips({id:$stateParams.driverId
            }, function (response) {
                vm.profile = response;
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }
        vm.getProfile()
        $scope.tableParams = new NgTableParams({page:1,count: 20, sorting:{earning:'desc'},
        }, {
            counts: [],
            getData: function (params) {
                // ajax request to api
                var  start = params.page()//(params.page() - 1) * params.count();
                console.log("**************************")
                var orderBy= ''
                var filed = ''
                if (params.orderBy().length > 0) {
                    orderBy = params.orderBy()[0].substr(0, 1);
                    filed = params.orderBy()[0].substr(1);
                    if (orderBy === "+") {
                        orderBy = "ASC"
                    }
                    else {
                        orderBy = "DESC"
                    }
                }

                return DriversService.getTrips(
                    {
                       // city: $rootScope.city,
                      //  vehicle: $rootScope.vehicleType,
                        startDate: moment( current).startOf('day').unix(),
                        endDate: moment( current).endOf('day').unix(),
                      //  orderby:orderBy,
                       // field:filed,
                        start:start,
                        count:params.count()

                    },
                    {id:$stateParams.driverId
                    }
                ).$promise.then(function (data) {

                        params.total(data.total); // recal. page nav controls

                        console.log('trop ',data)
                        if(data.data.length > 0){
                            $scope.tblNoData = false
                        }
                        else{
                            $scope.tblNoData = true
                        }
                        return data.data;
                    });
            }
        });
    }
})();
