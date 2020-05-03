const babel = require('gulp-babel');
const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const path = require('path');

const buildPath = path.resolve('dist');
const srcPath = path.resolve('src');
const testPath = path.resolve('test');

// Compile JS files
gulp.task('build', () => gulp.src([
  path.join(srcPath, '**', '*.js'),
]).pipe(babel())
  .pipe(gulp.dest(buildPath)));

// Delete previous compiled files
gulp.task('clean', () => del([
  buildPath,
]));

// Run JS lint
gulp.task('eslint', () => gulp.src([
  path.join(srcPath, '**', '*.js'),
  path.join(testPath, '**', '*.js'),
  path.join('!node_modules', '**'),
]).pipe(eslint())
  .pipe(eslint.formatEach())
  .pipe(eslint.failAfterError()));

// Prepare files for production
gulp.task('prepare', gulp.series(
  'clean',
  'build',
  'eslint',
));

// Rebuild JS automatically
gulp.task('watch', () => gulp.watch([
  path.join(srcPath, '**', '*.js'),
], gulp.parallel(
  'build:js',
)));

// Default task
gulp.task('default', gulp.series(
  'prepare',
));
