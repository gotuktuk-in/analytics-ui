/**
 * Created by dell on 24-05-2016.
 */

'use strict';

/*

 */

angular
    .module('tuktukV2Dahboard')
    .service('setNavByRoleService', setNavByRoleService)

function setNavByRoleService($q, $resource,$window) {
   this.navList = angular.fromJson($window.localStorage['newNavList']) || {};
   this.setNav = function(navList){
    var nav = navList.split(",");
    var newNav = {};
    var value = [];
   /*for(i=0; i<nav.length; i++){
        new

        Nav.push(nav[i] + ":" + true)
    }*/
    for(var i=0; i<nav.length; i++){
        nav[i]
    }

//_.object(_.map(nav, function(x){return [x.name, x.value]}));

    // nav.reduce(function(result, item){
    //     var key = Object.keys(item)[0]; //first property: a, b, c
    //    newNav.push(result[key] = item[key]); 
    //     //return result;
    // }, {})

// vm.data = [];
// _.each($scope.allDrivers, function (group) {
//     var newObj = group.split('/');
//     $scope.id = newObj[0];
//     $scope.hash = getGeoHashObj(newObj[1]);
//     $scope.time = newObj[3];
//     vm.data.push({id: newObj[0], hash: $scope.hash, time: newObj[3]})
// });

    console.log('newNav' , newNav);
    //this.navList = nav;

    this.persist();
   }
   this.getNav = function(){
    return this.navList;
   }
   this.persist = function(){
      window.localStorage['newNavList'] = angular.toJson(this.navList)
    }
   this.clearNav = function(){
    this.navList = "";
    window.localStorage.removeItem("newNavList");
   }
}
