(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('DriversDetailController', DriversDetailController);

    /** @ngInject */
    function DriversDetailController($scope, $stateParams, $rootScope, $interval,StaticDataService, DriversService, NgTableParams, ngTableEventsChannel, LiveService, $resource) {

        var vm = this
        var current = moment()
        vm.ranges = StaticDataService.ranges
        $scope.selectedDates = {};
        $scope.selectedDates.startDate = moment().format("YYYY-MM-DD");
        $scope.selectedDates.endDate = moment().format("YYYY-MM-DD");
        vm.getProfile = function () {
            DriversService.getProfile({id:$stateParams.driverId,
                from: moment( $scope.selectedDates.startDate).startOf('day').format("YYYYMMDD").toString(),
                to: moment( $scope.selectedDates.endDate).endOf('day').format("YYYYMMDD").toString(),
            }, function (response) {
                vm.profile = response;
            }, function (err) {
                console.log(err)
                $scope.error = true;
            });
        }

        vm.getProfile()
        vm.getAllData = function () {
            vm.getProfile();
          //  $scope.tableParams.page(1);
            $scope.tableParams.reload()
        }
        var interval= $interval(function(){
            vm.getAllData()
        }, 30000)
        $scope.$on('$destroy', function () { $interval.cancel(interval); });
        $scope.getTimeDiff = function (dt1, dt2) {
            var now = new Date(dt1 * 1000);
            var then = new Date(dt2 * 1000);
            var diff = moment.utc(moment(now, "DD/MM/YYYY HH:mm:ss").diff(moment(then, "DD/MM/YYYY HH:mm:ss")));//.format("HH:mm:ss")
            var timeInStr = ""
            if (diff.hours() > 0) {
                timeInStr = diff.hours() + " hr "
            }
            timeInStr += diff.minute() + " min "
            return timeInStr;
        }
        $scope.tableParams = new NgTableParams({page:1,count: 20, sorting:{earning:'desc'},
        }, {
            counts: [],
            getData: function (params) {
                // ajax request to api
                var  start = ((params.page() - 1) * 10) + 1;
                console.log("**************************")
                var orderBy= ''
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

                return DriversService.getTrips(
                    {
                       // city: $rootScope.city,
                      //  vehicle: $rootScope.vehicleType,
                        startDate: moment(  $scope.selectedDates.startDate).startOf('day').unix(),
                        endDate: moment(  $scope.selectedDates.endDate).endOf('day').unix(),
                        orderby:orderBy,
                        field:field,
                        start:start,
                        count:params.count()

                    },
                    {id:$stateParams.driverId
                    }
                ).$promise.then(function (data) {

                        params.total(data.total); // recal. page nav controls

                        console.log('trop ',data)
                        if(data.data.length > 0){
                            $scope.tblNoData = false
                        }
                        else{
                            $scope.tblNoData = true
                        }
                        return data.data;
                    });
            }
        });
    }

    // Heatmap graph

})();
InitChart();

function InitChart() {

    var lineData = [{
        'x': 1,
        'y': 5
    }, {
        'x': 20,
        'y': 20
    }, {
        'x': 40,
        'y': 10
    }, {
        'x': 60,
        'y': 40
    }, {
        'x': 80,
        'y': 5
    }, {
        'x': 100,
        'y': 60
    }];

    var vis = d3.select("#visualisation"),
        WIDTH = 1000,
        HEIGHT = 500,
        MARGINS = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 50
        },
        xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(lineData, function (d) {
            return d.x;
        }),
            d3.max(lineData, function (d) {
                return d.x;
            })
        ]),

        yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(lineData, function (d) {
            return d.y;
        }),
            d3.max(lineData, function (d) {
                return d.y;
            })
        ]),

        xAxis = d3.svg.axis()
            .scale(xRange)
            .tickSize(5)
            .tickSubdivide(true),

        yAxis = d3.svg.axis()
            .scale(yRange)
            .tickSize(5)
            .orient("left")
            .tickSubdivide(true);


    vis.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
        .call(xAxis);

    vis.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (MARGINS.left) + ",0)")
        .call(yAxis);

    var lineFunc = d3.svg.line()
        .x(function (d) {
            return xRange(d.x);
        })
        .y(function (d) {
            return yRange(d.y);
        })
        .interpolate('linear');

    vis.append("svg:path")
        .attr("d", lineFunc(lineData))
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");

}