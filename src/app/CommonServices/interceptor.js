angular.module('httpInterceptor', [])
    .config(['$provide', '$httpProvider', '$compileProvider', function($provide, $httpProvider, $compileProvider) {
        var elementsList = $();
        var numLoadings = 0;
        var loadingScreen = $('<div style="position:fixed;top:50px;left:0;z-index:200000000;background-color:#fff;width:100%; height:100%"><div class="text-center" style="padding:10%"><img src="assets/images/ring.svg" title="Tuktuk" height="100px"></div></div>').appendTo($('body')).hide();
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
        $httpProvider.interceptors.push(['$q', '$rootScope', '$location', function($q, $rootScope, $location) {
            return {
                'request': function(config) {
                    // same as above
                    loadingScreen.show();
                    if(config.params && config.params.startDate && config.params.endDate)
                    {
                        config.params.startDate = moment(config.params.startDate).startOf('day').format("YYYYMMDDHH").toString();
                        config.params.endDate = moment(config.params.endDate).endOf('day').format("YYYYMMDDHH").toString()
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
                     loadingScreen.hide();

                    if (successResponse.config.method.toUpperCase() != 'GET') {
                        $rootScope.isPageLoading = false;
                        //console.log("----- "+successResponse.data.responseHeader.message)
                        // showMessage(successResponse.data.responseHeader.message, 'alert-success', 5000);
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
                           // console.log("LOGOUT_URL " + $rootScope.LOGOUT_URL)
                            document.location = "#/login" //$rootScope.LOGIN_URL;
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
