'use stict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var livereload = require('gulp-livereload');
var plumber = require('gulp-plumber');
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var del = require("del");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var minify = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var rename = require("gulp-rename");
var run = require("run-sequence");


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
        style: 'src/sass/style.scss',      
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

gulp.task('sass', function () { // Создаем таск Sass
    return gulp.src('sass/**/*.scss') // Берем источник
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(gulp.dest('css')) // Выгружаем результата в папку css
        .pipe(livereload())
        .pipe(browserSync.reload({ stream: true }));
         // Обновляем CSS на странице при изменении
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
        'html/**/*.html',
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





gulp.task('watch', ['browser-sync', 'sass', 'html','img'], function () {
    gulp.watch('sass/**/*scss', ['sass']);
    gulp.watch('*/.html', browserSync.reload);  ////
});

gulp.task("sass", function () {
    gulp.src("sass/style.scss")
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