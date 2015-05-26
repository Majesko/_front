var require, console, path, config,
    gulp = require('gulp'),
    
    tmpl = require('gulp-jade'),
    
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    uncss = require('gulp-uncss'),
    
    spritesmith = require('gulp.spritesmith'),
    
    webpack = require('gulp-webpack'),
    webpackbuild = require('gulp-webpack-build'),
    uglify = require('gulp-uglify'),
    
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    rimraf = require('gulp-rimraf'),
    gulpif = require('gulp-if'),
    runSequence = require('run-sequence'),
    wiredep = require('wiredep').stream,
    useref = require('gulp-useref'),
    watch = require('gulp-watch'),
    
    browserSync = require("browser-sync"),
    reload = browserSync.reload;



path = {
    app: {
        tmp: 'app/',
        js:  'app/js/',
        css: 'app/css/',
        fvc: 'app/favicon/',
        img: 'app/css/img/',
        mov: 'app/css/movie/',
        fnt: 'app/css/font/'
    },
    dev: {
        tmp:  '_dev/_template/page/*.jade',
        stl:  '_dev/_style/style.scss',
        js:   '_dev/_script/main.js',
        fvc:  '_dev/_media/favicon/*.*',
        img:  ['_dev/_media/img/*.jpg',
               '_dev/_media/img/*.jpeg',
               '_dev/_media/img/*.png',
               '_dev/_media/img/*.gif'
              ],
        sprt: '_dev/_media/sprite/*.png',
        svg:  '_dev/_media/svg/*.svg',
        mov:  '_dev/_media/movie/*.*',
        fnt:  ['_dev/_media/fonts/font/*.eot',
               '_dev/_media/fonts/font/*.svg',
               '_dev/_media/fonts/font/*.ttf',
               '_dev/_media/fonts/font/*.woff',
               '_dev/_media/fonts/font/*.woff2'
              ]
    },
    watch: {
        tmp:  '_dev/_template/page/*.jade',
        stl:  '_dev/_style/**/*.scss',
        js:   '_dev/_script/**/*.*',
        fvc:  '_dev/_media/favicon/*.*',
        img:  '_dev/_media/img/*.*',
        sprt: '_dev/_media/sprite/*.*',
        svg:  '_dev/_media/svg/*.*',
        mov:  '_dev/_media/movie/*.*',
        fnt:  '_dev/_media/fonts/font/*.*'
    },
    clean: './app'
};


config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};


// gulpfile tasks & path













