var gulp = require('gulp');
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var nodemon = require('gulp-nodemon');

gulp.task('css', function () {
    var stream = gulp.src('stylus/main.styl')
        .pipe(stylus({compress: false, paths: ['stylus']}))
        .pipe(autoprefixer())
        .pipe(minifyCSS())
        .pipe(rename('styles.css'))
		.pipe(gulp.dest('public/styles'));
	return stream;
});

gulp.task('nodemon', function () {
	return nodemon({
		script: 'index.js',
		ext: 'js ejs',
		ignore: ['public/'],
		env: { 'NODE_ENV': 'development' }
	})
});

gulp.task('watch', function () {
	gulp.watch('stylus/main.styl', ['css']);
});

gulp.task('start', ['nodemon', 'watch']);