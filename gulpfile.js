/*
第三方插件
gulp-scss
gulp-minify-css
gulp-renamea
*/

const gulp = require("gulp");
const sass = require("gulp-sass");
const minifyCSS = require("gulp-minify-css");
const rename = require("gulp-rename");

/*c
index.scss=>index.css=>index.min.css(重命名)
使用此方法，需要每一个文件都要进行编译处理，然后重命名，建议使用批量处理
*/
gulp.task("sass", function () {
    return gulp.src("stylesheet/index.scss")
        .pipe(sass())
        .pipe(gulp.dest("dist/css"))
        .pipe(minifyCSS())
        .pipe(rename("index.min.css"))
        .pipe(gulp.dest("dist/css"))
        .pipe(connect.reload());
})

/*
批量处理scss方法
*/
//gulp.task()定义一个任务
gulp.task("sassAll",(done)=> {
    //gulp.src是找到目标文件
    gulp.src("./stylesheet/*.scss")
    //gulp.pipe()管道流
    .pipe(sass())
    //gulp.dest()保存文件至指定目录
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload());
    done();
})

//批量处理js文件
gulp.task("scripts", function () {
    //!+文件名，表示排除此文件操作
    return gulp.src(["*.js", "!gulpfile.js"])
        .pipe(gulp.dest("dist/js"))
        .pipe(connect.reload());
})

//批量处理html文件
gulp.task("copy-html",function(){
    return gulp.src("*.html")
        .pipe(gulp.dest("dist"))
        .pipe(connect.reload());
})

//批量处理json文件
gulp.task("data",function(){
    return gulp.src(["*.json","!package.json"])
        .pipe(gulp.dest("dist/data"))
        .pipe(connect.reload());
})

//批量处理图片
gulp.task("images",function(){
    return gulp.src("images/**/*")
        .pipe(gulp.dest("dist/images"))
        .pipe(connect.reload());
})

//一次性执行多个任务
//gulp的3.0版本写法不能与gulp的4.0版本兼容 报错
// gulp.task("build",[ "scss","scssAll","scripts","copy-html","data","images"],function(){
//     console.log("项目建立成功");
// })

//gulp的4.0版本写法
gulp.task('build', gulp.series(["sass","sassAll","scripts","copy-html","data","images", async(done) => {
    console.log("项目建立成功");
    done();
}]));


/*All
建立监听gulp-watch()
*/
const watch=require("gulp-watch");
gulp.task("watchAll",function(done){
    // gulp.watch("stylesheet/index.scss",["sass"]);
    //一直报错watch不是函数的原因是因为未使用4.0版本
    //watch task has to be a function 
    gulp.watch("stylesheet/*.scss",gulp.series("sassAll"));
    gulp.watch(["*.js", "!gulpfile.js"],gulp.series("scripts"));
    gulp.watch("*.html",gulp.series("copy-html"));
    gulp.watch(["*.json","!package.json"],gulp.series("data"));
    gulp.watch("images/**/*",gulp.series("images"));
    done();//使用done是官方写法
});

//启动一个服务器 gulp-connect()
const connect=require("gulp-connect");
gulp.task("server",function(done){
    connect.server({
        root:"dist",//根目录
        port:8887,//端口号0-65535
        livereload:true//实时刷新，必须在每个任务后面增加.pipe(connect.reload())进行实时刷新
    })
    done();
});

//启动一个默认任务  直接使用gulp运行
//gulp.task("default",["watch","server"]);
//默认版本也要使用gulp的4.0版本运行，注意使用gulp.series语法
gulp.task('default', gulp.series(["watchAll","server", async(done) => {
    console.log("项目监听成功");
    done();
}]));

//需要特别注意的是：调用gulp中的watch和connect任务，需要在cmd中安装npm install gulp-watch --save-dev
//和npm install gulp-connect --save-dev  然后输入gulp

//监听成功的模板cmd
// D:\phpStudy\PHPTutorial\WWW\suxiaomi\sumi>gulp
// [15:36:05] Using gulpfile D:\phpStudy\PHPTutorial\WWW\suxiaomi\sumi\gulpfile.js
// [15:36:05] Starting 'default'...
// [15:36:05] Starting 'watchAll'...
// [15:36:05] Finished 'watchAll' after 13 ms
// [15:36:05] Starting 'server'...
// [15:36:05] Starting server...
// [15:36:05] Finished 'server' after 15 ms
// [15:36:05] Starting '<anonymous>'...
// 项目监听成功
// [15:36:05] Finished '<anonymous>' after 1.01 ms
// [15:36:05] Finished 'default' after 33 ms
// [15:36:05] Server started http://localhost:8887
// [15:36:05] LiveReload started on port 35729
// [15:36:05] Running server
