(function() {
  'use strict';

  angular
    .module('tuktukV2Dahboard')
    .controller('AnalyticsController', AnalyticsController);

  /** @ngInject */
  function AnalyticsController($scope, $log, $rootScope, NgTableParams, API, $resource) {
    var vm = this
    $scope.dates = {};
    $scope.dates.startDate = moment().subtract(30, 'days').format("YYYY-MM-DD")
    $scope.dates.endDate = moment().format("YYYY-MM-DD")
    //$scope.dates = { startDate: moment('2013-09-20'), endDate: moment('2013-09-25') };
    vm.timeFrequency = [{label:"Per Hour", value:"hour"},{label:"Per Day", value:"day"}]
    vm.selectedFrequency = vm.timeFrequency[0]

    var RiderAPI = API + "rider"
    var DriverAPI = API + "driver"
    var TripAPI ;

    var startDate, endDate;
    this.changeFrequency = function()
    {

    }
    $scope.$watch('dates', function(newValue, oldValue) {
     // console.log(new, old);
      vm.requestTableParams.page(1)
      vm.requestTableParams.reload();
    })
    vm.requestTableParams = new NgTableParams({}, {
      getData: function(params) {
        // ajax request to api
        startDate = $scope.dates.startDate;
        endDate = $scope.dates.endDate;
        if(vm.selectedFrequency.value=='hour')
        {
          startDate =  moment(startDate).startOf('day').format("YYYYMMDDHH").toString()
          endDate =  moment(endDate).endOf('day').format("YYYYMMDDHH").toString()
          TripAPI = $resource(API + "trip/hour?startDate="+startDate+"&endDate="+endDate+"&city=indore")
        }
        else
        {
          startDate =  moment(startDate).startOf('day').format("YYYYMMDD").toString()
          endDate =  moment(endDate).endOf('day').format("YYYYMMDD").toString()
          TripAPI = $resource(API + "trip/day?startDate="+startDate+"&endDate="+endDate+"&city=indore")
        }
        return TripAPI.query(params.url()).$promise.then(function(data) {
          params.total(data); // recal. page nav controls
          return data;
        });
      }
    });


  }
})();
