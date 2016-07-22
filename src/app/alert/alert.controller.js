(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('AlertController', AlertController);

    /** @ngInject */
    function AlertController($scope, $rootScope, AlertService, toastr, NgTableParams, DriversService) {
        var vm = this;
        var current = moment()
        vm.formObj = {}
        vm.formObj.message = {}
        vm.formObj.notificationType = 'push'
        vm.formObj.message.lang = 'en'
        vm.formObj.type='topic'
        vm.selectedDrivers = []
        vm.tabChanged = function (type) {
            console.log('changed', type)
            vm.formObj.type = type;
        }
        vm.searchTable = function () {
            $scope.tableParams.reload()
        }
        vm.selectDriver= function (row , id) {

            if(row.selected && vm.selectedDrivers.length<10)
            {
                vm.selectedDrivers.push(row)
            }
            else
            {
                if(row.selected)
                {
                    row.selected = false;
                    alert("You have selected maximum allowed drivers.")
                }
                else {
                    var index = _.indexOf(_.pluck(vm.selectedDrivers, 'driver_id'), id);//_.findWhere(vm.selectedDrivers, {driver_id:id})
                    vm.selectedDrivers.splice(index, 1)
                }
            }
           /* if(vm.selectedDrivers.length<10)
            {
                if(row.selected)
                {
                    vm.selectedDrivers.push(row)

                }

            }
            else
            {
                if(row.selected  && vm.selectedDrivers.length>0 )
                {

                }
              //  row.selected = false
                if( row.selected && vm.selectedDrivers.length>0)
                {
                    if(!row.selected){
                        var index = _.indexOf(_.pluck(vm.selectedDrivers, 'driver_id'), id);//_.findWhere(vm.selectedDrivers, {driver_id:id})
                        vm.selectedDrivers.splice(index, 1)
                    }
                }
                return;
                //confirm("You have selected maximum allowed drivers.")
            }

*/



        }
        vm.sendPushMsg = function () {

            vm.formObj.id = moment().unix()
            if( vm.formObj.type=='user')
            {
                vm.formObj.drivers = []
                vm.formObj.drivers = _.pluck(vm.selectedDrivers, 'driver_id')
            }
            else {
                vm.formObj.drivers = []
            }
            AlertService.sendNotification(vm.formObj, function (response) {
                toastr.success('Notification sent.')
            }, function (error) {
                toastr.success('Error in sending notification.'+error)
            })
        }
        $scope.tableParams = new NgTableParams({
            page: 1, count: 20, sorting: {earning: 'desc'},
        }, {
            counts: [],
            getData: function (params) {
                // ajax request to api
                var start = params.page()
                console.log("**************************")
                var orderBy = ''
                var field = ''
                if (params.orderBy().length > 0) {
                    orderBy = params.orderBy()[0].substr(0, 1);
                    field = params.orderBy()[0].substr(1);
                    if (orderBy === "+") {
                        orderBy = "ASC"
                    }
                    else {
                        orderBy = "DESC"
                    }
                }
                var dataObj = {
                    city: $rootScope.city,
                    vehicle: $rootScope.vehicleType,
                    from: moment(current).startOf('day').format("YYYYMMDD").toString(),
                    to: moment(current).endOf('day').format("YYYYMMDD").toString(),
                    orderby: orderBy,
                    field: field,
                    start: start,
                    count: params.count()
                }
                if (vm.searchTerm && vm.searchTerm != '') {
                    dataObj.term = "name|" + vm.searchTerm
                }
               /*  if (vm.statusCodes.value != '') {
                    dataObj.filterByStatus = vm.statusCodes.value
                }*/
                return DriversService.getTopDrivers(dataObj).$promise.then(function (data) {

                    params.total(data.total); // recal. page nav controls
                    if (data.length > 0) {
                        $scope.tblNoData = false
                    }
                    else {
                        $scope.tblNoData = true
                    }
                    return data;
                });
            }
        });
    }

})();
