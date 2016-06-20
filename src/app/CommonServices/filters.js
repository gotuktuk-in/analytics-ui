/**
 * Created by lenovo on 2/11/2016.
 */
'use strict';

/**
 Filter to convert seconds to Time duration
 */

angular
  .module('tuktukV2Dahboard')
  .filter('secondsToDateTime', [function() {
  return function(seconds) {
  //  return new Date(1970, 0, 1).setSeconds(seconds);
   var  mydate =new Date(seconds*1000);
    var string = "";
    var hours = mydate.getUTCHours()

    var min = mydate.getUTCMinutes()
    var sec = mydate.getUTCSeconds()
    if(hours ) {string+= hours +":" }
      if(min ) {string+= min +":" }
        if(sec ) {string+=sec +"" }

    return string;
  };
}])
