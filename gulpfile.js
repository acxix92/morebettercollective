/*
	Dojo gulpfile
	@link http://gulpjs.com
	
	Table of Contents
	[1] Gulp.js plugin registry
	[2] PostCSS plugin registry
	[3] CSS processing task
*/

/* 
	Gulp.js plugin registry
*/

var autoprefixer 	= require('autoprefixer')
var browserSync		= require('browser-sync').create();
var browserReload	= browserSync.reload;
var mqpacker		= require('css-mqpacker');
var cssnano 		= require('cssnano');
var gulp 			= require('gulp');
var imagemin 		= require('gulp-imagemin');
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
	PostCSS plugin registry
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
	CSS processing task
	$ gulp css
*/

gulp.task('css', function(){

	// plumbing
	return gulp.src('./src/css/tachyons.css')

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

		.pipe(gulp.dest('./dist/css'))
});