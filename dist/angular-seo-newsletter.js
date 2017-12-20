'use strict';

/**
 *
 */
angular.module('hugsbrugs.angular-seo-newsletter-configs', [])

	.config(['$translateProvider', 
		function($translateProvider)
		{

			$translateProvider.translations('en', {
		        // Server side translation keys
		        "ERROR_SAVING_SUBSCRIPTION" : "Error while saving your mail.",
		        "EMAIL_ALREADY_SUBSCRIBER" : "Your email is already saved !",
		        "EMAIL_JUNK" : "You email is not trustable : please provide another one.",
		        "EMAIL_INVALID" : "Your email is onvalid, please double check it !",
		        "EMAIL_EMPTY" : "Your email is empty.",
		        "EMAIL_NOT_SET" : "Your email is missing.",
		        "INTERNAL_SERVER_ERROR" : "An internal error occured, please try again later.",
		        // Client side translation keys
		        "DEFAULT_HEADER_TEXT" : "I'm a title",
		        "DEFAULT_CALL_ACTION_TEXT" : "I'm a call to action",
		        "DEFAULT_SUB_TEXT" : "I'm a sub text",
		        "DEFAULT_EMAIL_PLACEHOLDER" : "I want your mail",
		        "DEFAULT_SUCCESS_TEXT" : "Thank you sweety",
		        "DEFAULT_ERROR_TEXT" : "Unknown error, if you have moment please report this error through our <a ng-href='https://hugo.maugey.fr/fr/contact'>contact form</a>. Sorry for that."
		 	});

			$translateProvider.translations('fr', {
		        // Server side translation keys
		        "ERROR_SAVING_SUBSCRIPTION" : "Erreur lors de l'enregistrement de votre email",
		        "EMAIL_ALREADY_SUBSCRIBER" : "Votre email est déjà enregitré !",
		        "EMAIL_JUNK" : "Votre email n'est pas digne de confiance, veuillez renseigner une autre adresse mail.",
		        "EMAIL_INVALID" : "Votre email est invalide, veuillez vérifier que vous n'avez pas fait d'erreur.",
		        "EMAIL_EMPTY" : "Votre email est vide !",
		        "EMAIL_NOT_SET" : "Impossible de récupérer votre adresse mail !",
		        "INTERNAL_SERVER_ERROR" : "Une erreur interne est survenue, mercei de réessayer ultérieument.",
		        // Client side translation keys
		        "DEFAULT_HEADER_TEXT" : "Je suis un titre",
		        "DEFAULT_CALL_ACTION_TEXT" : "Je suis un call to action",
		        "DEFAULT_SUB_TEXT" : "Je suis un sous titre",
		        "DEFAULT_EMAIL_PLACEHOLDER" : "Votre email",
		        "DEFAULT_SUCCESS_TEXT" : "Merci bien, à très bientôt !",
		        "DEFAULT_ERROR_TEXT" : "Erreur inconnue, si vous avez un moment, merci de nous prévenir à travers le <a ng-href='https://hugo.maugey.fr/fr/contact'>formulaire de contact</a>.<br> Désolé pour le désagrément."
		 	});

		}
	]);

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
            bindToController: {
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

                    // set variables from model or config
                    ctrl.y_offset = ctrl.model.y_offset || config.y_offset;
                    ctrl.header_text = ctrl.model.header_text || config.header_text;
                    ctrl.call_action_text = ctrl.model.call_action_text || config.call_action_text;
                    ctrl.sub_text = ctrl.model.sub_text || config.sub_text;
                    ctrl.email_placeholder = ctrl.model.email_placeholder || config.email_placeholder;
                    ctrl.image = ctrl.model.image || config.image;                    
                    ctrl.success_text = ctrl.model.success_text || config.success_text;
                    ctrl.error_text = ctrl.model.error_text || config.error_text;
                    ctrl.api_endpoint = ctrl.model.api_endpoint || config.api_endpoint;
                    ctrl.cookie_expire = ctrl.model.cookie_expire || config.cookie_expire;

                    // call remote API for saving subscriber to newsletter
                    ctrl.register_newsletter = function()
                    {
                        // reset error message
                        ctrl.hide_error();

                        // Send to Remote API
                        $http.post(ctrl.api_endpoint, {email:$scope.email})
                            .success( function(data)
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
                            .error(function(error)
                            {
                                $log.log('error', error);
                                ctrl.show_error(error.message);
                            });
                    };

                    ctrl.hide_error = function()
                    {
                        var elm = angular.element(window.document.getElementById('seo-newsletter-error'));
                        elm.css('display', 'none');
                        ctrl.error_text = ctrl.model.error_text || config.error_text;
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

/*
    .run(['$templateCache', 
        function ($templateCache)
        {
            if ($templateCache.get('templates/pop-up-newsletter.html') === undefined)
            {
                $templateCache.put("templates/pop-up-newsletter.html",
'<div ' +
    'style="display: none;"' +
    'class="newsletter-modal underlay"' +
    'id="newsletter-modal">' +
    '<div ' +
        'class="newsletter-modal-flex newsletter-modal-flex-activated"' +
        'id="newsletter-modal-flex">' +
        '<div ' +
            'class="newsletter-modal-sub"' +
            'id="newsletter-modal-sub">' +
            '<!-- Modal Header -->' +
            '<div class="modal-title">' +
                '<h3 ng-bind-html="ctrl.header_text | translate"></h3>' +
            '</div>' +
            '<!-- Modal Body -->' +
            '<div class="modal-body">' +
                '<!-- Rounded Image -->' +
                '<p><img class="image" ng-src="{{ctrl.image}}"></p>' +
                '<!-- Call to Action -->' +
                '<p class="headline" ng-bind-html="ctrl.call_action_text | translate"></p>' +
                '<!-- Paragraph -->' +
                '<p class="subheadline" ng-bind-html="ctrl.sub_text | translate"></p>' +
                '<div>' +
                    '<form ' +
                        'name="Newsletter"' +
                        'ng-submit="ctrl.register_newsletter()" ' +
                        'novalidate>' +
                        '<!-- Responses -->' +
                        '<div>' +
                            '<div ' +
                                'style="display:none"' +
                                'id="seo-newsletter-error"' +
                                'class="response"' +
                                'ng-bind-html="ctrl.error_text | translate">' +
                                'ERROR' +
                            '</div>' +
                            '<div ' +
                                'style="display:none"' +
                                'id="seo-newsletter-success"' +
                                'class="response"' +
                                'ng-bind-html="ctrl.success_text | translate">' +
                                'SUCCESS' +
                            '</div>' +
                        '</div>' +
                        '<!--  -->' +
                        '<div ' +
                            'class="mc-field-group updated"' +
                            'id="seo-newsletter-questions">' +
                            '<input ' +
                                'type="email"' +
                                'name="email"' +
                                'ng-model="email"' +
                                'placeholder="{{ctrl.email_placeholder | translate}}">' +
                            '<input ' +
                                'type="submit"' +
                                'class="button"' +
                                'id="mc-embedded-subscribe"' +
                                'name="subscribe"' +
                                'ng-disabled="Newsletter.$invalid">' +
                        '</div>' +
                    '</form>' +
                '</div>' +
            '</div>' +
        '</div>' +
     '</div>' +
'</div>'
                );
            }
        }
    ]);
*/
'use strict';

/**
 * Defines an empty module because i like to work on real .html file templates with syntax coloration etc etc
 * Gulp with extend this module with templates cache
 */
angular.module("hugsbrugs.angular-seo-newsletter-templates", [])

	.run(["$templateCache", function($templateCache)
	{
		//$templateCache.put("/js/templates/pop-up-newsletter.html","<div>...</div>");
	}]);
'use strict';

// Define module 'angular-seo-newsletter'
angular.module('hugsbrugs.angular-seo-newsletter', [
    'hugsbrugs.angular-seo-newsletter-configs',
    'hugsbrugs.angular-seo-newsletter-directives',
    'hugsbrugs.angular-seo-newsletter-templates'
]);

angular.module("hugsbrugs.angular-seo-newsletter-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("/js/templates/pop-up-newsletter-2.html","<div id=\"at-cv-lightbox\" class=\"at-cv-lightbox at-cv-goal-email at-center-layout-0 at-cv-with-image at-center-animateIn\"><div id=\"at-cv-lightbox-inner\"><div class=\"at4win\" style=\"position: relative\" id=\"at-cv-lightbox-win\"><div id=\"image-darkener\"></div><div class=\"at4win-header\" id=\"at-cv-lightbox-header\"><a class=\"at4-close\" href=\"#\" title=\"Close\" id=\"at-cv-lightbox-close\">×</a></div><div id=\"at-cv-lightbox-content\" class=\"at4win-content\"><div class=\"at-cv-lightbox-layout-content\"><div id=\"at-cv-lightbox-message-holder\"><div id=\"at-cv-lightbox-message\"><span style=\"font-size: 28.35px\"><span style=\"font-style: italic; font-size: 28.35px\"><span style=\"font-size: 28.35px; font-style: italic\"><span style=\"font-style: italic; font-size: 28.35px\"><span style=\"font-size: 28.35px; font-style: italic\">Subscribe to TutorialSavvy</span></span></span></span></span></div></div><div class=\"at-cv-goal-container\"><span><form id=\"at-cvlbx-form\" name=\"Newsletter\" ng-submit=\"register_newsletter()\" novalidate><input type=\"email\" name=\"email\" id=\"at-cv-lightbox-input\" class=\"at-cv-input\" autocapitalize=\"off\" autocorrect=\"off\" required=\"required\" placeholder=\"Your email\" ng-model=\"email\"> <button id=\"at-cv-lightbox-submit\" type=\"submit\" class=\"at-cv-button at-cv-submit\" style=\"background: rgb(102, 102, 102) none repeat scroll 0% 0%\">Submit</button></form><p class=\"at-email-disclosure\" style=\"display: none\">By clicking the button above, you agree to the information above being sent to AddThis US servers. <a target=\"_blank\" href=\"//www.addthis.com//privacy/privacy-policy#international\">Learn more.</a></p></span></div></div></div><div class=\"at-cv-footer\"><a class=\"at-branding-logo\" href=\"//www.addthis.com/website-tools/overview?utm_source=AddThis%20Tools&amp;utm_medium=image&amp;utm_campaign=Marketing%20tool%20logo\" title=\"Powered by AddThis\" target=\"_blank\"><div class=\"at-branding-icon\"></div><span class=\"at-branding-addthis\">AddThis</span></a></div></div></div><div class=\"at-cv-lightbox-background\" style=\"background: rgb(102, 102, 102) none repeat scroll 0% 0%; opacity: 0.8\"></div></div>");
$templateCache.put("/js/templates/pop-up-newsletter.html","<div style=\"display: none\" class=\"newsletter-modal underlay\" id=\"newsletter-modal\"><div class=\"newsletter-modal-flex newsletter-modal-flex-activated\" id=\"newsletter-modal-flex\"><div class=\"newsletter-modal-sub\" id=\"newsletter-modal-sub\"><div class=\"modal-title\"><h3 ng-bind-html=\"ctrl.header_text | translate\"></h3></div><div class=\"modal-body\"><p><img class=\"image\" ng-src=\"{{ctrl.image}}\"></p><p class=\"headline\" ng-bind-html=\"ctrl.call_action_text | translate\"></p><p class=\"subheadline\" ng-bind-html=\"ctrl.sub_text | translate\"></p><div><form name=\"Newsletter\" ng-submit=\"ctrl.register_newsletter()\" novalidate><div><div style=\"display:none\" id=\"seo-newsletter-error\" class=\"response\" ng-bind-html=\"ctrl.error_text | translate\">ERROR</div><div style=\"display:none\" id=\"seo-newsletter-success\" class=\"response\" ng-bind-html=\"ctrl.success_text | translate\">SUCCESS</div></div><div class=\"mc-field-group updated\" id=\"seo-newsletter-questions\"><input type=\"email\" name=\"email\" ng-model=\"email\" placeholder=\"{{ctrl.email_placeholder | translate}}\"> <input type=\"submit\" class=\"button\" id=\"mc-embedded-subscribe\" name=\"subscribe\" ng-disabled=\"Newsletter.$invalid\"></div></form></div></div></div></div></div>");}]);