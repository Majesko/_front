/*global alert: false, confirm: false, console: true, Debug: false, opera: false, prompt: false, WSH: false */
var require,
    path,
    config,
    log,
    gulp = require("gulp"),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    jade = require('gulp-jade'),
    minifyCss = require('gulp-minify-css'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    useref = require('gulp-useref'),
    spritesmith = require('gulp.spritesmith'),
    runSequence = require('run-sequence'),
    wiredep = require('wiredep').stream,
    prodPath = "app";


// CONFIG / CONFIG / CONFIG / CONFIG / CONFIG / CONFIG / CONFIG / CONFIG / CONFIG /
path = {
    dev: {
        tmp:  "_dev/_template/",
        css:  "_dev/_style/style.scss",
        js:   "_dev/_script/",
        sprt: "_dev/_media/sprite/",
        img:  "_dev/_media/img/",
        fvc:  "_dev/_media/favicon/",
        mov:  "_dev/_media/movie/",
        fnt:  "_dev/_media/fonts/",
        svg:  "_dev/_media/svg/"
    },
    vndr: {
        bwr: "./_dev/_bower",
        tmp: "./_dev/vndr/tmp",
        css: "./_dev/vndr/css",
        js:  "./_dev/vndr/js"
    },
    wch: {
        bwr:  "./bower.json",
        tmp:  "_dev/_template/**/*.*",
        css:  "_dev/_style/**/*.*",
        js:   "_dev/_script/**/*.*",
        sprt: "_dev/_media/sprite/*.*",
        img:  "_dev/_media/img/*.*",
        fvc:  "_dev/_media/favicon/*.*",
        mov:  "_dev/_media/movie/*.*",
        fnt:  "_dev/_media/fonts/*.*",
        svg:  "_dev/_media/svg/*.*"
    },
    app: {
        tmp: "./" + prodPath + "/",
        js:  "./" + prodPath + "/js/",
        css: "./" + prodPath + "/css/",
        fvc: "./" + prodPath + "/favicon/",
        img: "./" + prodPath + "/css/img/",
        mov: "./" + prodPath + "/css/movie/",
        fnt: "./" + prodPath + "/css/font/",
        svg: "./" + prodPath + "/css/svg/"
    },
    bowerFiles: "./_dev/_bower",
    cleanTmp:   ["./" + prodPath + "/index.html", "./_dev/vndr/tmp"],
    cleanAll:   ["./" + prodPath, "./_dev/vndr"]
};
config = {
    server: {
        baseDir: path.app.tmp
    },
    tunnel: true,
    host: "localhost",
    port: 9000,
    logPrefix: "front_end"
};


//// TASKS / TASKS / TASKS / TASKS / TASKS / TASKS / TASKS / TASKS / TASKS / TASKS /
//// SERVER
gulp.task("server", function () {
    "use strict";
    return browserSync(config);
});


// MEDIA files  ------------------------------------------------------------------------
gulp.task("sprt", function () {
    "use strict";
    var spriteData = gulp.src(path.dev.sprt + "*.png")
        .pipe(spritesmith({
            imgName: "sprite.png",
            cssName: "sprite.css"
        }))
        .on("error", log);
    spriteData.img
        .pipe(gulp.dest(path.app.img))
        .pipe(browserSync.reload({stream: true}))
//        .pipe(notify("SPRITE img"))
        .on("error", log);
    spriteData.css
        .pipe(gulp.dest(path.vndr.css))
//        .pipe(notify("SPRITE css"))
        .on("error", log);
});
gulp.task("img", function () {
    "use strict";
    return gulp.src([path.dev.img + "*.jpg", path.dev.img + "*.gif", path.dev.img + "*.png"])
        .pipe(gulp.dest(path.app.img))
        .pipe(browserSync.reload({stream: true}))
//        .pipe(notify("img"))
        .on("error", log);
});
gulp.task("favicon", function () {
    "use strict";
    return gulp.src(path.dev.fvc + "*.*")
        .pipe(gulp.dest(path.app.fvc))
        .pipe(browserSync.reload({stream: true}))
//        .pipe(notify("favicon"))
        .on("error", log);
});
gulp.task("movie", function () {
    "use strict";
    return gulp.src(path.dev.mov + "*.*")
        .pipe(gulp.dest(path.app.mov))
        .pipe(browserSync.reload({stream: true}))
//        .pipe(notify("movie"))
        .on("error", log);
});
gulp.task("fonts", function () {
    "use strict";
    return gulp.src([path.dev.fnt + "*.eot", path.dev.fnt + "*.svg", path.dev.fnt + "*.ttf", path.dev.fnt + "*.woff", path.dev.fnt + "*.woff2"])
        .pipe(gulp.dest(path.app.fnt))
        .pipe(browserSync.reload({stream: true}))
//        .pipe(notify("fonts"))
        .on("error", log);
});
gulp.task("svg", function () {
    "use strict";
    return gulp.src(path.dev.svg + "*.*")
        .pipe(gulp.dest(path.app.svg))
        .pipe(browserSync.reload({stream: true}))
//        .pipe(notify("svg"))
        .on("error", log);
});


// MOCKUP & Dependencies  ------------------------------------------------------------------------
gulp.task("jade", function () {
    "use strict";
    var YOUR_LOCALS = {};
    return gulp.src(path.dev.tmp + "page/*.jade")
        .pipe(jade({
            pretty: true,
            locals: YOUR_LOCALS
        }))
        .pipe(gulp.dest(path.vndr.tmp))
//        .pipe(notify("JADE"))
        .on("error", log);
});
gulp.task("cleanMockup", function () {
    "use strict";
    return gulp.src(path.cleanTmp)
        .pipe(clean())
//        .pipe(notify("clean mockup"))
        .on("error", log);
});
gulp.task("bower", function () {
    "use strict";
    var assets = useref.assets();
    return gulp.src(path.vndr.tmp + "/*.html")
        .pipe(wiredep({
            directory: path.vndr.bwr,
            devDependencies: true
        }))
        .pipe(assets).on("error", log)
        .pipe(gulpif("*.js",  uglify())).on("error", log)
        .pipe(gulpif("*.css", minifyCss())).on("error", log)
        .pipe(assets.restore()).on("error", log)
        .pipe(useref()).on("error", log)
        .pipe(gulp.dest(path.app.tmp))
        .pipe(notify("bower files"))
        .on("error", log);
});


// STYLE & SCRIPT ------------------------------------------------------------------------
gulp.task("css", function () {
    "use strict";
    return gulp.src(path.dev.css)
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(minifyCss())
        .pipe(rename("bundle.css"))
        .pipe(gulp.dest(path.app.css))
        .pipe(browserSync.reload({stream: true}))
//        .pipe(notify("CSS"))
        .on("error", log);
});
gulp.task("js", function () {
    "use strict";
    return gulp.src(path.dev.js + "**/**.js")
        .pipe(concat("main.js"))
        .pipe(uglify())
        .pipe(rename("main.min.js"))
        .pipe(gulp.dest(path.app.js))
        .pipe(browserSync.reload({stream: true}))
//        .pipe(notify("javaScript"))
        .on("error", log);
});


// TRICK task ------------------------------------------------------------------------
gulp.task("reload", function () {
    "use strict";
    return gulp.src(path.app.tmp + "index.html")
        .pipe(browserSync.reload({stream: true}))
        .pipe(notify("mockup-reload"))
        .on("error", log);
});



// COMBINED tasks ------------------------------------------------------------------------
//gulp.task("media", function (cb) {
//    "use strict";
//    runSequence("sprt", "img", "favicon", "movie", "fonts", "svg", cb);
//});
//gulp.task("mockup", function (cb) {
//    "use strict";
//    runSequence("cleanMockup", "jade", "bower", cb);
//});

gulp.task("mockup-watcher", function (cb) {
    "use strict";
    runSequence("cleanMockup", "jade", "bower", "reload", cb);
});
gulp.task("build", function (cb) {
    "use strict";
    runSequence("sprt", "img", "favicon", "movie", "fonts", "svg",
                "css",
                "js",
                "cleanMockup", "jade", "bower",
                "server", cb);
});



//// WATCHER ------------------------------------------------------------------------
gulp.task("watch", function () {
    "use strict";
    gulp.watch([path.wch.tmp],  ["mockup-watcher"]);
    gulp.watch([path.wch.css],  ["css"]);
    gulp.watch([path.wch.js],   ["js"]);
    gulp.watch([path.wch.sprt], ["sprt"]);
    gulp.watch([path.wch.img],  ["img"]);
    gulp.watch([path.wch.fvc],  ["favicon"]);
    gulp.watch([path.wch.mov],  ["movie"]);
    gulp.watch([path.wch.fnt],  ["fonts"]);
    gulp.watch([path.wch.svg],  ["svg"]);
});
gulp.task("default", ["build", "watch"]);



// CLEAN PRODACTION & VENDOR PATHs ------------------------------------------------------------------------
gulp.task("c", function () {
    "use strict";
    return gulp.src(path.cleanAll)
        .pipe(clean())
//        .pipe(notify("prodaction path & vendor path! CLEAN was DONE"))
        .on("error", log);
});
// CATCH ERRORS ------------------------------------------------------------------------
function log(error) {
    "use strict";
    console.log([
        "----------------------------------------",
        "----------ERROR MESSAGE START----------",
        ("[" + error.name + " in " + error.plugin + "]"),
        error.message,
        "----------ERROR MESSAGE END----------",
        "----------------------------------------"
    ].join("\n"));
    this.end();
}










