/*global alert: false, confirm: false, console: true, Debug: false, opera: false, prompt: false, WSH: false */

var require,
    path,
    config,
    log,
    gulp = require('gulp'),
    $ = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'gulp.*', "*"],
        lazy: false
    });


// CONFIG / CONFIG / CONFIG / CONFIG / CONFIG / CONFIG /
path = {
    dev: {
        tmp:  '_dev/_template/',
        css:  '_dev/_style/style.scss',
        js:   '_dev/_script/',
        sprt: '_dev/_media/sprite/',
        img:  '_dev/_media/img/',
        fvc:  '_dev/_media/favicon/',
        mov:  '_dev/_media/movie/',
        fnt:  '_dev/_media/fonts/',
        svg:  '_dev/_media/svg/'
    },
    vndr: {
        bwr: './_dev/_bower',
        tmp: './_dev/vndr/tmp',
        css: './_dev/vndr/css',
        js:  './_dev/vndr/js'
    },
    wch: {
        bwr:  './bower.json',
        tmp:  '_dev/_template/**/*.*',
        css:  '_dev/_style/**/*.*',
        js:   '_dev/_script/**/*.*',
        sprt: '_dev/_media/sprite/*.*',
        img:  '_dev/_media/img/*.*',
        fvc:  '_dev/_media/favicon/*.*',
        mov:  '_dev/_media/movie/*.*',
        fnt:  '_dev/_media/fonts/*.*',
        svg:  '_dev/_media/svg/*.*'
    },
    app: {
        tmp: './app/',
        js:  './app/js/',
        css: './app/css/',
        fvc: './app/favicon/',
        img: './app/css/img/',
        mov: './app/css/movie/',
        fnt: './app/css/font/',
        svg: './app/css/svg/'
    },
    bowerFiles: './_dev/_bower',
    cleanTmp:   ["./app/index.html", "./_dev/vndr/tmp"],
    cleanAll:   ["./app", "./_dev/vndr"]
};
config = {
    server: {
        baseDir: path.app.tmp
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "front_end"
};



//// TASKS / TASKS / TASKS / TASKS / TASKS / TASKS / TASKS /
//// SERVER
gulp.task('server', function () {
    "use strict";
    return $.browserSync(config);
});



// MEDIA files  ------------------------------------ done!
gulp.task('sprt', function () {
    "use strict";
    var spriteData = gulp.src(path.dev.sprt + "*.png")
        .pipe($.spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css'
        }))
        .on('error', log);
    spriteData.img
        .pipe(gulp.dest(path.app.img))
        .pipe($.notify('SPRITE img'))
        .on('error', log);
    spriteData.css
        .pipe(gulp.dest(path.vndr.css))
        .pipe($.notify('SPRITE css'))
        .on('error', log);
});
gulp.task('img', function () {
    "use strict";
    return gulp.src([path.dev.img + "*.jpg", path.dev.img + "*.gif", path.dev.img + "*.png"])
        .pipe(gulp.dest(path.app.img))
        .pipe($.notify('img'));
});
gulp.task('favicon', function () {
    "use strict";
    return gulp.src(path.dev.fvc + "*.*")
        .pipe(gulp.dest(path.app.fvc))
        .pipe($.notify('favicon'));
});
gulp.task('movie', function () {
    "use strict";
    return gulp.src(path.dev.mov + "*.*")
        .pipe(gulp.dest(path.app.mov))
        .pipe($.notify('movie'));
});
gulp.task('fonts', function () {
    "use strict";
    return gulp.src([path.dev.fnt + "*.eot", path.dev.fnt + "*.svg", path.dev.fnt + "*.ttf", path.dev.fnt + "*.woff", path.dev.fnt + "*.woff2"])
        .pipe(gulp.dest(path.app.fnt))
        .pipe($.notify('fonts'));
});
gulp.task('svg', function () {
    "use strict";
    return gulp.src(path.dev.svg + "*.*")
        .pipe(gulp.dest(path.app.svg))
        .pipe($.notify('svg'));
});



