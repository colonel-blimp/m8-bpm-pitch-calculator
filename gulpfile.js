import gulp from 'gulp';
import pug from 'gulp-pug';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCss from 'gulp-clean-css';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import yargs from 'yargs';
import { spawn as spawn_alias } from 'cross-spawn';
const sass  = gulpSass(dartSass);
const spawn = spawn_alias.spawn;
const argv  = yargs.argv;

import browserSync_alias from 'browser-sync';
const browserSync = browserSync_alias.create();

import { runCLI } from '@jest/core';

const {execSync} = await import('node:child_process');

gulp.task('pug', function() {
  return gulp.src('src/**/*.pug')
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('scss', function() {
  return gulp.src('src/**/*.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer())
    //.pipe(cleanCss())
    //.pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('js', function() {
  return gulp.src('src/**/*.js')
    //.pipe(uglify())
    //.pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('moveFavicon', function() {
  return gulp.src('src/assets/favicon.ico')
    .pipe(gulp.dest('dist/'));
});


// Jest UT
gulp.task('jest', function(done) {
  runCLI({}, ['.'])
    .then((result) => {
      result.results;
      //if (result.results && result.results.numFailedTests > 0) process.exit();
      done();
    })
    .catch((e) => {
      console.log(e);
    })
});

gulp.task('copy', function() {
  return gulp.src('src/**/*.{webmanifest,json,favicon.ico,png,jpg,gif,svg}')
    //.pipe(uglify())
    //.pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }))
});


gulp.task('build', gulp.parallel('pug', 'scss', 'js', 'moveFavicon', 'copy'));

gulp.task('default', function() {
  browserSync.init({
    //https: true,
    server: {
       baseDir: './dist',
       //https: true,
    },
  });

  gulp.watch('src/**/*.pug', gulp.series('pug'));
  gulp.watch('src/**/*.scss', gulp.series('scss'));
  gulp.watch('src/**/*.js', gulp.parallel('js','jest'));
  gulp.watch('__tests__/**/*.js', gulp.series('jest'));
  gulp.watch('src/**/*.json', gulp.series('copy'));

  gulp.watch('src/assets/favicon.ico', gulp.series('moveFavicon'));
  let process;

  const restart = () => {
    if (process) {
      process.kill();
    }
    process = spawn('gulp', [], {stdio: 'inherit'});
  };

  // Watch the gulpfile and restart the process if it changes
  gulp.watch('gulpfile.js', () => {
    restart();
  });
});

