const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('node-sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const argv = require('yargs').argv
const spawn = require('child_process').spawn;

gulp.task('pug', function() {
  return gulp.src('src/**/*.pug')
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('scss', function() {
  return gulp.src('src/**/*.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer())
    //.pipe(cleanCss())
    //.pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('js', function() {
  return gulp.src('src/**/*.js')
    //.pipe(uglify())
    //.pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.pug', gulp.series('pug'));
  gulp.watch('src/**/*.scss', gulp.series('scss'));
  gulp.watch('src/**/*.js', gulp.series('js'));
  let process;

  const restart = () => {
    if (process) {
      process.kill();
    }
    console.log(`argv: ${argv}`)
    process = spawn('gulp', [argv.task], {stdio: 'inherit'});
  };

  // Watch the gulpfile and restart the process if it changes
  gulp.watch('gulpfile.js', () => {
    restart();
  });
});

gulp.task('moveFavicon', function() {
  return gulp.src('src/assets/favicon.ico')
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', gulp.parallel('pug', 'scss', 'js', 'watch'));
