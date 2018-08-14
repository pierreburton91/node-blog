var gulp = require('gulp');
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');

gulp.task('css', function () {
    var stream = gulp.src('stylus/main.styl')
        .pipe(stylus({compress: false, paths: ['stylus']}))
        .pipe(autoprefixer())
        .pipe(minifyCSS())
        .pipe(rename('styles.css'))
		.pipe(gulp.dest('public/styles'));
	return stream;
});

// gulp.task('sync', function() {
// 	var syncStream =  browserSync.init({
// 	    proxy: 'http://localhost:3000',
// 	    port: 4000,
// 	    open: true,
// 	    notify: true,
// 	    logConnections: true,
// 	    reloadDelay: 1000
// 	});
// 	return syncStream;
// });

gulp.task('nodemon', function (cb) {
	// var started = false;
	return nodemon({
		script: 'index.js',
		//tasks: ['css'],
		ext: 'js ejs styl', 
		env: { 'NODE_ENV': 'development' }
	}).on('start', ['css']);
	// .on('start', function() {
	// 	if (!started) {
	// 		cb();
	// 		started = true;
	// 		browserSync.reload();
	// 	} 
	// })
});

gulp.task('start', ['nodemon']);