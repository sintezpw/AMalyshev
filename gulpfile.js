"use strict";

var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var del = require("del");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var minify = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var watch = require('gulp-watch');
 var browserSync =require('browser-sync'); 
var svgstore = require("gulp-svgstore");
var rename = require("gulp-rename");
var run = require("run-sequence");


var patch ={
    build:{
        html:'build/',
        js:'build/js/',
        css:'build/css/',
        img:'build/img/',
        fonts:'build/fonts/'
    },
    src:{
        html:'src/.html',
        js:'src/js/main.js',
        style:'src/sass/main.scss',
        img:'srs/img/**/*.*',
        fonts:'src/fonts/**/*. */'
    },
    watch:{
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/sass/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'

    },
    clean:'./build'
};

gulp.task("style", function () {
    gulp.src("sass/main.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest("build/css"))
        .pipe(minify())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("build/css"))
        .pipe(server.stream());
});

gulp.task("normalize", function () {
    gulp.src("sass/normalize.scss")
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest("build/css"))
        .pipe(minify())
        .pipe(rename("normalize.min.css"))
        .pipe(gulp.dest("build/css"));
});

gulp.task("server", function () {
    server.init({
        server: "build/",
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch("sass/**/*.scss", ["style"]);
    gulp.watch("img/*.svg", ["svgUpdate"]).on("change", server.reload);
    gulp.watch("*.html", ["html"]).on("change", server.reload);
});

gulp.task("html", function () {
    return gulp.src("*.html")
        .pipe(posthtml([
            include()
        ]))
        .pipe(gulp.dest("build"));
});

gulp.task("webp", function () {
    return gulp.src("img/**/*.{png,jpg}")
        .pipe(webp({ quality: 90 }))
        .pipe(gulp.dest("img"));
});

gulp.task("images", function () {
    return gulp.src("img/**/*.{png,jpg,svg}")
        .pipe(imagemin([
            imagemin.optipng({ optimizationLevel: 3 }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest("img"));
});

gulp.task("sprite", function () {
    return gulp.src("img/*.svg")
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename("sprite.svg"))
        .pipe(gulp.dest("build/img"));
});

gulp.task("clean", function () {
    return del("build");
});

gulp.task("copy", function () {
    return gulp.src([
        "fonts/**/*.{woff,woff2}",
        "img/**",
        "js/**"
    ], {
            base: "."
        })
        .pipe(gulp.dest("build"));
});

gulp.task("svgUpdate", function (done) {
    run(
        "sprite",
        "html",
        done
    );
});

gulp.task("build", function (done) {
    run(
        "clean",
        "copy",
        "normalize",
        "style",
        "sprite",
        "html",
        done
    );
});

gulp.task('sass',function () {
   return gulp.src('sass/**/*.sass')
   .pipe (sass())
   .pipe (gulp.dest('build/css')) 
});

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baaseDir: 'build'
        },
        notify: false
    });
});
gulp.task('watch',['browser-sync','sass','html'],function() {
    gulp.watch('sass/**/*sass',['sass']);
    gulp.watch('/*.html', browserSync.reload);
});

















































    



