var gulp = require('gulp')
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

gulp.task('default',function(){
    gulp.run('serve')
    gulp.watch(['./index.js','./config.js'], function(){
        gulp.run('serve')
    })
    gulp.watch('./*/*.js',function(){
        gulp.run('serve')
    })
    
    gulp.watch('./view/*.hbs',function(){
        gulp.run('serve')
    })
    
})


