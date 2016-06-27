(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('LiveController', LiveController);

    /** @ngInject */
    function LiveController($scope, $log, $rootScope, $state, $interval, $stateParams, NgMap, ChartConfigService, LiveService, PerformanceService, PerformanceHandler) {
        var vm = this;
        //range slider , Failed(2), Cancel(2), Success.

        var today = moment()
        var heatmap;
        vm.heatMapFilers = [{label: "In-Process", id: '20,22,30,40,50'}, {label: "Failed", id: '72,80,81,82'}, {
            label: "Cancel",
            id: '70,71'
        }, {label: "Success", id: '61'}]
        vm.selected = vm.heatMapFilers[0]
        $scope.rangSlider = {
            max: 24,
            min: 0,
        };
        $scope.slider = {
            minValue: 0,
            maxValue: 24,
            options: {
                floor: 0,
                ceil: 24,
                //precision:2,
                showTicksValues: 0,
                translate: function (value) {
                    return value + 'h';
                },
                keyboardSupport: false,
                onEnd: function (sliderId, modelValue, highValue, pointerType) {
                    //    console.log(sliderId, modelValue, highValue, pointerType)
                    $scope.rangSlider.min = modelValue;
                    $scope.rangSlider.max = highValue;
                    vm.loadHeatMap()
                }
            }
        };

        $scope.ddSettings = {enableSearch: false};
        //range slider end

        $scope.date = moment().format("dddd, MMMM Do YYYY")
        vm.config = ChartConfigService.lineChartConfig;
        vm.tripChartOptions = angular.copy(ChartConfigService.lineChartOptions);
        vm.newRidersChartOptions = angular.copy(ChartConfigService.multiBarChartOptions);

        vm.tripChartOptions.chart.xAxis.tickFormat = function (d) {
            return d3.time.format('%I %p')(new Date(d).addHours(1));
        };
        vm.trips = [];
        var current = moment()
        vm.live = true
        vm.changeDate = function (to) {

            if (to == 'next') {
                current = moment(current).add(1, 'day')
                $scope.date = moment(current).format("dddd, MMMM Do YYYY")

            }
            else {
                current = moment(current).subtract(1, 'day')
                $scope.date = moment(current).format("dddd, MMMM Do YYYY")

                console.log('$scope.date ', $scope.date)
            }
            if (moment(current).unix() == moment(today).unix()) {
                vm.live = true;
                getOverviewLive()
            }
            else {
                vm.live = false;
                getOverviewBack()
            }
            getLive()
            vm.loadHeatMap()
        }

        function getOverviewLive() {
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

        /*var data1 = [{
            "key": "Stream0",
            "values": [{"x": 0, "y": 0.7853112626333064}, {"x": 1, "y": 0.9373718528670135}, {
                "x": 2,
                "y": 1.0465137342913295
            }, {"x": 3, "y": 1.2473933788694718}, {"x": 4, "y": 1.3807868002702475}, {
                "x": 5,
                "y": 1.4162025722056375
            }, {"x": 6, "y": 1.3468972587484418}, {"x": 7, "y": 1.322996654473014}, {
                "x": 8,
                "y": 1.2253274366718185
            }, {"x": 9, "y": 1.0644716112147234}, {"x": 10, "y": 0.9125317419923415}, {
                "x": 11,
                "y": 0.7073867525982709
            }, {"x": 12, "y": 0.5829688554923741}, {"x": 13, "y": 0.44341021640474904}, {
                "x": 14,
                "y": 0.3216452757053494
            }, {"x": 15, "y": 0.2183128760769953}, {"x": 16, "y": 0.21484697499236766}, {
                "x": 17,
                "y": 0.17159627877155392
            }, {"x": 18, "y": 0.15514091698066473}, {"x": 19, "y": 0.13504858936427505}, {
                "x": 20,
                "y": 0.10596931350945277
            }, {"x": 21, "y": 0.10926354934274281}, {"x": 22, "y": 0.14164615038606015}, {
                "x": 23,
                "y": 0.10109369735940056
            }, {"x": 24, "y": 0.19717178142083172}, {"x": 25, "y": 0.12267162189830616}, {
                "x": 26,
                "y": 0.15524759945983246
            }, {"x": 27, "y": 0.10822353719385004}, {"x": 28, "y": 0.17313228062856734}, {
                "x": 29,
                "y": 0.1655369085244291
            }, {"x": 30, "y": 0.10764596484716014}, {"x": 31, "y": 0.18978201560501073}, {
                "x": 32,
                "y": 0.10624813723918726
            }, {"x": 33, "y": 0.12720395787162378}, {"x": 34, "y": 0.11811978985288767}, {
                "x": 35,
                "y": 0.1320073853581233
            }, {"x": 36, "y": 0.13782122266542518}, {"x": 37, "y": 0.1482564050252289}, {
                "x": 38,
                "y": 0.17250188196247712
            }, {"x": 39, "y": 0.16234273773115526}, {"x": 40, "y": 0.17017444054215092}, {
                "x": 41,
                "y": 0.18748729973127598
            }, {"x": 42, "y": 0.1464865961910823}, {"x": 43, "y": 0.15928727738269793}, {
                "x": 44,
                "y": 0.1430635115383652
            }, {"x": 45, "y": 0.1284856054284564}, {"x": 46, "y": 0.14339728780479988}, {
                "x": 47,
                "y": 0.16438658805646286
            }, {"x": 48, "y": 0.20587119259552542}, {"x": 49, "y": 0.28351596701123827}, {
                "x": 50,
                "y": 0.37227218268338513
            }, {"x": 51, "y": 0.5417093826209344}, {"x": 52, "y": 0.8319770316927717}, {
                "x": 53,
                "y": 1.2055616057343612
            }, {"x": 54, "y": 1.696952539322217}, {"x": 55, "y": 2.1331068025116826}, {
                "x": 56,
                "y": 2.5547283470802813
            }, {"x": 57, "y": 2.8796183474839103}, {"x": 58, "y": 2.9789677131675396}, {
                "x": 59,
                "y": 2.838762762921578
            }, {"x": 60, "y": 2.647439060523296}, {"x": 61, "y": 2.2054334054401905}, {
                "x": 62,
                "y": 1.7535086083252676
            }, {"x": 63, "y": 1.3260982110652815}, {"x": 64, "y": 0.9746730883615321}, {
                "x": 65,
                "y": 0.6779610412708945
            }, {"x": 66, "y": 0.43107441037930083}, {"x": 67, "y": 0.35022552384899913}, {
                "x": 68,
                "y": 0.1980857362959738
            }, {"x": 69, "y": 0.17765081732855995}, {"x": 70, "y": 0.19273857546090972}, {
                "x": 71,
                "y": 0.12257501964583027
            }, {"x": 72, "y": 0.1810925622411355}, {"x": 73, "y": 0.1071575580274419}]
        }, {
            "key": "Stream1",
            "values": [{"x": 0, "y": 0.1202141494840184}, {"x": 1, "y": 0.16655139894794635}, {
                "x": 2,
                "y": 0.1979506334207149
            }, {"x": 3, "y": 0.1556630622806787}, {"x": 4, "y": 0.1262690847262225}, {
                "x": 5,
                "y": 0.14960473897535737
            }, {"x": 6, "y": 0.10043324935203359}, {"x": 7, "y": 0.1428046637106537}, {
                "x": 8,
                "y": 0.1968061977435208
            }, {"x": 9, "y": 0.19728106687369718}, {"x": 10, "y": 0.1525573946332506}, {
                "x": 11,
                "y": 0.11539974156280963
            }, {"x": 12, "y": 0.17879046449801922}, {"x": 13, "y": 0.11265408582456433}, {
                "x": 14,
                "y": 0.18688639277263389
            }, {"x": 15, "y": 0.13803032301973175}, {"x": 16, "y": 0.16397135489294948}, {
                "x": 17,
                "y": 0.16237854909467173
            }, {"x": 18, "y": 0.15907205384243245}, {"x": 19, "y": 0.22228141793799167}, {
                "x": 20,
                "y": 0.2640166998815755
            }, {"x": 21, "y": 0.2699522730659544}, {"x": 22, "y": 0.32272122623530686}, {
                "x": 23,
                "y": 0.5082650953400987
            }, {"x": 24, "y": 0.5901179694624373}, {"x": 25, "y": 0.7748267949592718}, {
                "x": 26,
                "y": 1.0403213114649597
            }, {"x": 27, "y": 1.3335413627209272}, {"x": 28, "y": 1.6967145091749596}, {
                "x": 29,
                "y": 2.0189370882747246
            }, {"x": 30, "y": 2.1374728952084228}, {"x": 31, "y": 2.0120444340823656}, {
                "x": 32,
                "y": 1.7060792759753673
            }, {"x": 33, "y": 1.3014655578496002}, {"x": 34, "y": 0.8982012263878909}, {
                "x": 35,
                "y": 0.7327557647988509
            }, {"x": 36, "y": 0.5265322806925815}, {"x": 37, "y": 0.41683876448881374}, {
                "x": 38,
                "y": 0.3014751675913317
            }, {"x": 39, "y": 0.2919192349805882}, {"x": 40, "y": 0.18098217368086167}, {
                "x": 41,
                "y": 0.21136537986701295
            }, {"x": 42, "y": 0.20194376267745076}, {"x": 43, "y": 0.1948210838122766}, {
                "x": 44,
                "y": 0.13537075372376633
            }, {"x": 45, "y": 0.23128404680700557}, {"x": 46, "y": 0.3339716179798468}, {
                "x": 47,
                "y": 0.4228119293782425
            }, {"x": 48, "y": 0.643874246826108}, {"x": 49, "y": 0.9144339927398215}, {
                "x": 50,
                "y": 1.1060654175482951
            }, {"x": 51, "y": 1.0760766578593413}, {"x": 52, "y": 1.0157826413529447}, {
                "x": 53,
                "y": 0.7709541551765352
            }, {"x": 54, "y": 0.531417076628542}, {"x": 55, "y": 0.30767581612993}, {
                "x": 56,
                "y": 0.200351481102988
            }, {"x": 57, "y": 0.2147937616963328}, {"x": 58, "y": 0.1543390255428124}, {
                "x": 59,
                "y": 0.14169286450691077
            }, {"x": 60, "y": 0.1960567887275464}, {"x": 61, "y": 0.13236333908858627}, {
                "x": 62,
                "y": 0.10402479022398935
            }, {"x": 63, "y": 0.13060678490054828}, {"x": 64, "y": 0.15991392841671936}, {
                "x": 65,
                "y": 0.11749537107737364
            }, {"x": 66, "y": 0.18263919901921533}, {"x": 67, "y": 0.18556326213499258}, {
                "x": 68,
                "y": 0.37894819223880516
            }, {"x": 69, "y": 0.6363894956867774}, {"x": 70, "y": 1.0861321521536729}, {
                "x": 71,
                "y": 1.665777902112065
            }, {"x": 72, "y": 2.2557423710769213}, {"x": 73, "y": 2.728217784696718}]
        }, {
            "key": "Stream2",
            "values": [{"x": 0, "y": 0.1742902184290651}, {"x": 1, "y": 0.12632666861403857}, {
                "x": 2,
                "y": 0.18610320388644971
            }, {"x": 3, "y": 0.15640936435983155}, {"x": 4, "y": 0.12865185853959674}, {
                "x": 5,
                "y": 0.18061633851554487
            }, {"x": 6, "y": 0.10206112499940755}, {"x": 7, "y": 0.13393822904033453}, {
                "x": 8,
                "y": 0.1164526284020549
            }, {"x": 9, "y": 0.11267751927882541}, {"x": 10, "y": 0.1911847151487026}, {
                "x": 11,
                "y": 0.14989942023709282
            }, {"x": 12, "y": 0.1479516761787172}, {"x": 13, "y": 0.17870922312326873}, {
                "x": 14,
                "y": 0.19866575831690042
            }, {"x": 15, "y": 0.18186291902463486}, {"x": 16, "y": 0.19213869368460204}, {
                "x": 17,
                "y": 0.17568207509445788
            }, {"x": 18, "y": 0.16226455922547633}, {"x": 19, "y": 0.1598501899299729}, {
                "x": 20,
                "y": 0.1858104776190452
            }, {"x": 21, "y": 0.12598779339175548}, {"x": 22, "y": 0.19680837460987394}, {
                "x": 23,
                "y": 0.1984284438406536
            }, {"x": 24, "y": 0.11985537487867688}, {"x": 25, "y": 0.13358141142065866}, {
                "x": 26,
                "y": 0.21904664079370822
            }, {"x": 27, "y": 0.21743448010108835}, {"x": 28, "y": 0.3571338334221067}, {
                "x": 29,
                "y": 0.6607991115300282
            }, {"x": 30, "y": 0.8957413505621232}, {"x": 31, "y": 1.0109210246364697}, {
                "x": 32,
                "y": 1.0568460357006053
            }, {"x": 33, "y": 0.8071333943783706}, {"x": 34, "y": 0.5911995360941149}, {
                "x": 35,
                "y": 0.32857508058468654
            }, {"x": 36, "y": 0.2808239337701595}, {"x": 37, "y": 0.19479995003490078}, {
                "x": 38,
                "y": 0.18804455948004178
            }, {"x": 39, "y": 0.15562549195927897}, {"x": 40, "y": 0.15096234937527064}, {
                "x": 41,
                "y": 0.12186657990315139
            }, {"x": 42, "y": 0.1459323054051273}, {"x": 43, "y": 0.18141969649002818}, {
                "x": 44,
                "y": 0.11455814345003845
            }, {"x": 45, "y": 0.16751824190396072}, {"x": 46, "y": 0.15578380036025452}, {
                "x": 47,
                "y": 0.106637694565586
            }, {"x": 48, "y": 0.14795646544642357}, {"x": 49, "y": 0.1287813440887148}, {
                "x": 50,
                "y": 0.1917169871379054
            }, {"x": 51, "y": 0.12440410382550926}, {"x": 52, "y": 0.1974407087258265}, {
                "x": 53,
                "y": 0.768202999037813
            }, {"x": 54, "y": 1.261065917616524}, {"x": 55, "y": 0.2489330836732837}, {
                "x": 56,
                "y": 0.17073972335729123
            }, {"x": 57, "y": 0.17228736406426967}, {"x": 58, "y": 0.11027684804689665}, {
                "x": 59,
                "y": 0.18565673096604163
            }, {"x": 60, "y": 0.19457938499864424}, {"x": 61, "y": 0.22955156292562268}, {
                "x": 62,
                "y": 0.3099432534708913
            }, {"x": 63, "y": 0.565656923365283}, {"x": 64, "y": 1.1942904762275837}, {
                "x": 65,
                "y": 2.207303090869385
            }, {"x": 66, "y": 3.2413719859671803}, {"x": 67, "y": 3.6524534124150643}, {
                "x": 68,
                "y": 3.1660317892535
            }, {"x": 69, "y": 2.240138361755899}, {"x": 70, "y": 1.185913913802866}, {
                "x": 71,
                "y": 0.5914020547887171
            }, {"x": 72, "y": 0.3287486924172601}, {"x": 73, "y": 0.20825797285460632}]
        }]*/
var a = [{"20160624":{"20160618":{"rider":20,"trips":60,"uniqtrips":40},"20160619":{"rider":50,"trips":90,"uniqtrips":50},"20160620":{"rider":20,"trips":50,"uniqtrips":30},"20160621":{"rider":40,"trips":70,"uniqtrips":67},"20160622":{"rider":10,"trips":20,"uniqtrips":17},"20160623":{"rider":30,"trips":40,"uniqtrips":38},"20160624":{"rider":20,"trips":50,"uniqtrips":30},"totalrides":400}},{"20160623":{"20160617":{"rider":70,"trips":100,"uniqtrips":98},"20160618":{"rider":20,"trips":60,"uniqtrips":40},"20160619":{"rider":50,"trips":90,"uniqtrips":50},"20160620":{"rider":20,"trips":50,"uniqtrips":30},"20160621":{"rider":40,"trips":70,"uniqtrips":67},"20160622":{"rider":10,"trips":20,"uniqtrips":17},"20160623":{"rider":30,"trips":40,"uniqtrips":38},"totalrides":500}},{"20160622":{"20160616":{"rider":80,"trips":110,"uniqtrips":98},"20160617":{"rider":70,"trips":100,"uniqtrips":98},"20160618":{"rider":20,"trips":60,"uniqtrips":40},"20160619":{"rider":50,"trips":90,"uniqtrips":50},"20160620":{"rider":20,"trips":50,"uniqtrips":30},"20160621":{"rider":40,"trips":70,"uniqtrips":67},"20160622":{"rider":10,"trips":20,"uniqtrips":17},"totalrides":600}},{"20160621":{"20160615":{"rider":60,"trips":90,"uniqtrips":88},"20160616":{"rider":80,"trips":110,"uniqtrips":98},"20160617":{"rider":70,"trips":100,"uniqtrips":98},"20160618":{"rider":20,"trips":60,"uniqtrips":40},"20160619":{"rider":50,"trips":90,"uniqtrips":50},"20160620":{"rider":20,"trips":50,"uniqtrips":30},"20160621":{"rider":40,"trips":70,"uniqtrips":67},"totalrides":400}},{"20160620":{"20160614":{"rider":90,"trips":190,"uniqtrips":188},"20160615":{"rider":60,"trips":90,"uniqtrips":88},"20160616":{"rider":80,"trips":110,"uniqtrips":98},"20160617":{"rider":70,"trips":100,"uniqtrips":98},"20160618":{"rider":20,"trips":60,"uniqtrips":40},"20160619":{"rider":50,"trips":90,"uniqtrips":50},"20160620":{"rider":20,"trips":50,"uniqtrips":30},"totalrides":300}},{"20160619":{"20160613":{"rider":10,"trips":20,"uniqtrips":18},"20160614":{"rider":90,"trips":190,"uniqtrips":188},"20160615":{"rider":60,"trips":90,"uniqtrips":88},"20160616":{"rider":80,"trips":110,"uniqtrips":98},"20160617":{"rider":70,"trips":100,"uniqtrips":98},"20160618":{"rider":20,"trips":60,"uniqtrips":40},"20160619":{"rider":50,"trips":90,"uniqtrips":50},"totalrides":200}},{"20160618":{"20160612":{"rider":100,"trips":120,"uniqtrips":118},"20160613":{"rider":10,"trips":20,"uniqtrips":18},"20160614":{"rider":90,"trips":190,"uniqtrips":188},"20160615":{"rider":60,"trips":90,"uniqtrips":88},"20160616":{"rider":80,"trips":110,"uniqtrips":98},"20160617":{"rider":70,"trips":100,"uniqtrips":98},"20160618":{"rider":20,"trips":60,"uniqtrips":40},"totalrides":700}}]
        function getNewRiders() {
            LiveService.getNewRiders({
                from: moment(current).subtract(7, 'days').startOf('day').unix(),
                to: moment(current).endOf('day').unix(),
            }, function (response) {
                //  PerformanceHandler.trips = response[0].trip
                vm.newRiders =transformNewRiders(response);
                //vm.newRiders = transformNewRiders(a)
                console.log('response ', vm.newRiders)
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }

        function transformNewRiders(data) {
            var riders = data
            var data = []

            _.each(riders, function (weekday) {
                var obj = {}
                obj.key = PerformanceHandler.getLongDate( weekday.key.toString())//moment(weekday.key*1000).format('DD/MM/YYYY')// PerformanceHandler.getLongDate(Object.keys(weekday)[0])
                obj.values = []
                console.log(weekday)

                    _.each(weekday.value, function (value) {
                        var fullDate = PerformanceHandler.getLongDate( weekday.key.toString())
                        var unixDate = moment(fullDate).startOf('day').unix()
                        console.log(unixDate)
                            obj.values.push({x: unixDate, y: value.trips, y0: value.uniqtrips, y1: value.rider})
                     })

                // var longDate = PerformanceHandler.getLongDate(weekday.date)
                data.push(obj)
            })
          //  console.log(data)
            return data
        }

        getNewRiders()
        function getOverviewBack() {
            LiveService.getOverview({
                city: $rootScope.city,
                vehicle: $rootScope.vehicleType,
                startTime: moment(current).startOf('day'),
                endTime: moment(current).endOf('day'),
            }, function (response) {
                //  PerformanceHandler.trips = response[0].trip
                vm.overview = response;
             }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }

        function getLive() {
            PerformanceService.getTrips({
                city: $rootScope.city,
                startTime: moment(current).startOf('day'),
                endTime: moment(current).endOf('day'),
                count: 1,
                page: 1,
                rate: 'hour'
            }, {vehicle: $rootScope.vehicleType, frequency: 'hour'}, function (response) {
                //  PerformanceHandler.trips = response[0].trip
                vm.trips = PerformanceHandler.getTrips(response[0].trip)

                PerformanceService.getDrivers({
                    city: $rootScope.city,
                    startTime: moment(current).startOf('day'),
                    endTime: moment(current).endOf('day'),
                    count: 1,
                    page: 1,
                    rate: 'hour'
                }, {vehicle: $rootScope.vehicleType, frequency: 'hour'}, function (response) {
                    // PerformanceHandler.drivers = response
                    vm.drivers = PerformanceHandler.getDrivers(response)
                    vm.trips = _.union(vm.trips, vm.drivers)
                    vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'Cancelled trips (by rider)'}));
                    vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'Cancelled trips (by driver)'}));
                    vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'tCash'}));
                    vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'New Drivers'}));
                    vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'Active Drivers'}));
                    vm.trips = _.without(vm.trips, _.findWhere(vm.trips, {key: 'Avg Trip/Driver'}));

                }, function (err) {
                    console.log(err)
                    $scope.error = true;
                });
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });

            var gradient = [
                'rgba(0, 255, 255, 0)',
                'rgba(0, 255, 255, 1)',
                'rgba(0, 191, 255, 1)',
                'rgba(0, 127, 255, 1)',
                'rgba(0, 63, 255, 1)',
                'rgba(0, 0, 255, 1)',
                'rgba(0, 0, 223, 1)',
                'rgba(0, 0, 191, 1)',
                'rgba(0, 0, 159, 1)',
                'rgba(0, 0, 127, 1)',
                'rgba(63, 0, 91, 1)',
                'rgba(127, 0, 63, 1)',
                'rgba(191, 0, 31, 1)',
                'rgba(255, 0, 0, 1)'
            ]
            // google.maps.event.addDomListener(window, 'resize', resizeMap);
            vm.resizeMap = function () {
                google.maps.event.trigger(vm.map, 'resize')
            }
            vm.heatMapDataLength;

            vm.loadHeatMap = function () {

                var from = moment(current).hour($scope.rangSlider.min).unix()
                var to = moment(current).hour($scope.rangSlider.max).unix()
                LiveService.heatmap({
                    city: $rootScope.city,
                    vehicle: $rootScope.vehicleType,
                    from: from,
                    to: to,
                    state: vm.selected.id
                }, function (response) {
                    //  PerformanceHandler.trips = response[0].trip
                    vm.heatMapDataLength = response.length;
                    var transformedData = [];
                    var pointArray = []
                    _.forEach(response, function (item) {
                        transformedData.push(new google.maps.LatLng(item.locPickupRequest.lt - 0, item.locPickupRequest.ln - 0));
                    })
                    //        $scope.heatMapData = transformedData;

                    NgMap.getMap({id: 'live_map'}).then(function (map) {
                        vm.map = map;
                        //   heatmap = vm.map.heatmapLayers.foo;
                        if (heatmap) {
                            heatmap.setMap(null);
                        }
                        pointArray = new google.maps.MVCArray(transformedData);
                        heatmap = new google.maps.visualization.HeatmapLayer({
                            data: pointArray
                        });
                        heatmap.setMap(vm.map);
                    });

                }, function (err) {
                    console.log(err)
                    $scope.error = true;
                });
            }


        }

        getLive()
        getOverviewLive()
        vm.loadHeatMap()
        var interval = $interval(function () {
            vm.refreshPage()
        }, 30000)

        $scope.$on('$destroy', function () {
            $interval.cancel(interval);
        });
        vm.refreshPage = function () {
            getLive()
            vm.loadHeatMap()
            //  vm.loadHeatMap()
            if (vm.live) {
                getOverviewLive()
            }
            else {
                getOverviewBack()
            }

        }


    }
})();
