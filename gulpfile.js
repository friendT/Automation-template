/**
 * Created by Administrator on 2017/5/19.
 */
/*gulp自动化*/
var gulp = require('gulp'); //引入plugin插件，引入后可以用&直接调用以gulp开头的插件，而不需要提前require声明
var browserSync = require("browser-sync").create();
var $ = require('gulp-load-plugins')(); //并且在方法后加上双扣号，表示立即调用
var reload = browserSync.reload;
var open = require('open');

var app = {
    srcPath: 'src/', //源代码路径
    devPath: 'build/', //整合后的路径，开发路径
    prdPath: 'dist/' //生产环境路径
};

gulp.task('lib', function() {
    gulp.src('bower_components/**/*')
        .pipe(gulp.dest(app.devPath + 'vender'))
        .pipe(gulp.dest(app.prdPath + 'vender'))
        .pipe(reload({ stream: true }));
});
/*html*/
gulp.task('html', function() {
    gulp.src(app.srcPath + '/**/*.html')
        .pipe(gulp.dest(app.devPath))
        .pipe(gulp.dest(app.prdPath))
        .pipe(reload({ stream: true }));
});

/*模拟后台数据*/
gulp.task('json', function() {
    gulp.src(app.srcPath + 'data/**/*.json')
        .pipe(gulp.dest(app.devPath + 'data'))
        .pipe(gulp.dest(app.prdPath + 'data'))
        .pipe(reload({ stream: true }));
});

/*less文件处理*/
gulp.task('css', function() {
    gulp.src(app.srcPath + 'css/*.css')
        .pipe($.less()) //因为有gulp-load-plugins插件，可以直接用$.less调用gulp-less插件
        .pipe(gulp.dest(app.devPath + 'css'))
        .pipe($.cssmin()) //因为有gulp-load-plugins插件，可以直接用$.less调用gulp-cssmin插件
        .pipe(gulp.dest(app.prdPath + 'css')) //传入到线上路径之前先压缩css
        .pipe(reload({ stream: true }));
});

/*js文件处理*/
gulp.task('js', function() {
    gulp.src(app.srcPath + 'js/**/*.js')
        .pipe($.concat('index.js')) //通过gulp-concat插件将所有js文件合并成一个index.js
        .pipe(gulp.dest(app.devPath + 'js'))
        .pipe($.uglify()) //流入线上环境路径之前，压缩js代码
        .pipe(gulp.dest(app.prdPath + 'js'))
        .pipe(reload({ stream: true }));
});

/*图片处理*/
gulp.task('image', function() {
    gulp.src(app.srcPath + 'image/**/*')
        .pipe(gulp.dest(app.devPath + 'image'))
        .pipe($.imagemin()) //流入线上环境路径之前，压缩image图片
        .pipe(gulp.dest(app.prdPath + 'image'))
        .pipe(reload({ stream: true }));
});

/*文件清理*/
gulp.task('clean', function() {
    gulp.src([app.devPath, app.prdPath]) //同时清除编码环境和线上环境的目录内容
        .pipe($.clean())
        .pipe($.connect.reload())
        .pipe(reload({ stream: true }));
});

/*创建browser-sync服务*/
gulp.task("browser-sync", function() {
    browserSync.init({
        server: {
            baseDir: "./dist/", //启动根目录
        }
    });
    //watch作用，当监控的内容发生变化，修改原文件的时候，自动执行构建任务
    gulp.watch('bower_components/**/*', ['lib']);
    gulp.watch(app.srcPath + 'data/**/*.json', ['json']);
    gulp.watch(app.srcPath + 'css/**/*.less', ['less']);
    gulp.watch(app.srcPath + 'js/**/*.js', ['js']);
    gulp.watch(app.srcPath + 'image/**/*', ['image']);
    gulp.watch(app.srcPath + '**/*.html', ['html']).on("change", function() {
        browserSync.reload;
    });
    //为实现构建完成后，刷新浏览器，进行实时预览，
    // 需要在每个任务最后添加.pipe(reload({stream:true}));
});

/*build*/
gulp.task('build', ['lib', 'image', 'json', 'js', 'css', 'html', 'browser-sync']);

//控制台使用gulp命令，就会调用default任务
gulp.task('default', ['build']);
//这里设定的default任务是serve，即gulp等同于gulp serve。
