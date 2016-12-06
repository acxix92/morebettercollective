/*
	Dojo gulpfile
*/

/* 
	Gulp plugin registry
*/

var gulp = require('gulp');

/*
	PostCSS plugin registry
*/

var postcssPlugins = [

];

/* 
	CSS processing task
	$ gulp css
*/

gulp.task('css', function(){

	// plumbing
	return gulp.src('./src/tachyons.css')

		.pipe(postcss(postcssPlugins))

		.pipe()
})