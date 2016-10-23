'use strict';

var gulp          = require('gulp');
var sass          = require('gulp-sass');
var babel         = require('gulp-babel');
var browserSync   = require('browser-sync').create();
var runSequence   = require('run-sequence');
var postcss       = require('gulp-postcss');
var sourcemaps    = require('gulp-sourcemaps');
var autoprefixer  = require('autoprefixer');

// --------------------------------------------------
// Development Processes
// --------------------------------------------------

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: ''
    },
  })
})

gulp.task('sass', () => {
  return gulp.src('sass/**/*.scss')
    .pipe(sass().on('error', sass.logError)) // converts sass to css using gulp-sass
    .pipe(gulp.dest('css/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('autoprefixer', () => {
  return gulp.src('./css/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('babel', () => {
  return gulp.src('js/*.js')
    .pipe(babel({
        presets: ['es2015']
    }))
    .on('error', console.error.bind(console))
    .pipe(gulp.dest('dist/js/'));
});

// --------------------------------------------------
// Task Watcher
// --------------------------------------------------

gulp.task('watch', ['browserSync', 'sass'], () => {
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('js/**/*.js', ['babel']);
  gulp.watch('css/**/*.css', ['autoprefixer']);
  gulp.watch('*.html', browserSync.reload);
  gulp.watch('dist/css/**/*.css', browserSync.reload);
  gulp.watch('dist/js/**/*.js', browserSync.reload);
});

// --------------------------------------------------
// Build Sequences
// --------------------------------------------------

gulp.task('default', (callback) => {
  runSequence(['sass', 'babel', 'autoprefixer', 'browserSync', 'watch'],
    callback
  )
});






