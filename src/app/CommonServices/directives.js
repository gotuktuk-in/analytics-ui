/**
 * Created by dell on 24-05-2016.
 */

'use strict';

/*

 */

angular
    .module('tuktukV2Dahboard')
    .directive('ngPunchCard', PunchCardFunc);

function PunchCardFunc()
{
    return {
        restrict: 'EA', //E = element, A = attribute, C = class, M = comment
        scope: {
            //@ reads the attribute value, = provides two-way binding, & works with functions
            title: '@',
            data:'='
        },
      //  template: '<div></div>',
       //   controller: controllerFunction, //Embed a custom controller in the directive
        link: function ($scope, element, attrs) {
            var options = {};
            options.element = element;
            options.data = [[{key:'Type A', value:'a'},{key:'Type b', value:'b'}],[{key:'RA', value:'ra'},{key:'RB', value:'ra'}]]
           var punchCard = new D3punchcard(options).draw({ width: element.offsetWidth });
        } //DOM manipulation

    }
}