// MOCKUP & Dependencies  ------------------------------------ done!
gulp.task('jade', function () {
    "use strict";
    var YOUR_LOCALS = {};
    return gulp.src(path.dev.tmp + 'page/*.jade')
        .pipe($.jade({
            pretty: true,
            locals: YOUR_LOCALS
        }))
        .pipe(gulp.dest(path.vndr.tmp))
        .pipe($.notify('JADE'))
        .on('error', log);
});
gulp.task('cleanMockup', function () {
    "use strict";
    return gulp.src(path.cleanTmp)
        .pipe($.clean())
        .pipe($.notify('clean mockup'));
});
gulp.task('bower', function () {
    "use strict";
    var assets = $.useref.assets();
    return gulp.src(path.vndr.tmp + "/*.html")
        .pipe($.wiredep.stream({
            directory: path.vndr.bwr,
            devDependencies: true
        }))
        .pipe(assets).on('error', log)
        .pipe($.if('*.js',  $.uglify())).on('error', log)
        .pipe($.if('*.css', $.minifyCss())).on('error', log)
        .pipe(assets.restore()).on('error', log)
        .pipe($.useref()).on('error', log)
        .pipe($.notify('build'))
        .pipe(gulp.dest(path.app.tmp)).on('error', log);
});



// STYLE & SCRIPT ------------------------------------ done!
gulp.task('css', function () {
    "use strict";
    return gulp.src(path.dev.css)
        .pipe($.sass())
        .pipe($.autoprefixer())
        .pipe($.minifyCss())
        .pipe($.rename("bundle.css"))
        .pipe(gulp.dest(path.app.css))
        .pipe($.notify('CSS'))
        .on('error', log);
});
gulp.task('js', function () {
    "use strict";
    return gulp.src(path.dev.js + '**/**.js')
        .pipe($.concat('main.js'))
        .pipe($.uglify())
        .pipe($.rename("main.min.js"))
        .pipe(gulp.dest(path.app.js))
        .pipe($.notify("javaScript"))
        .on('error', log);
});



// COMBINED tasks
gulp.task("media", function (cb) {
    "use strict";
    $.runSequence("sprt", "img", "favicon", "movie", "fonts", "svg", cb);
});
gulp.task("mockup", function (cb) {
    "use strict";
    $.runSequence("cleanMockup", "jade", "bower", cb);
});
gulp.task("build", function (cb) {
    "use strict";
    $.runSequence("media", "css", "js", "mockup", cb);
});




//// WATCHER
gulp.task('watch', function () {
    "use strict";
    gulp.watch([path.wch.tmp],  ['mockup']);
//    gulp.watch([path.wch.tmp],  ['mockup']).on('change', $.browserSync.reload);
    
    gulp.watch([path.wch.css],  ['css']).on('change', $.browserSync.reload);
    gulp.watch([path.wch.js],   ['js']).on('change', $.browserSync.reload);
    gulp.watch([path.wch.sprt], ['sprt']).on('change', $.browserSync.reload);
    gulp.watch([path.wch.img],  ['img']).on('change', $.browserSync.reload);
    gulp.watch([path.wch.fvc],  ['favicon']).on('change', $.browserSync.reload);
    gulp.watch([path.wch.mov],  ['movie']).on('change', $.browserSync.reload);
    gulp.watch([path.wch.fnt],  ['fonts']).on('change', $.browserSync.reload);
    gulp.watch([path.wch.svg],  ['svg']).on('change', $.browserSync.reload);
});
gulp.task('default', ['build', 'server', 'watch']);



// CLEAN PRODACTION & VENDOR PATHs
gulp.task('c', function () {
    "use strict";
    return gulp.src(path.cleanAll)
        .pipe($.clean())
        .pipe($.notify('prodaction path & vendor path! CLEAN was DONE'));
});
// CATCH ERRORS
function log(error) {
    "use strict";
    console.log([
        "----------------------------------------",
        "----------ERROR MESSAGE START----------",
        ("[" + error.name + " in " + error.plugin + "]"),
        error.message,
        "----------ERROR MESSAGE END----------",
        "----------------------------------------"
    ].join('\n'));
    this.end();
}







