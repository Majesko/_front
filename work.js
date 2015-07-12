//var require, console, path, config,
//    gulp = require('gulp'),
//    
//    jade = require('gulp-jade'),
//    
//    sass = require('gulp-sass'),
//    concat = require('gulp-concat'),
//    cssmin = require('gulp-minify-css'),
//    autoprefixer = require('gulp-autoprefixer'),
//
//    
//    spritesmith = require('gulp.spritesmith'),
//    
//    webpack = require('gulp-webpack'),
//    webpackbuild = require('gulp-webpack-build'),
//    uglify = require('gulp-uglify'),
//    
//    rename = require('gulp-rename'),
//    notify = require('gulp-notify'),
//    rimraf = require('gulp-rimraf'),
//    gulpif = require('gulp-if'),
//    runSqc = require('run-sequence'),
//    wiredep = require('wiredep').stream,
//    useref = require('gulp-useref'),
//    watch = require('gulp-watch'),
//    
//    open = require('gulp-open'),
//    browserSync = require("browser-sync"),
//    reload = browserSync.reload;

















//config = {
//    server: {
//        baseDir: "./app"
//    },
//    tunnel: true,
//    host: 'localhost',
//    port: 9000,
//    logPrefix: "front_end"
//};



//
//// TASKS / TASKS / TASKS / TASKS / TASKS / TASKS / TASKS /
//// SERVER
//$.gulp.task('sv', function () {
//    "use strict";
//    return $.browserSync(config);
//});



gulp.task('useref', function () {
    "use strict";
    var assets = useref.assets();
    return gulp.src('./_dev/vendor/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCSS()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('./app'))
        .pipe(connect.reload())
        .pipe(notify('VENDOR'));
});


//// BOWER files
//$.gulp.task('bower', function () {
//    "use strict";
//    $.gulp.src(path.vndr.tmp + "index.html")
//        .pipe($.wiredep({
//            directory: path.bowerFiles,
//            devDependencies: true
//        }))
//        .pipe($.gulp.dest(path.vndr.vndr))
//        .pipe($.notify("wiredep"));
//});


//$.gulp.task('build', function () {
//    var assets = $.useref.assets();
//    
//    $.rimraf.sync(productionPath, function (er) {
//        if (er) throw er;
//    });
//    
//    return $.gulp.src(['./_dev/_jade/_pages/*.html'])
//    
//        .pipe($.wiredep.stream({directory: './_dev/_bower'}))
//    
//        .pipe(assets).on('error', log)
//        .pipe($.if('*.js', $.uglify())).on('error', log)
//        .pipe(assets.restore()).on('error', log)
//    
//        .pipe($.useref()).on('error', log)
//    
//        .pipe($.gulp.dest(productionPath)).on('error', log);
//});


//gulp.task('bld', function (cb) {
//    "use strict";
//    runSqc('jade', 'css', 'sprite', 'bower', cb);
//});




//gulp.task('rimraf', function () {
//    "use strict";
//    return gulp.src('./app/*.html')
//        .pipe(rimraf())
//        .pipe(notify('RIMRAF was done!'));
//});
//// BUILD BOWER FILES
//gulp.task('useref', function () {
//    "use strict";
//    var assets = useref.assets();
//    return gulp.src(path.dev.app)
//    
//        .pipe(assets)
//        .pipe(gulpif('*.js', uglify()))
//        .pipe(gulpif('*.css', cssmin()))
//        .pipe(assets.restore())
//    
//        .pipe(useref())
//        .pipe(gulp.dest(path.app))
//        .pipe(reload({stream: true}))
//        .pipe(notify('VENDOR'));
//});
//
//
//
//$.gulp.task('watch', ['build_css-minify'], function () {
//    $.gulp.watch(['./_dev/_jade/**/*.jade',
//                  './_dev/_js/**/*.js',
//                  './_dev/_sass/**/*.scss',
//                  './_dev/_sass/fonts/*'],
//                 ['build_css-minify']);
//});
//
//$.gulp.task('default', ['watch']);
////gulp.watch('bower.json', ['wiredep']);



//function log(error) {
//    console.log([
//        '',
//        "----------ERROR MESSAGE START----------",
//        ("[" + error.name + " in " + error.plugin + "]"),
//        error.message,
//        "----------ERROR MESSAGE END----------",
//        ''
//    ].join('\n'));
//    this.end();
//}




