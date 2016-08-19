(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('TripDetailController', TripDetailController);

    /** @ngInject */
    function TripDetailController($scope, $interval, $stateParams, TripsService, $rootScope, NgMap, $uibModal) {

        var vm = this;
        $scope.showHide = true;

        $scope.selectedDates = {};
        $scope.selectedDates.startDate = moment().format("YYYY-MM-DD");
        $scope.selectedDates.endDate = moment().format("YYYY-MM-DD");

        $scope.selectedTrip;
        $scope.selectedTripBid;
        vm.bidDr;
        vm.drID;
        vm.drID2;

        /*vm.infowindows = new google.maps.InfoWindow({
         maxWidth: 320
         });*/

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
                    console.log(err)
                    $scope.error = true;
                });
        }
        vm.clearBid = function () {
            $scope.showHide = true;
            $scope.totalBid = [];
            vm.initialize();
        }

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
                    /*var content = '<div class="popup_container bid-driver-detail">' +
                     '<div class="col-md-6 col-sm-4 col-xs-12">' +
                     '<h4 class="number ng-binding">' + detail.id + '</h4>' +
                     '<span>Id</span>' +
                     '</div>' +
                     '<div class="col-md-6 col-sm-4 col-xs-12">' +
                     '<h4 class="number ng-binding">' + detail.phone + '</h4>' +
                     '<span>Phone</span>' +
                     '</div>' +
                     '<div class="col-md-6 col-sm-4 col-xs-12">' +
                     '<h4 class="number ng-binding">' + detail.vehicle + '</h4>' +
                     '<span>Vehicle Number</span>' +
                     '</div>' +
                     '<div class="col-md-6 col-sm-4 col-xs-12">' +
                     '<h4 class="number ng-binding">' + detail.joinedOn + '</h4>' +
                     '<span>Joined date</span>' +
                     '</div>' +
                     '<div class="col-md-6 col-sm-4 col-xs-12">' +
                     '<h4 class="number ng-binding">' + detail.rides_today.total + ' / ' + detail.rides_today.unique_ride + '</h4>' +
                     '<span>Ride / u</span>' +
                     '</div>' +
                     '<div class="col-md-6 col-sm-4 col-xs-12">' +
                     '<h4 class="number ng-binding">' + detail.rides_total.total + ' / ' + detail.rides_total.unique_ride + '</h4>' +
                     '<span>Total rides</span>' +
                     '</div>' +
                     '<div class="col-md-6 col-sm-4 col-xs-12">' +
                     '<h4 class="number ng-binding">' + detail.today_distance.total + '</h4>' +
                     '<span>distance</span>' +
                     '</div>' +
                     '<div class="col-md-6 col-sm-4 col-xs-12">' +
                     '<h4 class="number ng-binding">' + detail.today_online.total_hours + '</h4>' +
                     '<span>online hour</span>' +
                     '</div>' +
                     '<div class="col-md-6 col-sm-4 col-xs-12">' +
                     '<h4 class="number ng-binding">' + detail.feedbackRating + '</h4>' +
                     '<span>FEEDBACK</span>' +
                     '</div>' +
                     '<div class="col-md-6 col-sm-4 col-xs-12">' +
                     '<h4 class="number ng-binding">' + detail.total_fare  + ' / '+ detail.today_fare + '</h4>' +
                     '<span>total fare / fare</span>' +
                     '</div>' +
                     '<div class="col-md-6 col-sm-4 col-xs-12">' +
                     '<h4 class="number ng-binding">' + detail.total_fare  + ' / '+ detail.today_fare + '</h4>' +
                     '<span>total fare / fare</span>' +
                     '</div>' +
                     '<div class="col-md-6 col-sm-4 col-xs-12">' +
                     '<h4 class="number ng-binding">' + detail.total_earning  + ' / '+ detail.today_earning + '</h4>' +
                     '<span>total earning / earning</span>' +
                     '</div>' +
                     '<div class="col-md-6 col-sm-4 col-xs-12">' +
                     '<h4 class="number ng-binding">' + detail.today_bid.total + '</h4>' +
                     '<span>Bid' +
                     '</div>' +
                     '</div>';*/
                    vm.infowindows.setContent(content)
                    console.log('$scope.detail', detail);


                }, function (err) {
                    console.log(err)
                    $scope.error = true;
                }
            );
        }

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
                    console.log(err)
                    $scope.error = true;
                });


            vm.initialize = function () {
                var encodedStringFor = vm.snapCodesFor;
                var encodedStringIn = vm.snapCodesIn;

                function replaceAll(search, replacement) {
                    var target = this;
                    return target.split(search).join(replacement);
                };
                var myLatlng = new google.maps.LatLng(22.717081666666665, 75.87155666666666);
                var myOptions = {
                    zoom: 14,
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
                    strokeOpacity: 1.0,
                    strokeWeight: 3,
                    map: map
                });
                var setRegion2 = new google.maps.Polyline({
                    path: decodedPathIn,
                    //levels: decodedLevels,
                    strokeColor: "#8A87FC",
                    strokeOpacity: 1.0,
                    strokeWeight: 6,
                    map: map
                });


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


                //bid Marker start

                var markers = [];
                var contents = [];
                var infowindows = [];
                var i = 0;

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
                    } else {
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
                    + '<div class="col-md-12 col-sm-12 col-xs-12"><h4 class="number ng-binding" style="margin: 14px 0 0 0;"><a href="#/home/detail/'+$scope.selectedTripBid[i].dr+'">' + $scope.selectedTripBid[i].name + '</a></h4><span>Name</span></div>'
                    + '<div class="col-md-12 col-sm-12 col-xs-12"><h4 class="number ng-binding" style="margin: 14px 0 0 0;">' + $scope.bidConstants[$scope.selectedTripBid[i].bid] + '</h4><span>Bid</span><br></div>'
                    + '</div>';

                    infowindows[i] = new google.maps.InfoWindow({
                        content: contents[i],
                        maxWidth: 300
                    });

                    google.maps.event.addListener(markers[i], 'click', function () {
                        //console.log(this.index); // this will give correct index
                        //console.log(i); //this will always give 10 for you
                        //vm.drID = this.index;
                        //console.log(vm.drID);
                        //vm.getDriverDetail(vm.drID)     

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
            }

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

        $scope.openEditFareModal = function(){
            var modalInstance = $uibModal.open({
                animation : $scope.animationEnabled,
                templateUrl : 'editFareModal.html',
                controller : 'EditFareController',
                windowClass : 'edit-fare-modal',
                keyboard : false,
                backdrop : 'static',
                resolve : {
                   DriverFare : function(){
                    return $scope.selectedTrip.driverFare;
                   },
                   RiderFare : function(){
                    return $scope.selectedTrip.riderFare;
                   }
                }
                
            })
        }
    }
    angular
        .module('tuktukV2Dahboard')
        .controller('EditFareController', EditFareController);
     function EditFareController($scope, $uibModalInstance, DriverFare, RiderFare) {
        $scope.drFare = DriverFare;
        $scope.rdFare = RiderFare;
        $scope.ok = function () {
            $uibModalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
     }

})();

