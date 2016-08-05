(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('TripDetailController', TripDetailController);

    /** @ngInject */
    function TripDetailController($scope, $interval, $stateParams, TripsService, $rootScope, NgMap) {

        var vm = this;

        $scope.selectedDates = {};
        $scope.selectedDates.startDate = moment().format("YYYY-MM-DD");
        $scope.selectedDates.endDate = moment().format("YYYY-MM-DD");

        $scope.selectedTrip;
        $scope.selectedTripBid;
        vm.bidDr;
        vm.drID;
        vm.drID2;
        vm.curDrID;
        vm.curDrPh;
        vm.curDrVhNo;
        vm.curDrJD;
        vm.curDrURide;
        vm.curDrTRide;
        vm.curDrToURide;
        vm.curDrToRide;
        vm.curDriDisFT;
        vm.curDriDisIT;
        vm.curDriDisTo;
        vm.curDriOnHrFT;
        vm.curDriOnHrIT;
        vm.curDriOnHrTo;
        vm.curDriFeed;
        vm.curDriTofare;
        vm.curDriEar;
        vm.curDriToEar;

        vm.getBid = function() {
            console.log('sfdsd');
           TripsService.getBidDetail(
                {
                    id: $stateParams.id
                }, function (response) {
                    $scope.selectedTripBid = response;
                    vm.bidDr = $scope.selectedTripBid;
                    //vm.drID = $scope.selectedTripBid[i].dr;
                    console.log('selectedTripBid-dr', $scope.selectedTripBid);
                    $scope.totalBid = response.length;
                    vm.initialize()
                }, function (err) {
                    console.log(err)
                    $scope.error = true;
                });
        }
        //
        //getBid();
        vm.getDriverDetail = function(){
            var z = vm.drID;
            vm.drID2 = vm.bidDr[z].dr;
            TripsService.getProfile(
                {
                    id:  vm.drID2,
                    from: moment($scope.selectedDates.startDate).startOf('day').format("YYYYMMDD").toString(),
                    to: moment($scope.selectedDates.endDate).endOf('day').format("YYYYMMDD").toString()
                }, function (response) {
                    console.log('uu', response);
                    vm.profile = response;
                    vm.curDrID = vm.profile.id ,
                    vm.curDrPh = vm.profile.phone ,
                    vm.curDrVhNo = vm.profile.vehicle ,
                    vm.curDrJD = vm.profile.joinedOn ,
                    vm.curDrURide = vm.profile.rides_today.unique_ride ,
                    vm.curDrTRide = vm.profile.rides_today.total ,
                    vm.curDrToURide = vm.profile.rides_total.unique_ride ,
                    vm.curDrToRide = vm.profile.rides_total.total ,
                    vm.curDriDisFT = vm.profile.today_distance.forTrip ,
                    vm.curDriDisIT = vm.profile.today_distance.intrip ,
                    vm.curDriDisTo = vm.profile.today_distance.total ,
                    vm.curDriOnHrFT = vm.profile.today_online.fortrip_time ,
                    vm.curDriOnHrIT = vm.profile.today_online.intrip_time ,
                    vm.curDriOnHrTo = vm.profile.today_online.total_hours ,
                    vm.curDriFeed = vm.profile.feedbackRating ,
                    vm.curDriTofare = vm.profile.total_fare ,
                    vm.curDriEar = vm.profile.today_earning ,
                    vm.curDriToEar = vm.profile.total_earning ;
                    

                }, function (err) {
                    console.log(err)
                    $scope.error = true;
                }
            );
        }

        

        function getDetails() {

            /*TripsService.getBidDetail(
                {
                    id: $stateParams.id
                }, function (response) {
                    $scope.selectedTripBid = response;
                    $scope.totalBid = response.length;
                }, function (err) {
                    console.log(err)
                    $scope.error = true;
                });*/

            /*TripsService.getProfile(
                console.log('uu', $stateParams.driverId);
                {
                    id: $stateParams.driverId,
                    from: moment($scope.selectedDates.startDate).startOf('day').format("YYYYMMDD").toString(),
                    to: moment($scope.selectedDates.endDate).endOf('day').format("YYYYMMDD").toString()
                }, function (response) {
                    vm.profile = response;
                    vm.initialize()
                }, function (err) {
                    console.log(err)
                    $scope.error = true;
                });*/


            TripsService.getTripDetail(
                {
                    id: $stateParams.id
                }, function (response) {
                    $scope.selectedTrip = response;
                    vm.snapCodesFor = $scope.selectedTrip.forTripSnapCode;
                    vm.snapCodesIn = $scope.selectedTrip.inTripSnapCode;
                    vm.initialize();
                }, function (err) {
                    console.log(err)
                    $scope.error = true;
                });


            vm.initialize = function() {
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
                    strokeColor: "green",
                    strokeOpacity: 1.0,
                    strokeWeight: 3,
                    map: map
                });

                var icon1 = {
                    url: "assets/images/icons/marker-green.svg", // url
                    scaledSize: new google.maps.Size(30, 30) // scaled size
                };
                var icon2 = {
                    url: "assets/images/icons/marker-red.svg", // url
                    scaledSize: new google.maps.Size(30, 30) // scaled size
                };
                var icon3 = {
                    url: "assets/images/icons/marker-orange.svg", // url
                    scaledSize: new google.maps.Size(30, 30) // scaled size
                };


                //bid Marker start

                var markers = [];
                var contents = [];
                var infowindows = [];
                var i = 0;


                for (i = 0; i < $scope.totalBid; i++) {
                    
                    markers[i] = new google.maps.Marker({
                        position: new google.maps.LatLng($scope.selectedTripBid[i].lt, $scope.selectedTripBid[i].ln),
                        map: map,
                        title: 'Bid' + [i],
                        icon: icon3
                    });
                    markers[i].index = i;
                    
                    contents[i] = '<div class="popup_container">' + 
                    '<div class="col-md-6 col-sm-4 col-xs-12"><h4 class="number ng-binding">' + $scope.selectedTripBid[i].lt +  '</h4><span>Lt</span></div>'
                    + '<div class="col-md-6 col-sm-4 col-xs-12"><h4 class="number ng-binding">' + $scope.selectedTripBid[i].ln + '</h4><span>Lng</span></div>'
                    + '<div class="col-md-6 col-sm-4 col-xs-12"><h4 class="number ng-binding">' + vm.curDrID + '</h4><span>Id</span></div>'
                    + '<div class="col-md-6 col-sm-4 col-xs-12"><h4 class="number ng-binding">' + vm.curDrPh + '</h4><span>Id</span></div>'
                    + 
                    '</div>';


                    infowindows[i] = new google.maps.InfoWindow({
                        content: contents[i],
                        maxWidth: 300
                    });

                    google.maps.event.addListener(markers[i], 'click', function () {
                        //console.log(this.index); // this will give correct index
                        //console.log(i); //this will always give 10 for you
                        vm.drID = this.index;
                        console.log(vm.drID);
                        vm.getDriverDetail(vm.drID)

                        infowindows[this.index].open(map, markers[this.index]);
                        map.panTo(markers[this.index].getPosition());
                    });
                }
                //bid Marker end

                //check the precision
                var decompressed1 = decompress(encodedStringFor, 5);
                var decompressed2 = decompress(encodedStringIn, 5);

                function decompress(encoded, precision) {
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
                    $scope.startLtFor = _.first(arrayLt);
                    $scope.endtLtFor = _.last(arrayLt);
                    $scope.starttLnFor = _.first(arrayLn);
                    $scope.endtLnFor = _.last(arrayLn);

                    $scope.startLtIn = _.first(arrayLt);
                    $scope.endtLtIn = _.last(arrayLt);
                    $scope.starttLnIn = _.first(arrayLn);
                    $scope.endtLnIn = _.last(arrayLn);

                    var marker1 = new google.maps.Marker({
                        position: new google.maps.LatLng($scope.startLtFor, $scope.starttLnFor),
                        icon: icon1,
                        map: map
                    });
                    var marker2 = new google.maps.Marker({
                        position: new google.maps.LatLng($scope.endtLtFor, $scope.endtLnFor),
                        icon: icon2,
                        map: map
                    });
                    var marker3 = new google.maps.Marker({
                        position: new google.maps.LatLng($scope.startLtIn, $scope.starttLnIn),
                        icon: icon1,
                        map: map
                    });
                    var marker4 = new google.maps.Marker({
                        position: new google.maps.LatLng($scope.endtLtIn, $scope.endtLnIn),
                        icon: icon2,
                        map: map
                    });
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

    }
})();

