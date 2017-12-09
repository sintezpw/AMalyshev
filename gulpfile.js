

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


gulp.task("style", function () {
    gulp.src("less/style.less")
        .pipe(plumber())
        .pipe(less())
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
    gulp.src("sass/normalize.sass")
        .pipe(less())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest("build/css"))
        .pipe(minify())
        .pipe(rename("normalize.min.css"))
        .pipe(gulp.dest("build/css"));
});

gulp.task("serve", function () {
    server.init({
        server: "build/",
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch("sass/**/*.sass", ["style"]);
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




































gulp.task('sass', function () {
    gulp.src('./assets/style/style.scss') // файл, который обрабатываем
        .pipe(sass().on('error', sass.logError)) // конвертируем sass в css
        .pipe(csso()) // минифицируем css, полученный на предыдущем шаге
        .pipe(gulp.dest('./public/css/'));
});
gulp.task('img', function () {
    gulp.src('.assets/img/**/*') // берем любые файлы в папке и ее подпапках
        .pipe(imagemin()) // оптимизируем изображения для веба
        .pipe(gulp.dest('./public/img/')) // результат пишем по указанному адресу

});
gulp.task('watch', function () {
    // При изменение файлов *.scss в папке "styles" и подпапках запускаем задачу sass
    gulp.watch('./assets/style/**/*.scss', ['sass']); 
    gulp.watch('./assets/img/**/*', ['img']);
});





gulp.task('sass',function () {
   return gulp.src('sass/**/*.sass')
   .pipe (sass())
   .pipe (gulp.dest('css')) 
});






gulp .task('watch',function() {
    watch([watch.html],function(event ,cb) {
        gulp.start('html:dev');
    });
    watch([watch.sass], function (event, cb) {
        gulp.start('sass:dev');
    });
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
gulp.task("style", function () {
    gulp.src("sass/style.sass")
                .pipe(plumber())
                .pipe(sass())
                .pipe(postcss([
                    autoprefixer()
]))
    .pipe(gulp.dest("css"))
        .pipe(minify())
        .pipe(rename("style.mini.css"))
        .pipe(gulp.dest("css"))
        .pipe(server.stream());
    });
gulp.task('sass', function () {
   return  gulp.src('sass/main.sass')
        .pipe(sass())
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({stream:true}))
});
gulp.task("normalize", function () {
    gulp.src("sass/normalize.sass")
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest("css"))
        .pipe(minify())
        .pipe(rename("normalize.min.css"))
        .pipe(gulp.dest("css"));
});
gulp.task("server", function () {
    server.init({
        server: "build/",
        notify: false,
        open: true,
        cors: true,
        ui: false
    });
    gulp.watch("sass/**/*.sass", ["style"]);
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
