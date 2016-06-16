angular.module('httpInterceptor', [])
    .config(['$provide', '$httpProvider', '$compileProvider', function($provide, $httpProvider, $compileProvider) {
        var elementsList = $();
        var numLoadings = 0;
        var loadingScreen = $('<div class="app-loader"><div class="text-center" style="padding:10%"><img src="assets/images/ring.svg" title="Tuktuk" height="100px"></div></div>').appendTo($('body')).hide();
        var showMessage = function(content, cl, time) {
            $('<div/>')
                .addClass('alert')
                .addClass(cl)
                .hide()
                .fadeIn('fast')
                .delay(time)
                .fadeOut('fast', function() {
                    $(this).remove();
                })
                .appendTo(elementsList)
                .text(content);
        };
        // alternatively, register the interceptor via an anonymous factory
        $httpProvider.interceptors.push(['$q', '$rootScope', '$location', '$cookies', function($q, $rootScope, $location, $cookies) {
            return {
                'request': function(config) {
                    // same as above

                    var hide = (config.url.indexOf('.html')); // is this isn't -1, it means we should hide the request from the loading indicator
                    if(hide == -1)
                    {
                        loadingScreen.show();
                    }
                    if(config.params && config.params.startTime && config.params.endTime)
                    {
                        if(config.params.rate=='hour')
                        {
                            config.params.startTime = moment(config.params.startTime).startOf('day').format("YYYYMMDDHH").toString();
                            config.params.endTime = moment(config.params.endTime).endOf('day').format("YYYYMMDDHH").toString()
                        }
                        else
                        {
                            config.params.startTime = moment(config.params.startTime).startOf('day').format("YYYYMMDD").toString();
                            config.params.endTime = moment(config.params.endTime).endOf('day').format("YYYYMMDD").toString()
                        }


                    }
                    return config || $q.when(config);
                },
                // optional method
                'requestError': function(rejection) {
                    // do something on error
                    loadingScreen.hide();
                    if (canRecover(rejection)) {
                        return responseOrNewPromise
                    }
                    return $q.reject(rejection);
                },
                'response': function(successResponse) {
                    // same as above
                        var hide = (successResponse.config.url.indexOf('.html')); // is this isn't -1, it means we should hide the request from the loading indicator
                        if(hide == -1)
                        {
                            loadingScreen.hide();
                        }
                    return successResponse;
                },
                // optional method
                'responseError': function(errorResponse) {
                    // do something on error
                     loadingScreen.hide();
                    switch (errorResponse.status) {
                        case 401:
                          //  console.log("There is an 401 error. signin again." + $rootScope.LOGIN_URL)
                       $rootScope.$broadcast('unauthorized');
                            break;
                        case 403:
                            //  showMessage('You don\'t have the right to do this', 'alert-danger ', 5000);
                            break;
                        case 500:
                            // showMessage('Server internal error: ' + errorResponse.data.message, 'alert-danger ', 5000);
                            break;
                        default:
                            // showMessage('Error ' + errorResponse.status + ': ' + errorResponse.data.message, 'alert-danger ', 5000);
                    }
                    return $q.reject(errorResponse);

                }
            };
        }]);


        $compileProvider.directive('appMessages', function() {
            var directiveDefinitionObject = {
                link: [function(scope, element, attrs) {
                    elementsList.push($(element));
                }]
            };
            return directiveDefinitionObject;
        });
    }]);
