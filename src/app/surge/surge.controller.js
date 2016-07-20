(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('SurgeController', SurgeController);

    /** @ngInject */
    function SurgeController($scope, $rootScope, NgMap, geohash, SurgeService, toastr, ngDialog) {

        var vm = this;
        vm.map;
        vm.geohashArray = [];
        vm.setting = {};
        vm.setting.groupTitle = ''
        vm.setting.type = 'multiply'
        vm.precisionArr = [{name:"4", value:4},{name:"5", value:5},{name:"6", value:6},{name:"7", value:7},{name:"8", value:8}]
        vm.selectedPrecision = vm.precisionArr[2];
        vm.setting.startTime = moment().startOf('day')
        vm.setting.endTime =  moment().startOf('day')
        vm.hstep = 1;
        vm.mstep = 15;
        vm.setting.forceConfirm = true
        $scope.ismeridian = true;
        $scope.toggle = false;
        NgMap.getMap({id:'surgeMap'}).then(function (map) {
            vm.map = map;
            google.maps.event.addDomListener( vm.map, 'click', onMapClick);
            vm.map.setClickableIcons(false);
         //   vm.map.setZoom(vm.selectedPrecision.value + 8);
        });
        vm.onPrecisionChange = function () {
            vm.geohashArray = [];
        }
        vm.removeGeoHash = function (index) {
            vm.geohashArray.splice(index, 1);
        }
        vm.editGroup = function (id, index) {

            getGroupSetting(id)
            vm.geohashArray = []
            _.each(vm.geohashGroups[index].geohash, function(hash){
                vm.geohashArray.push(getGeoHashObj(hash))
            })
         //   vm.groupName = vm.selectedGroup.groupTitle;
            /*   vm.geohashArray = []
                _.each(vm.geohashGroups[index].geohash, function(hash){
                    vm.geohashArray.push(getGeoHashObj(hash))
               })*/
         /*   ngDialog.open({
                template: 'editgroupTemplate.html',
                className: 'ngdialog-theme-plain surge-dialog',
                scope: $scope,
                overlay:true
            });*/
        }
        function getGroupSetting(id)
        {
            SurgeService.getGroupSetting({id:id}, function (response) {
                vm.setting = response;
            }, function (error) {
                toastr.success(error);
            })
        }
        function getAllGroups()
        {
            SurgeService.getGroups({}, function (response) {
                vm.geohashGroups = response;
            }, function (error) {
                toastr.success(error);
            })
        }
        getAllGroups()

        vm.createSurge = function () {
            var obj = {}
            obj.groupTitle = vm.groupName;
            obj.geohash = _.pluck(vm.geohashArray,"geoHash");
            obj.precision = vm.selectedPrecision.value;
           // obj.groupId =  vm.selectedGroup.groupId
            obj.geohash = _.pluck(vm.geohashArray,"geoHash");
            obj.precision = vm.selectedPrecision.value;
            obj.city = $rootScope.city;
            obj.vehicleType = $rootScope.vehicleType;
            obj.driverValue = vm.setting.driverValue;
            obj.groupTitle = vm.setting.groupTitle;
            obj.value = vm.setting.value;
            obj.fromTime = moment(vm.setting.startTime).format('hmm')//moment.unix(vm.setting.selectedDates.startDate);
            obj.toTime = moment(vm.setting.endTime).format('hmm')//moment.unix(vm.setting.selectedDates.endDate);
            obj.type = vm.setting.type;
            obj.forceConfirm = vm.setting.forceConfirm ?  1 : 0
            console.log(obj)

            SurgeService.createSurge(obj, function (response) {
                toastr.success("Settings saved.");
            }, function (error) {
                toastr.success(error);
            })

        }
        vm.addSetting = function () {

        }
        function getGeoHashObj(hash)
        {
            var obj ={}
            obj.geoHash = hash
            var bBox = geohash.decode_bbox (obj.geoHash);
            obj.boxBounds = [[bBox[0], bBox[1]], [bBox[2], bBox[3]]];
            return obj;
        }
        function onMapClick(e)
        {
             var obj = {};
            obj.geoHash = geohash.encode (e.latLng.lat(), e.latLng.lng(), vm.selectedPrecision.value);
            var bBox = geohash.decode_bbox (obj.geoHash);
            obj.boxBounds = [[bBox[0], bBox[1]], [bBox[2], bBox[3]]];
            //[22.720584869384766, 75.85772037506104, 22.720627784729004, 75.85776329040527]
            $scope.$apply(function () {
                vm.geohashArray.push(obj);
            });

          //  console.log('Geo-hash', angular.toJson(vm.geohashArray))
        }

    }
})();
