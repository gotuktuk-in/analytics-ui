(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('SurgeController', SurgeController);
    /** @ngInject */
    function SurgeController($scope, $rootScope, NgMap, geohash, SurgeService, toastr, ngDialog, StaticDataService) {
        var vm = this;
        vm.map;
        vm.geohashArray = [];
        vm.geohashGroups = []
        vm.setting = {};
        vm.colors = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];
        //vm.colors = ["#20b2aa", "#fa8072", "#87ceeb", "#daa520", "#00bfff", "#dc143c", "#87cefa", "#90ee90", "#add8e6", "#d3d3d3"];
        vm.hstep = 1;
        vm.mstep = 5;
        $scope.ismeridian = false;
        $scope.toggle = false;
        vm.groupCreation = false;
        vm.groupEdit = false;
        vm.precisionArr = [{name: "5", value: 5}, {name: "6", value: 6}, {
            name: "7",
            value: 7
        }, {name: "8", value: 8}]
        initSetting()
        vm.selectedPrecision = vm.precisionArr[2];
        function initSetting()
        {
            vm.setting.value=''
            vm.setting.driverValue=''
            vm.setting.groupTitle = ''
            vm.setting.type = 'multiply'
            vm.setting.geoHashArr = []
            vm.setting.startTime = moment().add(0, 'm');
            vm.setting.endTime = moment().add(0, 'm');
            vm.setting.forceConfirm = true
        }
        vm.ShapeClicked = function (e) {
              vm.groupEdit = true;
            vm.groupCreation = false;
            var geoHash = geohash.encode(e.latLng.lat(), e.latLng.lng(), vm.selectedPrecision.value);

            vm.setting = findGeohashInArray(geoHash)
            console.log(vm.setting.fromTime)
            console.log(vm.setting.toTime)
            var startHour =  vm.setting.fromTime.slice(0,2)
            var startMin =  vm.setting.fromTime.slice(2,4)
            var endHour =  vm.setting.toTime.slice(0,2)
            var endMin =  vm.setting.toTime.slice(2,4)
            vm.setting.startTime = moment().hour(startHour).minute(startMin);
            vm.setting.endTime = moment().hour(endHour).minute(endMin);
            console.log(vm.setting.startTime)
            console.log(vm.setting.endTime)
            console.log('setting ',vm.setting)
            getGroupSetting(vm.setting.groupId)
        }
        vm.ShapeDblClicked = function (e) {
            e.stop();

            var geoHash = geohash.encode(e.latLng.lat(), e.latLng.lng(), vm.selectedPrecision.value);

            vm.setting = findGeohashInArray(geoHash)
            var index = _.findIndex(vm.setting.geoHashArr, {geoHash: geoHash})
            vm.setting.geoHashArr.splice(index, 1);
        }
        function findGeohashInArray(geoHash) {
            var found;
            _.each(vm.geohashGroups, function (obj) {
                _.each(obj.geoHashArr, function (obj1) {
                    if (obj1.geoHash == geoHash) {
                        found = obj
                        return;

                    }
                })
            })
            return found;
        }

        NgMap.getMap({id: 'surgeMap'}).then(function (map) {
            vm.map = map;
            google.maps.event.addDomListener(vm.map, 'click', onMapClick);
            vm.map.setClickableIcons(false);
            //   vm.map.setZoom(vm.selectedPrecision.value + 8);
        });
        vm.onPrecisionChange = function () {
            vm.groupCreation = false;
            vm.groupEdit = false;
            vm.geohashGroups = []
            initSetting()
            getAllGroups()
        }
        vm.removeGeoHash = function (index) {
            vm.geohashArray.splice(index, 1);
        }
        vm.removeGroup = function (id) {
            SurgeService.removeGroup({id: id}, function (response) {
                initSetting()
                getAllGroups()
                toastr.success(response);
            }, function (error) {
                toastr.success(error);
            })
        }
        vm.editGroup = function (id, index) {

            getGroupSetting(id)
            vm.geohashArray = []
            _.each(vm.geohashGroups[index].geohash, function (hash) {
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
        function getGroupSetting(id) {
            SurgeService.getGroupSetting({id: id}, function (response) {
                vm.setting.driverValue = response.driverValue;
                vm.setting.value = response.value;
                vm.setting.type = response.type;
                vm.setting.forceConfirm = response.forceConfirm ? true :false
                ;
            }, function (error) {
                toastr.success(error);
            })
        }

        function getAllGroups() {
            vm.geohashGroups = []
            SurgeService.getGroups({precision: vm.selectedPrecision.value}, function (response) {
                var allGroups = response
                //    vm.geohashGroups = response;
                var i=0
                _.each(allGroups, function (group) {
                    var newObj = group
                    newObj.color = vm.colors[i]//StaticDataService.getRandomColor()
                    newObj.geoHashArr = []
                    _.each(group.geohash, function (hash) {
                        newObj.geoHashArr.push(getGeoHashObj(hash))
                    })
                    vm.geohashGroups.push(newObj)
                    i++;
                })
                console.log(' vm.geohashGroups ', vm.geohashGroups)
            }, function (error) {
                toastr.success(error);
            })
        }

        getAllGroups()
        vm.createSurge = function () {
            var obj = {}
            obj.groupTitle = vm.setting.groupTitle;
            obj.geohash = _.pluck(vm.setting.geoHashArr, "geoHash");
            obj.precision = vm.selectedPrecision.value;
            // obj.groupId =  vm.selectedGroup.groupId
            obj.precision = vm.selectedPrecision.value;
            obj.city = $rootScope.city;
            obj.vehicleType = $rootScope.vehicleType;
            obj.driverValue = vm.setting.driverValue;

            obj.value = vm.setting.value;
            obj.fromTime = moment(vm.setting.startTime).format('Hmm')//moment.unix(vm.setting.selectedDates.startDate);
            obj.toTime = moment(vm.setting.endTime).format('Hmm')//moment.unix(vm.setting.selectedDates.endDate);
            obj.type = vm.setting.type;
            obj.forceConfirm = vm.setting.forceConfirm ? 1 : 0
            console.log(obj)
            if(vm.groupCreation)
            {
                SurgeService.createSurge(obj, function (response) {
                    vm.groupCreation = false;
                    initSetting()
                    getAllGroups()
                    toastr.success("Surge Group Created.");
                }, function (error) {
                    toastr.success(error);
                })
            }
            else
            {
                obj.groupId = vm.setting.groupId
                SurgeService.updateGroup(obj, function (response) {
                    vm.groupEdit = false;
                    initSetting()
                    getAllGroups()
                    toastr.success("Surge Group Updated.");
                }, function (error) {
                    toastr.success(error);
                })
            }


        }
        vm.addSetting = function () {

        }
        function getGeoHashObj(hash) {
            var obj = {}
            obj.geoHash = hash
            var bBox = geohash.decode_bbox(obj.geoHash);
            obj.boxBounds = [[bBox[0], bBox[1]], [bBox[2], bBox[3]]];
            return obj;
        }

        function onMapClick(e) {

            // For creating new groups
            if (!vm.groupCreation && !vm.groupEdit) {
                vm.groupCreation = true;
                var newGroup = {}
                newGroup.geoHashArr = []
                newGroup.groupTitle = 'untitled group'
                newGroup.color = '#cc99ff'//StaticDataService.getRandomColor()
                newGroup.startTime = moment().add(0, 'm');
                newGroup.endTime = moment().add(0, 'm');
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
                });
                console.log(vm.setting)
            }
            if (vm.groupEdit) {
                var obj = {};
                obj.geoHash = geohash.encode(e.latLng.lat(), e.latLng.lng(), vm.selectedPrecision.value);
                console.log('setting ',vm.setting)
                $scope.$apply(function () {
                    vm.setting.geoHashArr.push(getGeoHashObj(obj.geoHash))
                });
            }
        }
    }
})();
