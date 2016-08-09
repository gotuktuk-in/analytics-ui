(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('SurgeController', SurgeController);
    /** @ngInject */
    function SurgeController($scope, $rootScope, NgMap, geohash, SurgeService, toastr, ngDialog, StaticDataService) {
        var vm = this;
        vm.map
        vm.geohashArray = [];
        vm.geohashGroups = [];
        vm.setting = {};
        vm.colors = ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'];
        vm.hstep = 1;
        vm.mstep = 5;
        $scope.ismeridian = false;
        $scope.toggle = false;
        vm.groupCreation = false;
        vm.groupEdit = false;
        vm.precisionArr = [
            {name: "5", value: 5},
            {name: "6", value: 6},
            {name: "7", value: 7},
            {name: "8", value: 8}
        ];
        vm.selectedPrecision = vm.precisionArr[2];

        vm.multipleArrRider = [
            {name: "1.1", value: 1.1},
            {name: "1.2", value: 1.2},
            {name: "1.3", value: 1.3},
            {name: "1.4", value: 1.4},
            {name: "1.5", value: 1.5},
            {name: "1.6", value: 1.6},
            {name: "1.7", value: 1.7},
            {name: "1.8", value: 1.8},
            {name: "1.9", value: 1.9}
        ];
        vm.setting.value = vm.multipleArrRider[0];
        vm.multipleArrDriver = [
            {name: "1.1", value: 1.1},
            {name: "1.2", value: 1.2},
            {name: "1.3", value: 1.3},
            {name: "1.4", value: 1.4},
            {name: "1.5", value: 1.5},
            {name: "1.6", value: 1.6},
            {name: "1.7", value: 1.7},
            {name: "1.8", value: 1.8},
            {name: "1.9", value: 1.9}
        ];
        vm.setting.driverValue = vm.multipleArrDriver[0];

        vm.plusArrDriver = [
            {name: "5", value: 5},
            {name: "10", value: 10},
            {name: "15", value: 15},
            {name: "20", value: 20},
            {name: "25", value: 25},
            {name: "30", value: 30},
            {name: "35", value: 35},
            {name: "40", value: 40},
            {name: "45", value: 45},
            {name: "50", value: 50}
        ];
        vm.selectedPlus = vm.plusArrDriver[0];
        vm.plusArrRider = [
            {name: "5", value: 5},
            {name: "10", value: 10},
            {name: "15", value: 15},
            {name: "20", value: 20},
            {name: "25", value: 25},
            {name: "30", value: 30},
            {name: "35", value: 35},
            {name: "40", value: 40},
            {name: "45", value: 45},
            {name: "50", value: 50}
        ];
        vm.selectedPlus = vm.plusArrRider[0];


        initSetting();

        function initSetting() {
            vm.setting.value = '';
            vm.setting.driverValue = '';
            vm.setting.groupTitle = '';
            vm.setting.type = 'multiply';
            vm.setting.geoHashArr = [];
            vm.setting.startTime = moment().add(0, 'm');
            vm.setting.endTime = moment().add(0, 'm');
            vm.setting.forceConfirm = true;
            console.log(vm.setting.value);
        }

        vm.ShapeClicked = function (e) {
            var geoHash = geohash.encode(e.latLng.lat(), e.latLng.lng(), vm.selectedPrecision.value);
            vm.setting = findGeohashInArray(geoHash);
            if (vm.setting.groupId) {
                vm.groupEdit = true;
                vm.groupCreation = false;
                console.log(vm.setting.fromTime);
                console.log(vm.setting.toTime);
                var startHour = vm.setting.fromTime.slice(0, 2);
                var startMin = vm.setting.fromTime.slice(2, 4);
                var endHour = vm.setting.toTime.slice(0, 2);
                var endMin = vm.setting.toTime.slice(2, 4);

                var startDate = new Date();
                startDate.setUTCHours(startHour, startMin, 0, 0);
                var newStartHrs = startDate.getHours();
                var newStartMin = startDate.getMinutes();

                var endDate = new Date();
                endDate.setUTCHours(endHour, endMin, 0, 0);
                var newEndHrs = endDate.getHours();
                var newEndMin = endDate.getMinutes();

                vm.setting.startTime = moment().hour(newStartHrs).minute(newStartMin);
                vm.setting.endTime = moment().hour(newEndHrs).minute(newEndMin);
                getGroupSetting(vm.setting.groupId)
            }
            else {
                vm.groupEdit = false;
                vm.groupCreation = true;
            }
        };
        vm.ShapeDblClicked = function (e) {
            e.stop();
            var geoHash = geohash.encode(e.latLng.lat(), e.latLng.lng(), vm.selectedPrecision.value);
            vm.setting = findGeohashInArray(geoHash);
            var index = _.findIndex(vm.setting.geoHashArr, {geoHash: geoHash});
            vm.setting.geoHashArr.splice(index, 1);
        };
        function findGeohashInArray(geoHash) {
            var found;
            _.each(vm.geohashGroups, function (obj) {
                _.each(obj.geoHashArr, function (obj1) {
                    if (obj1.geoHash == geoHash) {
                        found = obj;
                        return;

                    }
                })
            });
            return found;
        }

        NgMap.getMap({id: 'surgeMap'}).then(function (map) {
            vm.map = map;
            google.maps.event.addDomListener(vm.map, 'click', onMapClick);
            vm.map.setClickableIcons(false);
        });
        vm.onPrecisionChange = function () {
            vm.groupCreation = false;
            vm.groupEdit = false;
            vm.geohashGroups = [];
            initSetting();
            getAllGroups();
        };
        vm.refresh = function () {
            vm.groupCreation = false;
            vm.groupEdit = false;
            initSetting();
            getAllGroups();
        };
        vm.removeGeoHash = function () {
            vm.geohashArray.splice(index, 1);
        };
        vm.removeGroup = function (id) {
            SurgeService.removeGroup({id: id}, function (response) {
                vm.refresh();
                getAllGroups();
                toastr.success(response);
            }, function (error) {
                toastr.success(error);
            })
        };
        //vm.editGroup = function (id, index) {
        //
        //    getGroupSetting(id)
        //    vm.geohashArray = []
        //    _.each(vm.geohashGroups[index].geohash, function (hash) {
        //        vm.geohashArray.push(getGeoHashObj(hash))
        //    })
        //    //   vm.groupName = vm.selectedGroup.groupTitle;
        //    /*   vm.geohashArray = []
        //     _.each(vm.geohashGroups[index].geohash, function(hash){
        //     vm.geohashArray.push(getGeoHashObj(hash))
        //     })*/
        //    /*   ngDialog.open({
        //     template: 'editgroupTemplate.html',
        //     className: 'ngdialog-theme-plain surge-dialog',
        //     scope: $scope,
        //     overlay:true
        //     });*/
        //}
        function getGroupSetting(id) {
            SurgeService.getGroupSetting({id: id}, function (response) {
                //vm.setting.driverValue = response.driverValue;
                //vm.setting.value = response.value;
                vm.setting.driverValue = {name: response.driverValue, value: response.driverValue},
                vm.setting.value = {name: response.value, value: response.value},
                vm.setting.type = response.type;
                vm.setting.forceConfirm = response.forceConfirm ? true : false
                ;
            }, function (error) {
                toastr.success(error);
            })
        }

        function getAllGroups() {
            vm.geohashGroups = [];
            SurgeService.getGroups({precision: vm.selectedPrecision.value}, function (response) {
                var allGroups = response;
                var i = 0;
                _.each(allGroups, function (group) {
                    var newObj = group;
                    newObj.color = vm.colors[i]; //StaticDataService.getRandomColor()
                    newObj.geoHashArr = [];
                    _.each(group.geohash, function (hash) {
                        newObj.geoHashArr.push(getGeoHashObj(hash))
                    });
                    vm.geohashGroups.push(newObj);
                    i++;
                });
                console.log(' vm.geohashGroups ', vm.geohashGroups)
            }, function (error) {
                toastr.success(error);
            })
        }

        getAllGroups();
        vm.createSurge = function () {
            var obj = {};
            obj.groupTitle = vm.setting.groupTitle;
            obj.geohash = _.pluck(vm.setting.geoHashArr, "geoHash");
            obj.precision = vm.selectedPrecision.value;
            // obj.groupId =  vm.selectedGroup.groupId
            obj.precision = vm.selectedPrecision.value;
            obj.city = $rootScope.city;
            obj.vehicleType = $rootScope.vehicleType;
            obj.driverValue = vm.setting.driverValue.value;
            obj.value = vm.setting.value.value;

            var fromTimeUtc = moment.utc(vm.setting.startTime).format('Hmm');
            var toTimeUtc = moment.utc(vm.setting.endTime).format('Hmm');
            if (fromTimeUtc.length < 4) {
                obj.fromTime = '0' + fromTimeUtc
            } else {
                obj.fromTime = fromTimeUtc
            }
            if (toTimeUtc.length < 4) {
                obj.toTime = '0' + toTimeUtc
            } else {
                obj.toTime = toTimeUtc
            }

            obj.type = vm.setting.type;
            obj.forceConfirm = vm.setting.forceConfirm ? 1 : 0
            console.log(obj);
            if (vm.groupCreation) {
                SurgeService.createSurge(obj, function (response) {
                    vm.groupCreation = false;
                    initSetting();
                    getAllGroups();
                    toastr.success("Surge Group Created.");
                }, function (error) {
                    toastr.success(error);
                })
            }
            else {
                obj.groupId = vm.setting.groupId;
                SurgeService.updateGroup(obj, function (response) {
                    vm.groupEdit = false;
                    initSetting();
                    getAllGroups();
                    toastr.success("Surge Group Updated.");
                }, function (error) {
                    toastr.success(error);
                })
            }


        };
        vm.addSetting = function () {

        };
        function getGeoHashObj(hash) {
            var obj = {};
            obj.geoHash = hash;
            var bBox = geohash.decode_bbox(obj.geoHash);
            obj.boxBounds = [[bBox[0], bBox[1]], [bBox[2], bBox[3]]];
            return obj;
        }

        function onMapClick(e) {

            // For creating new groups
            if (!vm.groupCreation && !vm.groupEdit) {
                vm.groupCreation = true;
                var newGroup = {};
                newGroup.geoHashArr = [];
                newGroup.groupTitle = 'untitled group';
                newGroup.color = '#cc99ff'; //StaticDataService.getRandomColor()
                newGroup.startTime = moment().add(0, 'm');
                newGroup.endTime = moment().add(15, 'm');
                vm.setting.driverValue = vm.multipleArrDriver[0];
                $scope.$apply(function () {
                    vm.geohashGroups.push(newGroup)
                });
            }
            if (vm.groupCreation) {
                var obj = {};
                obj.geoHash = geohash.encode(e.latLng.lat(), e.latLng.lng(), vm.selectedPrecision.value);
                $scope.$apply(function () {
                    _.last(vm.geohashGroups).geoHashArr.push(getGeoHashObj(obj.geoHash))
                    vm.setting = _.last(vm.geohashGroups)
                    vm.setting.driverValue = vm.multipleArrDriver[0];
                    vm.setting.value = vm.multipleArrDriver[0];
                });
            }
            if (vm.groupEdit) {
                var obj = {};
                obj.geoHash = geohash.encode(e.latLng.lat(), e.latLng.lng(), vm.selectedPrecision.value);
                $scope.$apply(function () {
                    vm.setting.geoHashArr.push(getGeoHashObj(obj.geoHash))
                });
            }
        }
    }
})();
