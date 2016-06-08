var gulp = require('gulp'),
    gulpsync = require('gulp-sync')(gulp),
    htmlmin = require('gulp-htmlmin'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    // https://github.com/Jrlats/gulp-angular-embed-templates
    embedTemplates = require('gulp-angular-embed-templates'),
    //https://github.com/miickel/gulp-angular-templatecache#standalone---boolean-standalonefalse
    templateCache = require('gulp-angular-templatecache'),
    del = require('del'),
    Q = require('q'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat'),
    addStream= require('add-stream');

var source = __dirname + '/src/';
var output = __dirname +'/dist/';


// removes all files from 'dist'
gulp.task('clean', function() {
    var deferred = Q.defer();
    del(output + '**/*', {dot: true}, function() {
        deferred.resolve();
    });
    return deferred.promise;
});

// minify HTML templates
function prepareTemplates() 
{
  return gulp.src([source + 'js/templates/**/*.html'])
    .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true
    }))
    .pipe(templateCache('templateCache.js', { 
        //filename:'templates.js',
        module:'hugsbrugs.angular-seo-newsletter-templates', 
        standalone: true, 
        root: '/js/templates',
        //moduleSystem:'ES6',
    }));
}


// minify javascript
gulp.task('js', function() {
    //return gulp.src([source + 'js/angular-seo-newsletter.js'])
    return gulp.src([source + 'js/**/*.js'])
        //.pipe(embedTemplates({basePath:'/var/www/angular-lib/angular-seo-newsletter/src/js/templates'}))
        .pipe(uglify({mangle:false}))
        .pipe(addStream.obj(prepareTemplates()))
        .pipe(concat('angular-seo-newsletter.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(output));
});

// minify css
gulp.task('css', function() {
    return gulp.src([source + 'css/angular-seo-newsletter.css'])
        .pipe(cssnano({discardComments: {removeAll: true}}))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(output));
});

// group all build tasks
gulp.task('build', gulpsync.sync([
    //'clean',
    'js', 
    'css',
]));



// server tasks
// https://github.com/avevlad/gulp-connect
// try
// https://github.com/schickling/gulp-webserver
gulp.task('connect', function() {
    connect.server({
        root: 'src',
        port: 8000,
        livereload: true,
        //directoryListing: true,
        open: true
  });
});

gulp.task('html', function () {
    //gulp.src('./src/*.html')
    gulp.src('*.html')
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    //gulp.watch(['./src/*.html'], ['html']);
    gulp.watch(['*.html'], ['html']);
});

gulp.task('default', ['connect', 'watch']);




gulp.task('connect-prod', function() {
    connect.server({
        //root: 'src',
        port: 8000,
        livereload: true,
        open: true
  });
});

gulp.task('html-prod', function () {
    gulp.src('index.html')
        .pipe(connect.reload());
});

gulp.task('watch-prod', function () {
    gulp.watch(['*.html'], ['html-prod']);
});

gulp.task('live-prod', ['connect-prod', 'watch-prod']);

/*

var Jasmine = require('jasmine');
var jasmine = new Jasmine();

jasmine.loadConfigFile('spec/support/jasmine.json');
jasmine.configureDefaultReporter({
    showColors: false
});
jasmine.execute();

*/

/*
// http://jasmine.github.io/2.4/node.html#section-Configuration

var Jasmine = require('jasmine');
var jasmine = new Jasmine();

// Load configuration from a file OR from an object.

jasmine.loadConfigFile('spec/support/jasmine.json');

jasmine.loadConfig({
    spec_dir: 'spec',
    spec_files: [
        'appSpec.js',
        'requests/* * / *[sS]pec.js',
        'utils/* * / *[sS]pec.js'
    ],
    helpers: [
        'helpers/* * / *.js'
    ]
});

// Optionally specify a custom onComplete callback.
// The callback is given a boolean of whether all of 
// the specs passed or not. This is often used to message
// a status to task runners like grunt.
    
jasmine.onComplete(function(passed) {
    if(passed) {
        console.log('All specs have passed');
    }
    else {
        console.log('At least one spec has failed');
    }
});

// A ConsoleReporter is included if no other reporters are added. 
// You can configure the default reporter with configureDefaultReporter. 
// The default values are shown in the example.
    
jasmine.configureDefaultReporter({
    timer: new this.jasmine.Timer(),
    print: function() {
        process.stdout.write(util.format.apply(this, arguments));
    },
    showColors: true,
    jasmineCorePath: this.jasmineCorePath
});


// You can add a custom reporter with addReporter. 
// If you add a reporter through addReporter, 
// the default ConsoleReporter will not be added. 
// Multiple reporters can be added. 

var CustomReporter = require('./myCustomReporter');
var customReporter = new CustomReporter();

jasmine.addReporter(customReporter);

// Calling execute will run the specs.
jasmine.execute();

*/