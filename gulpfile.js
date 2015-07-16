
var require, console, path, config, log,
    gulp = require('gulp'),
    $ = require('gulp-load-plugins')({
        pattern: '*',
        lazy: false
    });

// CONFIG / CONFIG / CONFIG / CONFIG / CONFIG / CONFIG /
path = {
    dev: {
        tmp:  '_dev/_template/',
        css:  '_dev/_style/style.scss',
        js:   '_dev/_script/',
        fvc:  '_dev/_media/favicon/',
        img:  '_dev/_media/img/',
        sprt: '_dev/_media/sprite/',
        svg:  '_dev/_media/svg/',
        mov:  '_dev/_media/movie/',
        fnt:  '_dev/_media/fonts/font/'
    },
    vndr: {
        tmp:  '_dev/vndr/tmp/',
        css:  '_dev/vndr/css/',
        js:   '_dev/vndr/js/'
    },
    app: {
        tmp: 'app/',
        js:  'app/js/',
        css: 'app/css/',
        fvc: 'app/favicon/',
        img: 'app/css/img/',
        mov: 'app/css/movie/',
        fnt: 'app/css/font/'
    },
    bowerFiles: './_dev/_bower',
    clean:      './_dev/vndr/tmp'
};
config = {
    server: {
        baseDir: "./app"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "front_end"
};



//// TASKS / TASKS / TASKS / TASKS / TASKS / TASKS / TASKS /

//// SERVER
gulp.task('sv', function () {
    "use strict";
    return $.browserSync(config);
});

// SCSS or SASS
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

// SPRITE.png
gulp.task('sprite', function () {
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

// JADE
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


gulp.task('bld', function (cb) {
    "use strict";
    $.runSequence('jade', 'css', 'sprite', cb);
});


gulp.task('wiredep', function () {
    "use strict";
    
    return gulp.src("./_dev/vndr/tmp/*.html")
        .pipe($.wiredep.stream({
            directory: './_dev/_bower',
            devDependencies: true
        }))
        .pipe($.notify('wiredep'))
        .pipe(gulp.dest('./_dev/vndr'));
});


gulp.task('build', function () {
    "use strict";
    var assets = $.useref.assets();
    
//    $.rimraf.sync('./app/', function (er) {
//        if (er) throw er;
//    });
//            exclude: ['./_dev/_bower/modernizr']
    
    return gulp.src("./_dev/vndr/tmp/*.html")
        .pipe($.wiredep.stream({
            directory: './_dev/_bower',
            devDependencies: true
        }))
        .pipe(assets).on('error', log)
        .pipe($.if('*.js',  $.uglify())).on('error', log)
        .pipe($.if('*.css', $.minifyCss())).on('error', log)
        .pipe(assets.restore()).on('error', log)
        .pipe($.useref()).on('error', log)
    
        .pipe($.notify('build'))
    
        .pipe(gulp.dest("./app")).on('error', log);
});




//// vendor
//gulp.task('rimraf', function () {
//    "use strict";
//    return gulp.src('./app/*.html')
//        .pipe(rimraf())
//        .pipe(notify('RIMRAF was done!'));
//});
//gulp.task('bower', function () {
//    "use strict";
//    return gulp.src('./_dev/*.html')
//        .pipe(wiredep({
//            directory: './_dev/_bower',
//            devDependencies: true
//        }))
//        .pipe(gulp.dest('./_dev/vendor'));
//});
//gulp.task('useref', function () {
//    "use strict";
//    var assets = useref.assets();
//    return gulp.src('./_dev/vendor/*.html')
//        .pipe(assets)
//        .pipe(gulpif('*.js', uglify()))
//        .pipe(gulpif('*.css', minifyCSS()))
//        .pipe(assets.restore())
//        .pipe(useref())
//        .pipe(gulp.dest('./app'))
//        .pipe(connect.reload())
//        .pipe(notify('VENDOR'));
//});
//
//gulp.task('bld', function (cb) {
//    "use strict";
//    $.runSequence('rimraf', 'bower', 'useref', cb).on('error', log);
//});










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







