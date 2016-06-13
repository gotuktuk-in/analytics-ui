(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('DriversController', DriversController);

    /** @ngInject */
    function DriversController($scope, $log, $rootScope, $window, DriversService, NgTableParams,ngTableEventsChannel, LiveService, $resource) {

        var vm = this
        var today = moment()
        var currentDate = moment()
        var current = moment()
        vm.live = true
        $scope.date = moment().format("dddd, MMMM Do YYYY")
        vm.changeDate = function (to) {

            if (to == 'next') {
                current =  moment(current).add(1, 'day')
                $scope.date = moment(current).format("dddd, MMMM Do YYYY")

            }
            else {
                current =  moment(current).subtract(1, 'day')
                $scope.date = moment(current).format("dddd, MMMM Do YYYY")

                console.log('$scope.date ', $scope.date)
            }
        if( moment(current).unix() == moment(today).unix())
            {
                vm.live = true;
            }
            else { vm.live = false; }
            $scope.tableParams.reload()
            $scope.tableParams.page(1)
        }
        function getLive() {
            LiveService.getOverview({
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType,
            }, function (response) {
                vm.overview = response;
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }
        vm.getTopDrivers = function() {

            DriversService.getTopDrivers({
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType,
                from: moment( current).startOf('day').format("YYYYMMDD").toString(),
                to: moment( current).endOf('day').format("YYYYMMDD").toString(),
                orderby:'DESC',
                field:'earning'
            }, function (response) {
                vm.topDrivers = response;
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }
        getLive()
      //  vm.getTopDrivers()

        // call to get data for the tables
         $scope.tableParams = new NgTableParams({page:1,count: 20, sorting:{earning:'desc'},
        }, {
            counts: [],
            getData: function (params) {
                // ajax request to api
               var  start = (params.page() - 1) * 20;
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

                return DriversService.getTopDrivers(
                    {
                        city: $rootScope.city,
                        vehicle: $rootScope.vehicleType,
                        from: moment( current).startOf('day').format("YYYYMMDD").toString(),
                        to: moment( current).endOf('day').format("YYYYMMDD").toString(),
                        orderby:orderBy,
                        field:filed
                    }
                ).$promise.then(function (data) {

                    params.total(data.total); // recal. page nav controls

                    console.log('trop ',data)
                    if(data.length > 0){
                        $scope.tblNoData = false
                    }
                    else{
                        $scope.tblNoData = true
                    }
                    return data;
                });
            }
        });
    }
})();
