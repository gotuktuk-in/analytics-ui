(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('AlertController', AlertController);

    /** @ngInject */
    function AlertController($scope, $rootScope, $confirm, AlertService, toastr, NgTableParams, OfferService) {
        var vm = this;
        var current = moment()
        vm.formObj = {}
        vm.formObj.message = {}
        vm.formObj.notificationType = 'push'
        vm.formObj.message.lang = 'hi'
        vm.formObj.type = 'topic'
        vm.selectedDrivers = []
        vm.selectedType;
        vm.filterFields = [
            {value: "name", name: "Driver Name"},
            {value: "phone", name: "Driver Phone"},
        ];
        vm.expirationValues = [
            {value: 1 , name: "1 Hour"},
            {value: 12 , name: "12 Hour"},
            {value: 24 , name: "24 Hour"},
            {value: 25 , name: "1 Week"} ,
        ];
        vm.expireAt = vm.expirationValues[0]
        vm.filterTerm = vm.filterFields[0];
        vm.tabChanged = function (type) {
            console.log('changed', type)
            vm.selectedType = type;
            vm.formObj.type = type;
        }
        vm.searchTable = function () {
            $scope.tableParams.reload()
        }
        vm.clearSearch = function () {
            vm.searchTerm = ""
            $scope.tableParams.reload()
        }
        vm.deselectAll = function () {
            vm.selectedDrivers = [];
            angular.forEach($scope.tableParams.data, function (item) {
               if(item && item.selected)
               {
                   item.selected = false
               }
            });
        }
        vm.selectDriver = function (row, id) {

            if (row.selected && vm.selectedDrivers.length < 10) {
                vm.selectedDrivers.push(row)
            }
            else {
                if (row.selected) {
                    row.selected = false;
                    alert("You have selected maximum allowed drivers.")
                }
                else {
                    var index = _.indexOf(_.pluck(vm.selectedDrivers, 'id'), id);//_.findWhere(vm.selectedDrivers, {driver_id:id})
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
        $scope.confirmSendPushMsg = function() {
            $confirm({
                text: 'Are you sure want send Push Message?',
                title: 'Are you Sure?',
                ok: 'Yes',
                cancel: 'No'
            })
                .then(function() {
                    vm.sendPushMsg();
                });
        }
        vm.sendPushMsg = function () {

            vm.formObj.message.id = moment().unix()
            if (vm.formObj.type == 'user') {
                vm.formObj.drivers = []
                vm.formObj.drivers = _.pluck(vm.selectedDrivers, 'id')
            }
            else {
                vm.formObj.drivers = []
            }
            if(vm.expireAt.value>24)
            {
                vm.formObj.message.expireAt = moment().add(1,'week').unix()
            }
            else{
                vm.formObj.message.expireAt = moment().add(vm.expireAt.value,'hour').unix()
            }
            AlertService.sendNotification(vm.formObj, function (response) {
                toastr.success('Notification sent.')
                vm.formObj = {}
                vm.formObj.message = {}
                vm.formObj.drivers = []
                vm.formObj.notificationType = 'push'
                vm.formObj.message.lang = 'hi'
                vm.formObj.type = vm.selectedType
                vm.deselectAll()

            }, function (error) {
                toastr.success('Error in sending notification.' + error)
            })
        }
        $scope.tableParams = new NgTableParams({
            page: 1, count: 1000, sorting: {earning: 'desc'}
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
                    dataObj.term = vm.filterTerm.value + "|" + vm.searchTerm

                }
               /* if (vm.searchTerm && vm.searchTerm != '') {
                    dataObj.term = "phone|" + vm.searchTerm
                }*/
                /*  if (vm.statusCodes.value != '') {
                 dataObj.filterByStatus = vm.statusCodes.value
                 }*/
                return OfferService.getDrivers(dataObj).$promise.then(function (data) {

                    params.total(data.total); // recal. page nav controls
                    if (data.data.length > 0) {
                        $scope.tblNoData = false
                    }
                    else {
                        $scope.tblNoData = true
                        return []
                    }
                    return data.data;
                });
            }
        });

        //--------------- msg archive section
        function getNotificationData() {
            AlertService.getNotification({
                //city: $rootScope.city,
                //vehicle: $rootScope.vehicleType
            }, function (response) {
                vm.notification = response;
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }

        getNotificationData();

        vm.refreshPage = function () {
            getNotificationData();
        }
    }

})();
