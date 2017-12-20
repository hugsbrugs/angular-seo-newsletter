'use strict';

/**
 * 
 */
angular.module('hugsbrugs.angular-seo-newsletter-directives', [])
    
    /**
     * http://benclinkinbeard.com/posts/creating-configurable-angular-directives-with-providers/
     */
    .provider('hugsbrugsSeoNewsletterConfig', [
        function () 
        {

            var _config = {
                y_offset:50,
                image:'/img/SEO-Beginners-Guide.jpg',
                header_text:'DEFAULT_HEADER_TEXT',
                call_action_text:'DEFAULT_CALL_ACTION_TEXT',
                sub_text:'DEFAULT_SUB_TEXT',
                email_placeholder:'DEFAULT_EMAIL_PLACEHOLDER',
                success_text:'DEFAULT_SUCCESS_TEXT',
                error_text:'DEFAULT_ERROR_TEXT',

                // download hugbrugs/php-seo-newsletter
                //api_endpoint:'/php/register_newsletter.php',
                // fake endpoint
                api_endpoint:'/fake_endpoint',

                cookie_expire:'1 day'
            };

            this.config = function (config)
            {
                angular.forEach(config, function(value, key)
                {
                    _config[key] = value;
                });
            };

            this.$get = function ()
            {
                return _config;
            };
        }
    ])

    /**
     * 
     */
    .directive('hugsbrugsSeoNewsletter', ['$interval', '$timeout', '$log', '$http', '$cookies', '$filter',
        function($interval, $timeout, $log, $http, $cookies, $filter) {
        return {
            restrict: 'E',
            controllerAs: 'ctrl',
            scope: {
                model:'=ngModel',
                //show_modal_ext:'='
                showmodalext:'='
            },
            // Use compiled directive
            //templateUrl:'templates/pop-up-newsletter.html',
            // Use regular template file
            // and cache it at build time (gulp)
            templateUrl: '/js/templates/pop-up-newsletter.html',
            controller: ['$scope', '$element', '$translate', '$log', '$http', '$cookies', 'hugsbrugsSeoNewsletterConfig', '$sce',
                function($scope, $element, $translate, $log, $http, $cookies, hugsbrugsSeoNewsletterConfig, $sce)
                {
                    var config = hugsbrugsSeoNewsletterConfig;

                    var ctrl = this;
                    console.log($scope.model);

                    // set variables from model or config
                    ctrl.y_offset = $scope.model.y_offset || config.y_offset;
                    ctrl.header_text = $scope.model.header_text || config.header_text;
                    ctrl.call_action_text = $scope.model.call_action_text || config.call_action_text;
                    ctrl.sub_text = $scope.model.sub_text || config.sub_text;
                    ctrl.email_placeholder = $scope.model.email_placeholder || config.email_placeholder;
                    ctrl.image = $scope.model.image || config.image;                    
                    ctrl.success_text = $scope.model.success_text || config.success_text;
                    ctrl.error_text = $scope.model.error_text || config.error_text;
                    ctrl.api_endpoint = $scope.model.api_endpoint || config.api_endpoint;
                    ctrl.cookie_expire = $scope.model.cookie_expire || config.cookie_expire;

                    // call remote API for saving subscriber to newsletter
                    ctrl.register_newsletter = function()
                    {
                        // reset error message
                        ctrl.hide_error();

                        // Send to Remote API
                        $http.post(ctrl.api_endpoint, {email:$scope.email})
                            .then( function(data)
                            {
                                // hide form
                                ctrl.hide_form();
                                // display success message
                                ctrl.show_success();
                                // save cookie to not ask again
                                $cookies.put('is_subscriber', 'true', {'expires': $scope.get_cookie_expire_date('10 month')});
                                // close modal
                                $scope.hide_modal(2000);
                            })
                            .catch(function(error)
                            {
                                // $log.log('error', error);
                                ctrl.show_error(error.data.message);
                            });
                    };

                    ctrl.hide_error = function()
                    {
                        var elm = angular.element(window.document.getElementById('seo-newsletter-error'));
                        elm.css('display', 'none');
                        ctrl.error_text = $scope.model.error_text || config.error_text;
                    };

                    ctrl.show_error = function(text)
                    {
                        if(text.length > 0)
                            ctrl.error_text = text;

                        var elm = angular.element(window.document.getElementById('seo-newsletter-error'));
                        elm.css('display', 'block');
                    };

                    ctrl.show_success = function()
                    {
                        var elm = angular.element(window.document.getElementById('seo-newsletter-success'));
                        elm.css('display', 'block');
                    };

                    ctrl.hide_form = function()
                    {
                        var elm = angular.element(window.document.getElementById('seo-newsletter-questions'));
                        elm.css('display', 'none');
                    };

                }
            ],
            link: function (scope, element, attrs)
            {
                // save in cookie to not bother user each time
                var show_popup = $cookies.get('show_popup') || 'true';
                var is_subscriber = $cookies.get('is_subscriber') || 'false';
                $log.log('show_popup', show_popup);
                $log.log('is_subscriber', is_subscriber);
                $log.log('coucou');
                $log.log('showmodalext', scope.show_modal_ext);

                if(is_subscriber==='false')
                {
                    if(show_popup==='true')
                    {
                        // listen to mouse position to trigger modal
                        // http://stackoverflow.com/questions/12202118/show-mouse-x-and-y-position-with-javascript
                        
                        var IE = document.all ? true : false;
                        document.captureEvents(Event.MOUSEMOVE);
                        document.onmousemove = getMouseXY;
                        var tempX = 0;
                        var tempY = 0;

                        function getMouseXY(e)
                        {
                            if (IE)
                            { 
                                tempX = event.clientX + document.body.scrollLeft
                                tempY = event.clientY + document.body.scrollTop
                            } 
                            else 
                            {  
                                tempX = e.pageX
                                tempY = e.pageY
                            }  

                            //console.log(tempX, tempY);
                            if(tempY<scope.ctrl.y_offset)
                            {
                                if(show_popup==='true')
                                {
                                    scope.show_modal();
                                }
                            }

                            return true
                        }

                        var modal = angular.element(window.document.getElementById('newsletter-modal'));
                        var stop_interval = null;
                        
                        scope.show_modal = function()
                        {
                            $interval.cancel(stop_interval);
                            modal.css('display', 'block');
                        }

                        // Call from outside directive
                        // http://stackoverflow.com/questions/16881478/how-to-call-a-method-defined-in-an-angularjs-directive
                        
                        scope.show_modal_ext = scope.show_modal_ext || {};
                        scope.show_modal_ext.trigger_modal = function()
                        {
                            console.log('scope.show_modal_ext.trigger_modal');
                            scope.show_modal();
                        }

                        scope.hide_modal = function(timeout)
                        {
                            timeout = timeout || 0;
                            
                            $cookies.put('show_popup', 'false', {
                                'expires': scope.get_cookie_expire_date(scope.ctrl.cookie_expire)
                            });
                            show_popup = 'false';

                            // unwatch all objects if cookie expire > 1 day
                            // document.onmousemove = null;
                            // element.unbind('click');
                            // elm.unbind('mouseenter');
                            // elm.unbind('mouseleave');
                            // or watch for cookie validaty
                            stop_interval = $interval(function()
                            {
                                show_popup = $cookies.get('show_popup') || 'true';
                                $log.log('interval', show_popup);
                                var is_subscriber = $cookies.get('is_subscriber');
                                if(is_subscriber==='true')
                                    $interval.cancel(stop_interval);
                            }, 1000);

                            $timeout(function()
                            {
                                modal.css('display', 'none');
                            }, timeout);
                        }

                        

                        // do not close when mouse over modal
                        var cancel_click = false;
                        var elm = angular.element(window.document.getElementById('newsletter-modal-sub'));
                        // close modal when click on backdrop
                        element.bind('click', function (event)
                        {
                            if(!cancel_click)
                            {
                                scope.hide_modal();
                            }
                        });
                        // set / unset cancel_click
                        elm.bind('mouseenter', function (event)
                        {
                            cancel_click = true;
                        });
                        elm.bind('mouseleave', function (event)
                        {
                            cancel_click = false;
                        });

                        // convert shortcode in real js date
                        scope.get_cookie_expire_date = function(shortcode)
                        {
                            var expiration_date = null;

                            var infos = shortcode.split(' ');
                            var qty = parseInt(infos[0]);
                            var period = infos[1];
                            var allowed_periods = ['second', 'minute', 'hour', 'day','month'];
                            //$log.log('get_cookie_expire_date', qty, period);

                            if(allowed_periods.indexOf(period)>-1)
                            {
                                switch(period)
                                {
                                    case 'second':
                                        expiration_date = new Date();
                                        expiration_date.setTime(expiration_date.getTime() + (qty*1000));
                                        break;
                                    case 'minute':
                                        expiration_date = new Date();
                                        expiration_date.setTime(expiration_date.getTime() + (qty*60*1000));
                                        break;
                                    case 'hour':
                                        expiration_date = new Date();
                                        expiration_date.setTime(expiration_date.getTime() + (qty*60*60*1000));
                                        break;
                                    case 'day':
                                        expiration_date = new Date();
                                        expiration_date.setTime(expiration_date.getTime() + (qty*24*60*60*1000));
                                        break;
                                    case 'month':
                                        expiration_date = new Date();
                                        expiration_date.setTime(expiration_date.getTime() + (qty*30*24*60*60*1000));
                                        break;
                                    default:
                                        break;
                                }
                            }
                            else
                            {
                                // invalid period set default (tomorrow's date)
                                //$log.log('invalid period ('+period+') set default')
                                expiration_date = new Date();
                                expiration_date.setDate(expiration_date.getDate() + 1);
                            }
                            //$log.log('expiration_date : ', expiration_date);
                            return expiration_date;
                        };
                    }
                }
            }
        }
    }])
