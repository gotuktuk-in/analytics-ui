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
        vm.setting.type = 'multiply'
        vm.precisionArr = [{name:"4", value:4},{name:"5", value:5},{name:"6", value:6},{name:"7", value:7},{name:"8", value:8}]
        vm.selectedPrecision = vm.precisionArr[2];
        vm.selectedGroup;
        vm.setting.selectedDates = {}
        vm.setting.selectedDates.startDate = moment().format('DD/MM/YYYY h:mm')
        vm.setting.selectedDates.endDate = moment().add(7,'days').format('DD/MM/YYYY h:mm')
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
        vm.editGroup = function (index) {
            vm.selectedGroup = vm.geohashGroups[index];
            vm.groupName = vm.selectedGroup.groupTitle;
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
        function getAllGroups()
        {
            SurgeService.getGroups({}, function (response) {
                vm.geohashGroups = response;
            }, function (error) {
                toastr.success(error);
            })
        }
        getAllGroups()
        vm.addGroup = function () {
            var obj = {}
            obj.title = vm.groupName;
            obj.geohash = _.pluck(vm.geohashArray,"geoHash");
            obj.precision = vm.selectedPrecision.value;
            console.log(obj)

            SurgeService.createGroup(angular.toJson(obj), function (response) {
                toastr.success("Group Created.");
            }, function (error) {
                toastr.success(error);
            })

        }
        vm.saveSurgeSettings = function () {
            var obj = {}
            obj.title = vm.groupName;
            obj.groupId =  vm.selectedGroup.groupId
            obj.geohash = _.pluck(vm.geohashArray,"geoHash");
            obj.precision = vm.selectedPrecision.value;
            obj.city = $rootScope.city;
            obj.vehicle = $rootScope.vehicleType;
            obj.value = vm.setting.charge;
            obj.fromTime = moment.unix(vm.setting.selectedDates.startDate);
            obj.toTime = moment.unix(vm.setting.selectedDates.endDate);
            obj.type = vm.setting.type;
            obj.forceConfirm = vm.setting.forceConfirm;
            console.log(obj)

            SurgeService.updateSurgeForGroup(obj, function (response) {
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
