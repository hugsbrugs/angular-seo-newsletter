
angular-seo-newsletter

[Visit Demo on Github Pages](http://hugsbrugs.github.io/angular-seo-newsletter)

![alt text](https://raw.githubusercontent.com/hugsbrugs/angular-seo-newsletter/master/img/angular-seo-newsletter.png "Angular SEO Newsletter Example")

## Needs

You certainly have notice more and more websites are offering you to susbscribe to their newsletter when you seem to behave like you are leaving their website.

This is a full AngularJS, no jQuery required, directive that allows you to fire a modal when user mouse goes over a vertical point.

A PHP server side implementation has been released :
[php-seo-newsletter](http://hugsbrugs.github.io/php-seo-newsletter)

An angular Mock Server can be deployd for test purpose :
```
git clone ...
cd /angular-seo-newsletter
npm install
bower install
gulp
```


## Installation
```
npm install --save angular-seo-newsletter
bower install --save angular-seo-newsletter
```

## Usage

```html
<link href="/bower_components/angular-seo-newsletter/dist/angular-seo-newsletter.min.css" rel="stylesheet">
<script src="/bower_components/angular-seo-newsletter/dist/angular-seo-newsletter.min.js"></script>
```
And load module in your angular app
```javascript
var myApp = angular.module('myApp', [
    'hugsbrugs.angular-seo-newsletter',
    ...
]);
```
```html
<hugsbrugs-seo-newsletter ng-model="seo" showmodalext="show_modal_ext"></hugsbrugs-seo-newsletter>
```
```javascript
$scope.seo = {
    y_offset:5,
    image:'src/img/SEO-Beginners-Guide.jpg',
    header_text:'CUSTOM_DEFAULT_HEADER_TEXT',
    call_action_text:'CUSTOM_DEFAULT_CALL_ACTION_TEXT',
    sub_text:'CUSTOM_DEFAULT_SUB_TEXT',
    email_placeholder:'CUSTOM_DEFAULT_EMAIL_PLACEHOLDER',
    success_text:'CUSTOM_DEFAULT_SUCCESS_TEXT',
    error_text:'CUSTOM_DEFAULT_ERROR_TEXT',
    // download hugbrugs/php-seo-newsletter
    //api_endpoint:'/php/register_newsletter.php',
    // fake endpoint
    api_endpoint:'/fake_endpoint',
    cookie_expire:'10 second',// debug mode
    // cookie_expire:'10 minute',// aggressive mode
    // cookie_expire:'1 day',// recommended mode
    // cookie_expire:'1 month',// cool mode
};
$scope.trigger_modal = function()
{
    $scope.show_modal();
};
```

## Customization
To modify to suit you needs, just fork, install dependecies and simulate server

## To Do:
- Ability to inject you own template, only respecting a minimal markup for form
- Add a config parameter to not display newsletter modal before x seconds (min_time_on_page:'10 second')

