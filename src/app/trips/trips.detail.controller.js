(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('TripDetailController', TripDetailController);

    /** @ngInject */
    function TripDetailController($scope, $interval, $stateParams, TripsService, $rootScope, NgMap, toastr, $confirm) {

        var vm = this;
        $scope.showHide = true;
        vm.editFareBox = false;

        $scope.selectedDates = {};
        $scope.selectedDates.startDate = moment().format("YYYY-MM-DD");
        $scope.selectedDates.endDate = moment().format("YYYY-MM-DD");

        $scope.selectedTrip;
        $scope.selectedTripBid;
        vm.bidDr;
        vm.drID;
        vm.drID2;

        vm.renderEditForm = function () {
            vm.reasonArr = [
                {name: "Extra Luggage", value: 0},
                {name: "Extra Passenger", value: 1},
                {name: "No change with the driver", value: 2},
                {name: "Miscommunication between driver and rider", value: 3},
                {name: "Misunderstood the bill", value: 4},
                {name: "Others", value: 5}
            ];
            vm.selectedReason = vm.reasonArr[0];
            vm.fareTypeArr = [
                {name: "+", value: 0},
                {name: "-", value: 1}
            ];
            vm.selectedFareType = vm.fareTypeArr[0];
            vm.inputFare = 0;
            vm.inputReason = '';
            vm.inputTcash = 0;
        };

        vm.renderEditForm();
        vm.closeEditFareModal = function () {
            vm.renderEditForm();
            vm.editFareBox = false;
        };

        vm.openEditFareModal = function () {
            vm.editFareBox = true;
        };

        $scope.confirmEdit = function () {
            $confirm({
                text: 'Are you sure want edit fare?',
                title: 'Are you Sure?',
                ok: 'Yes',
                cancel: 'No'
            })
                .then(function () {
                    vm.editFare();
                });
        };

        vm.editFare = function () {
            var obj = {};
            if (vm.selectedReason.value == 5) {
                vm.selectedReason.name = vm.inputReason;
            }
            if (vm.selectedFareType.value == 0) {
                vm.selectedReasonNew = '';
            } else {
                vm.selectedReasonNew = '-';
            }
            obj.driver = $scope.selectedTrip.driverInfo.id;
            obj.rider = $scope.selectedTrip.riderInfo.id;
            obj.driverChangeFare = parseFloat(vm.selectedReasonNew + vm.inputFare);
            obj.riderCashback = parseInt(vm.inputTcash);
            obj.fareChangeReason = vm.selectedReason.name;
            obj.requestOn = $scope.selectedTrip.requestOn;
            console.log(obj);
            TripsService.updateFare(
                {
                    id: $stateParams.id
                }, obj, function (response) {
                    getDetails();
                    vm.renderEditForm();
                    vm.closeEditFareModal();
                    toastr.success("edited");
                }, function (error) {
                    if (error.status == 500) {
                        toastr.error("Permission Denied");
                    } else {
                        toastr.error(error);
                    }

                })
        };


        $scope.confirmCancelTrip = function () {
            $confirm({
                text: 'Are you sure want cancel?',
                title: 'Are you Sure?',
                ok: 'Yes',
                cancel: 'No'
            })
                .then(function () {
                    vm.cancelTrip();
                });
        };

        vm.cancelTrip = function () {
            TripsService.cancelTrip(
                {
                    id: $stateParams.id
                }, function (response) {
                    toastr.success("Cancelled");
                }, function (error) {
                    if (error.status == 500) {
                        toastr.error("Permission Denied");
                    } else {
                        toastr.error(error);
                    }

                })
        };

        vm.getBid = function () {
            TripsService.getBidDetail(
                {
                    id: $stateParams.id
                }, function (response) {
                    $scope.selectedTripBid = response;
                    vm.bidDr = $scope.selectedTripBid;
                    console.log('selectedTripBid-dr', $scope.selectedTripBid);
                    $scope.totalBid = response;
                    $scope.showHide = false;
                    vm.initialize()
                }, function (err) {
                    console.log(err);
                    $scope.error = true;
                });
        };
        vm.getForTrip = function () {

        };
        vm.clearBid = function () {
            $scope.showHide = true;
            $scope.totalBid = [];
            vm.initialize();
        };

        vm.getDriverDetail = function () {
            var z = vm.drID;
            vm.drID2 = vm.bidDr[z].dr;
            TripsService.getProfile(
                {
                    id: vm.drID2,
                    from: moment($scope.selectedDates.startDate).startOf('day').format("YYYYMMDD").toString(),
                    to: moment($scope.selectedDates.endDate).endOf('day').format("YYYYMMDD").toString()
                }, function (response) {
                    var detail = response;
                    vm.infowindows.setContent(content);
                    console.log('$scope.detail', detail);


                }, function (err) {
                    console.log(err);
                    $scope.error = true;
                }
            );
        };

        function getDetails() {

            TripsService.getTripDetail(
                {
                    id: $stateParams.id
                }, function (response) {
                    $scope.selectedTrip = response;
                    vm.snapCodesFor = $scope.selectedTrip.forTripSnapCode;
                    vm.snapCodesIn = $scope.selectedTrip.inTripSnapCode;
                    //angular.element(document.querySelector('html')).toggleClass('left-arrow');
                    vm.initialize();
                }, function (err) {
                    console.log(err);
                    $scope.error = true;
                });


            vm.initialize = function () {
                var encodedStringFor = vm.snapCodesFor;
                var encodedStringIn = vm.snapCodesIn;

                function replaceAll(search, replacement) {
                    var target = this;
                    return target.split(search).join(replacement);
                }

                var myLatlng = new google.maps.LatLng(22.717081666666665, 75.87155666666666);
                var myOptions = {
                    zoom: 13,
                    center: myLatlng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };


                var map = new google.maps.Map(document.getElementById("driversMap"), myOptions);
                var decodedPathFor = google.maps.geometry.encoding.decodePath(encodedStringFor);
                var decodedPathIn = google.maps.geometry.encoding.decodePath(encodedStringIn);
                //var decodedLevels = decodeLevels("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");

                var setRegion1 = new google.maps.Polyline({
                    path: decodedPathFor,
                    //levels: decodedLevels,
                    strokeColor: "red",
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                    map: map
                });
                var setRegion2 = new google.maps.Polyline({
                    path: decodedPathIn,
                    //levels: decodedLevels,
                    strokeColor: "#8A87FC",
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                    map: map
                });

                var iconForRider = {
                    url: "assets/images/icons/marker-blue.svg", // url
                    scaledSize: new google.maps.Size(30, 30) // scaled size
                };
                var iconForTrip = {
                    url: "assets/images/icons/marker-green.svg", // url
                    scaledSize: new google.maps.Size(30, 30) // scaled size
                };
                var iconForBidGot = {
                    url: "assets/images/icons/marker-green.svg", // url
                    scaledSize: new google.maps.Size(30, 30) // scaled size
                };
                var iconForStart = {
                    url: "assets/images/icons/marker-green.svg", // url
                    scaledSize: new google.maps.Size(40, 40) // scaled size
                };
                var iconForEnd = {
                    url: "assets/images/icons/spacer.gif", // url
                    scaledSize: new google.maps.Size(1, 1) // scaled size
                };
                var iconInStart = {
                    url: "assets/images/icons/pickup.png", // url
                    scaledSize: new google.maps.Size(20, 20) // scaled size
                };
                var iconInEnd = {
                    url: "assets/images/icons/drop.png", // url
                    scaledSize: new google.maps.Size(20, 20) // scaled size
                };
                var iconBidder = {
                    url: "assets/images/icons/marker-orange.svg", // url
                    scaledSize: new google.maps.Size(30, 30) // scaled size
                };


                var markers = [];
                var contents = [];
                var infowindows = [];
                var a = 1000;
                var i = 0;


                //rider Marker start


                if ($scope.selectedTrip.pickUp) {
                    markers[a] = new google.maps.Marker({
                        position: new google.maps.LatLng($scope.selectedTrip.pickUp.lt, $scope.selectedTrip.pickUp.ln),
                        map: map,
                        title: 'Rider Location',
                        icon: iconForRider
                    });

                    if (($scope.selectedTrip.pickUp.sl).length > 0) {
                        contents[a] = '<div class="popup_container">'
                        + '<div class="col-md-12 col-sm-12 col-xs-12"><h4 class="number ng-binding" style="margin: 14px 0 0 0;">' + $scope.selectedTrip.pickUp.sl + '</h4><span>Location</span></div>'
                        + '</div>';
                    } else {
                        contents[a] = '<div class="popup_container">'
                        + '<div class="col-md-12 col-sm-12 col-xs-12"><h4 class="number ng-binding" style="margin: 14px 0 0 0;">' + $scope.selectedTrip.pickUp.line1 + '</h4><span>Location</span></div>'
                        + '</div>';
                    }


                    infowindows[a] = new google.maps.InfoWindow({
                        content: contents[a],
                        maxWidth: 300
                    });

                    google.maps.event.addListener(markers[a], 'click', function () {
                        infowindows[a].open(map, markers[a]);
                        map.panTo(markers[a].getPosition());
                    });
                }

                //rider Marker end


                //bid Marker start


                $scope.bidConstants = {
                    "0": "Reject",
                    "1": "Accept",
                    "-2": "Low_ Battery",
                    "-1": "Offline",
                    "2": "Delivered",
                    "-3": "Unknown",
                    "-4": "Retry Failed"
                };

                for (i = 0; i < ($scope.totalBid || []).length; i++) {


                    if (($scope.selectedTrip.driverInfo || {}).id === $scope.totalBid[i].dr) {
                        markers[i] = new google.maps.Marker({
                            position: new google.maps.LatLng($scope.totalBid[i].lt, $scope.totalBid[i].ln),
                            map: map,
                            title: 'Bid' + [i],
                            icon: iconForBidGot
                        });
                    }
                    else {
                        markers[i] = new google.maps.Marker({
                            position: new google.maps.LatLng($scope.totalBid[i].lt, $scope.totalBid[i].ln),
                            map: map,
                            title: 'Bid' + [i],
                            icon: iconBidder
                        });
                    }


                    markers[i].index = i;

                    contents[i] = '<div class="popup_container">'
                        //+ '<div class="col-md-12 col-sm-12 col-xs-12"><h4 class="number ng-binding">' + $scope.selectedTripBid[i].dr + '</h4><span>Id</span></div>'
                    + '<div class="col-md-12 col-sm-12 col-xs-12"><h4 class="number ng-binding" style="margin: 14px 0 0 0;"><a href="#/home/detail/' + $scope.selectedTripBid[i].dr + '">' + $scope.selectedTripBid[i].name + '</a></h4><span>Name</span></div>'
                    + '<div class="col-md-12 col-sm-12 col-xs-12"><h4 class="number ng-binding" style="margin: 14px 0 0 0;">' + $scope.bidConstants[$scope.selectedTripBid[i].bid] + '</h4><span>Bid</span><br></div>'
                    + '</div>';

                    infowindows[i] = new google.maps.InfoWindow({
                        content: contents[i],
                        maxWidth: 300
                    });

                    google.maps.event.addListener(markers[i], 'click', function () {
                        infowindows[this.index].open(map, markers[this.index]);
                        map.panTo(markers[this.index].getPosition());
                    });


                }
                //bid Marker end

                //check the precision
                decompress(encodedStringFor, 5, function (start, end) {
                    $scope.startLtFor = start.lat;
                    $scope.endtLtFor = end.lat;
                    $scope.starttLnFor = start.lon;
                    $scope.endtLnFor = end.lon;

                    new google.maps.Marker({
                        position: new google.maps.LatLng($scope.startLtFor, $scope.starttLnFor),
                        icon: iconForStart,
                        map: map
                    });

                    new google.maps.Marker({
                        position: new google.maps.LatLng($scope.endtLtFor, $scope.endtLnFor),
                        icon: iconForEnd,
                        map: map
                    });
                });
                decompress(encodedStringIn, 5, function (start, end) {

                    $scope.startLtIn = start.lat;
                    $scope.starttLnIn = start.lon;

                    $scope.endtLtIn = end.lat;
                    $scope.endtLnIn = end.lon;

                    new google.maps.Marker({
                        position: new google.maps.LatLng($scope.startLtIn, $scope.starttLnIn),
                        icon: iconInStart,
                        map: map
                    });

                    new google.maps.Marker({
                        position: new google.maps.LatLng($scope.endtLtIn, $scope.endtLnIn),
                        icon: iconInEnd,
                        map: map
                    });
                });

                function decompress(encoded, precision, cb) {
                    precision = Math.pow(10, -precision);
                    var len = encoded.length, index = 0, lat = 0, lng = 0, arrayLt = [], arrayLn = [];
                    while (index < len) {
                        var b, shift = 0, result = 0;
                        do {
                            b = encoded.charCodeAt(index++) - 63;
                            result |= (b & 0x1f) << shift;
                            shift += 5;
                        } while (b >= 0x20);
                        var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
                        lat += dlat;
                        shift = 0;
                        result = 0;
                        do {
                            b = encoded.charCodeAt(index++) - 63;
                            result |= (b & 0x1f) << shift;
                            shift += 5;
                        } while (b >= 0x20);
                        var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
                        lng += dlng;
                        //var latLongNew = lat * precision + ',' +lng * precision
                        arrayLt.push(lat * precision);
                        arrayLn.push(lng * precision);
                    }
                    //return array;
                    cb({lat: _.first(arrayLt), lon: _.first(arrayLn)}, {lat: _.last(arrayLt), lon: _.last(arrayLn)});


                }
            };

            //function decodeLevels(encodedLevelsString) {
            //    var decodedLevels = [];
            //
            //    for (var i = 0; i < encodedLevelsString.length; ++i) {
            //        var level = encodedLevelsString.charCodeAt(i) - 63;
            //        decodedLevels.push(level);
            //    }
            //    return decodedLevels;
            //}

        }

        getDetails();


    }


})();

