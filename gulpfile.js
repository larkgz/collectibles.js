var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var concat = require('gulp-concat');
var uglify = require('gulp-uglify-es').default;
var svgo = require('gulp-svgo');
var sourcemaps = require('gulp-sourcemaps');
var header = require('gulp-header');
var spawn = require('child_process').spawn;
var plumber = require('gulp-plumber');
var jshint = require('gulp-jshint');

var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

function sass_task(minify) {
  return gulp.src(['node_modules/microtip/microtip.css', 'src/main.scss', 'src/theme-*.scss'])
  .pipe(plumber())
  .pipe(concat('collectibles.min.css'))
  .pipe(sass({style: minify? 'compressed' : 'expanded'}))
  .pipe(header(banner, { pkg : pkg } ))
  .pipe(gulp.dest('dist'))
}

gulp.task('sassdev', function() {
  return sass_task(false);
});

gulp.task('sassmin', function() {
  return sass_task(true);
});

var jsfiles = ['node_modules/secrets.js-grempe/secrets.js', 'src/*.js'];

gulp.task('lint', function() {
  return gulp.src('src/*.js')
    .pipe(jshint({esversion: 6}))
    .pipe(jshint.reporter('default'));
});

gulp.task('jsdev', function() {
  return gulp.src(jsfiles)
  .pipe(plumber())
  .pipe(sourcemaps.init())
    .pipe(concat('collectibles.min.js'))
    .pipe(header(banner, { pkg : pkg } ))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dist'))
});

gulp.task('jsmin', function() {
  return gulp.src(jsfiles)
  .pipe(plumber())
  .pipe(concat('collectibles.min.js'))
  .pipe(uglify())
  .pipe(header(banner, { pkg : pkg } ))
  .pipe(gulp.dest('dist'))
});

gulp.task('img', function() {
  return gulp.src(['!src/img/*.svg', 'src/img/*'])
  .pipe(plumber())
  .pipe(gulp.dest('dist/img'))
});
gulp.task('svg', function() {
  return gulp.src('src/img/*.svg')
  .pipe(svgo())
  .pipe(gulp.dest('dist/img'))
});
gulp.task('assets', gulp.series('img', 'svg'));

gulp.task('default', gulp.parallel(['sassmin', 'jsmin', 'assets']));
gulp.task('dev', gulp.parallel(['lint', 'sassdev', 'jsdev', 'assets']));