var gulp = require('gulp')
var sass = require('gulp-sass')
var spawn = require('child_process').spawn
var node

gulp.task('serve',[], function(){
    if(node) node.kill()
    node = spawn('node', ['index.js'],{stdio: 'inherit'})
    node.on('close',function(code){
        if (code === 8) {
            gulp.log("Some things wrong, ...")
        }
    })
})

gulp.task('sass', function(){
    return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error',sass.logError))
    .pipe(gulp.dest('./public/ccss'))
})

gulp.task('default',function(){
    gulp.run('serve')

    gulp.watch(['./index.js','./config.js'], () => gulp.run('serve'))

    gulp.watch('./**/*.js', () => gulp.run('serve'))

    gulp.watch('./view/*.hbs', () => gulp.run('serve'))

    gulp.watch('./view/*/*.hbs', () => gulp.run('serve'))

    gulp.watch('./sass/**/*.scss',() => gulp.run('sass'))
})