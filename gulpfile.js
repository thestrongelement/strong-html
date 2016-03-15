/*global -$ */
'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var mustache = require('mustache');
var browserSync = require('browser-sync');
var del = require('del');
var handlebars = require('gulp-compile-handlebars');

var json__pkg = require('./package.json');
var json__settings = require('./data/settings.json');
var json__els = require('./data/els.json');
var json__strings = require('./data/strings.json');

var cli_argv = require('minimist')(process.argv.slice(2));
var minify = typeof cli_argv.minify != 'undefined';

var dir__public = 'public';
var dir__src_html = 'html';
var dir__src_css = 'css';
var dir__dist = 'dist';
var dir__www = 'www';

var server;

gulp.task('serve', ['www'], function () {
  server = browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: [dir__www],
      routes: {
        '/bower_components': 'bower_components',
        '/html': 'html'
      }
    }
  });
  gulp.watch(dir__src_html+'/**/*.html', ['html']);
  gulp.watch(dir__src_html+'/**/*.hbs', ['template']);
  gulp.watch(dir__public+'/**/*', ['public']);
});

/* https://github.com/phated/gulp-jade */
gulp.task('jade', function () {
  return gulp.src(dir__src_html+'/**/*.jade')
    .pipe($.jade({
      locals: {
        app: json__settings,
        els: json__els,
        strings: json__strings,
        markup: require('./helpers/markup.js')
      }
    }))
    .pipe(gulp.dest(dir__www));

});


gulp.task('template', function () {
  return gulp.src(dir__src_html+'/**/*.hbs')
    .pipe(handlebars({
    
    }))
    .pipe($.rename(function(path) {
      path.extname = ".html"
    }))
    .pipe(gulp.dest(dir__www))
    .pipe(reload())
});


gulp.task('mustache', function () {
  return gulp.src(dir__src_html+'/**/*.html')
    .pipe($.mustache({
      app: json__settings,
      els: json__els,
      strings: json__strings,
      markup: require('./helpers/markup.js')
    }))
    .pipe(gulp.dest(dir__www));

});

gulp.task('html', function () {
  return gulp.src(dir__src_html+'/**/*.html')
    .pipe($.ejs({
      app: json__settings,
      els: json__els,
      strings: json__strings,
      markup: require('./helpers/markup.js')
    }).on('error', $.util.log))
    .pipe(gulp.dest(dir__www))
    .pipe(reload());
});

// process static files
gulp.task('public', function() {
  return gulp.src(dir__public+'/**/*')
	  .pipe(gulp.dest(dir__www));
});

//build
gulp.task('www', $.sequence('clean',['public'],'template','html'));

gulp.task('default', function () {
  gulp.start('serve');
});

gulp.task('clean', del.bind(null, ['.tmp', dir__www]));

function reload() {
  if (server) {
    return browserSync.reload({ stream: true });
  }
  return $.util.noop();
}
