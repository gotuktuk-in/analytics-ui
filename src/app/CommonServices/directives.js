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
        template: '<div></div>',
        templateUrl: 'mytemplate.html',
        controller: controllerFunction, //Embed a custom controller in the directive
        link: function ($scope, element, attrs) {
            element.append("svg").
                attr("width", fullWidth).
                attr("height", fullHeight);
        } //DOM manipulation

    }
}