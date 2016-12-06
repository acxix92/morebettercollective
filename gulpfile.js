/*
	Dojo gulpfile
	@link http://gulpjs.com
	
	Table of Contents
	[1] Gulp.js plugin registry
	[2] PostCSS plugin registry
	[3] Define asset [3.1] inputs & [3.2] outputs
	[4] CSS processing task
	[5] JavaScript linting task
*/

/* 
	[1] Gulp.js plugin registry
*/

var autoprefixer 	= require('autoprefixer')
var browserSync		= require('browser-sync').create();
var browserReload	= browserSync.reload;
var mqpacker		= require('css-mqpacker');
var cssnano 		= require('cssnano');
var gulp 			= require('gulp');
var imagemin 		= require('gulp-imagemin');
var jshint 			= require('gulp-jshint');
var postcss 		= require('gulp-postcss');
var size 			= require('gulp-size');
var uncss 			= require('gulp-uncss');
var watch 			= require('gulp-watch');
var calc 			= require('postcss-calc');
var color 			= require('postcss-color-function');
var media 			= require('postcss-custom-media');
var properties 		= require('postcss-custom-properties');
var comments 		= require('postcss-discard-comments');
var atImport 		= require('postcss-import');

/*
	[2] PostCSS plugin registry
*/

var postcssPlugins 	= [
	atImport,
	media,
	properties,
	calc,
	color,
	comments,
	autoprefixer,
	cssnano,
	mqpacker
];

/*
	[3.1] Define asset inputs
*/

var input 			= {
	'css': './src/css/tachyons.css',
	'js': './src/js/*.js'
};

/*
	[3.2] Define asset outputs
*/

var output 			= {
	'css': './dist/css'
}

/* 
	[4] CSS processing task
	$ gulp css
*/

gulp.task('css', function(){

	// plumbing
	return gulp.src(input.css)

		// process via postcss
		.pipe(postcss(postcssPlugins))

		// display file size in terminal
		.pipe(size({
			gzip: false,
			showFiles: true,
			title: 'Size ->'
		}))

		// display file size in terminal
		.pipe(size({
			gzip: true,
			showFiles: true,
			title: 'Size gZipped ->'
		}))

		.pipe(gulp.dest(output.css))
});

/*
	[5] JavaScript linting task
	$ gulp jshint
*/

gulp.task('jshint', function(){

	// plumbing
	return gulp.src('./src/js/*.js')

		// lint the javascript
		.pipe(jshint())

		// add color to error report in terminal
		.pipe(jshint.reporter('jshint-stylish'))

		// fail the task if jshint is non-passing
		.pipe(jshint.reporter('fail'))
});

/* 
	[6] JavaScript concat & minify tasks
	$ gulp js
*/

gulp.task('js', function(){

	// plumbing
	return gulp.src('./src/js/*.js')


})