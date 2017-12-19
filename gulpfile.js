'use stict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var livereload = require('gulp-livereload');
var plumber = require('gulp-plumber');
var postcss = require("gulp-postcss");
var concat = require('gulp-concat');
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var uglify = require('gulp-uglify');
var del = require("del");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var minify = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var rename = require("gulp-rename");
var run = require("run-sequence");
var concatCss = require('gulp-concat-css');


var patch = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/.html',
        js: 'src/js/main.js',
        style: 'src/sass/main.scss', ///    
        img: 'srs/img/**/*.*',
        fonts: 'src/fonts/**/*. */'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/sass/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'

    },
    clean: './build'
};
// SaSS

gulp.task("sass", function () {
    gulp.src("sass/main.scss")////
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
gulp.task('browser-sync', function () { // Создаем таск browser-sync
    browserSync({ // Выполняем browserSync
        server: { // Определяем параметры сервера
        baseDir: 'build' // Директория для сервера - build
        },
        notify: false // Отключаем уведомления
    });
});
gulp.task('browser-sync', function () {
    var files = [
        'build/html/**/*.html',  ////
        'build/css/**/*.css',
        'build/img/**/*.png',
        'build/js/**/*.js'
    ];
browserSync.init(files, {
        server: {
            baseDir: 'build'
        }
    });
});
gulp.task('watch', ['browser-sync', 'sass', 'html', 'js','sprite'], function () {
gulp.watch('sass/**/*scss', ['sass']);
gulp.watch('*/.html', browserSync.reload);  ////
});

gulp.task('js', function () {
    gulp.src('js/*.js')
.pipe(gulp.dest("build/js"))
        .pipe(minify())
        
        .pipe(gulp.dest("build/js"))
        .pipe(server.stream());
        
    gulp.watch('js/*.js', ['uglify']);
});
gulp.task('uglify', function () {
    gulp.src('js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('build/js'));
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
gulp.task('uglify', function () {
    gulp.src('js/*.js')
        .pipe(plumber()) // plumber
        .pipe(uglify())
        .pipe(gulp.dest('build/js'));
});


gulp.task("webp", function () {
    return gulp.src("img/**/*.{png,jpg}")
        .pipe(webp({ quality: 90 }))
        .pipe(gulp.dest("img"));
});
gulp.task("img", function () {
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
        "js/**",
        "html/**"   ////
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
gulp.task('default', ['watch']);
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