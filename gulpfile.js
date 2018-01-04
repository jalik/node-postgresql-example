const gulp = require("gulp");
const babel = require("gulp-babel");
const stripComments = require('gulp-strip-comments');
const watch = require("gulp-watch");

const pkg = require("./package.json");
const distDir = "dist";

// Compile JavaScript files
gulp.task("build:js", function () {
    return gulp.src([
        "src/js/**/*.js"
    ])
        .pipe(babel({presets: ["env"]}))
        .pipe(stripComments())
        .pipe(gulp.dest(`${distDir}`));
});

// Concat + compile files
gulp.task("build", ["build:js"]);

// Concat + compress files
gulp.task("default", ["build"]);

// Concat + compress files
gulp.task("prepublish", ["build"]);

// Automatic rebuild
gulp.task("watch", function () {
    gulp.watch(["src/**/*.js"], ["build:js"]);
});
