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
  var newNav = {};
  var result;
  var nav = navList.split(",");
  this.navList =  nav.reduce(function(result, item) {
                    result[item] = true; //a, b, c
                    return result;
                  }, {});
 
   /*_.each(nav, function(e){
     this.navList[e] = true;
   });*/

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
