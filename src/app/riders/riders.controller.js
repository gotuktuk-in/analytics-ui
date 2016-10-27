(function () {
    'use strict';

    angular
        .module('tuktukV2Dahboard')
        .controller('RidersController', RidersController);

    /** @ngInject */
    function RidersController($scope, $log, $rootScope, StaticDataService, ChartConfigService, RidersService, $resource) {

        var vm = this;
        var current = moment();
        var today = moment();
        vm.date = moment().format("ddd, MMM Do YYYY");
        var year = current.year();
        var month = current.month();
        var date = current.date();
        var hour = current.hour();
        var minute = current.minute();
        var newDate = new Date(year, month, date, hour);

        vm.filterFreq = '';
        vm.riderFiltersOption = [
            {name: 'Monthly', value: "monthly"},
            {name: 'Weekly', value: "weekly"}
        ];
        vm.filterFreq =  vm.riderFiltersOption[0];
        vm.getRiders = function () {
            RidersService.getRiders({
                frequency: vm.filterFreq.value
            }, function (response) {
                vm.rider = response;
                console.log(vm.rider);
                //vm.getriderFrequencyName(vm.rider);
            }, function (err) {
                console.log(err);
                $scope.error = true;
            });
        };
        vm.getRiders();
        //vm.filteredRiders = [
        //    {"key": "frequency", "values": []},
        //    {"key": "timeLine", "values": []},
        //    {"key": "total_request", "values": []},
        //    {"key": "fulfill_request", "values": []}
        //];
        //vm.getriderFrequencyName = function (data) {
        //
        //    vm.frequencyName = [];
        //    vm.timeLineValues = [];
        //    vm.totalRequestValue = [];
        //    vm.fulfillRequestValue = [];
        //
        //    _.each(data, function (value) {
        //        var timeLine = [];
        //        var total_request = [];
        //        var fulfill_request = [];
        //        vm.frequencyName.push(value.frequency);
        //        _.each(value.values, function (value) {
        //            timeLine.push(value.timeLine);
        //            total_request.push(value.total_request);
        //            fulfill_request.push(value.fulfill_request);
        //        });
        //
        //        vm.timeLineValues.push(timeLine);
        //        vm.totalRequestValue.push(total_request);
        //        vm.fulfillRequestValue.push(fulfill_request);
        //    });
        //
        //    vm.filteredRiders[0].values = vm.frequencyName;
        //    vm.filteredRiders[1].values = vm.timeLineValues;
        //    vm.filteredRiders[2].values = vm.totalRequestValue;
        //    vm.filteredRiders[3].values = vm.fulfillRequestValue;
        //
        //    console.log(vm.filteredRiders);
        //    return vm.filteredRiders;
        //};
    }
})();
