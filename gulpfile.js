/*
	Dojo gulpfile
	@link http://gulpjs.com
	
	Table of Contents
	[0.0] Available tasks
	[1.0] Variable definations
		[1.1] Glup Plugins
		[1.2] PostCSS Plugins
		[1.3] Asset inputs and outputs
	[2.0] Create gulp tasks
		[2.1] CSS Concat & Minify
		[2.2] JS Linting
		[2.3] JS Concat & Minify
		[2.4] 
		[2.5] Browser Sync Server
		[2.6] Default task
		[2.7] Proruction task

	[0.0] Available Gulp tasks
		$ gulp
		$ gulp production [TDB]
			$ gulp css
			$ gulp js
				$ gulp js --type production
				$ gulp jshint
			$ gulp server
*/

/* 
	[1.1]
*/

var autoprefixer    = require('autoprefixer')
var browserSync     = require('browser-sync').create();
var browserReload   = browserSync.reload;
var mqpacker        = require('css-mqpacker');
var cssnano         = require('cssnano');
var concat          = require('gulp-concat');
var gulp            = require('gulp');
var imagemin        = require('gulp-imagemin');
var jshint          = require('gulp-jshint');
var postcss         = require('gulp-postcss');
var size            = require('gulp-size');
var sourcemaps      = require('gulp-sourcemaps');
var uglify          = require('gulp-uglify');
var uncss           = require('gulp-uncss');
var util            = require('gulp-util');
var watch           = require('gulp-watch');
var calc            = require('postcss-calc');
var color           = require('postcss-color-function');
var media           = require('postcss-custom-media');
var properties      = require('postcss-custom-properties');
var comments        = require('postcss-discard-comments');
var atImport        = require('postcss-import');
var pump            = require('pump');

/*
	[1.2]
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
	[1.3]
*/

var input 			= {
	'css': './src/css/tachyons.css',
	'js': './src/js/*.js'
};

/*
	[1.3]
*/

var output 			= {
	'css': './dist/css',
	'js': './dist/js'
};

/* 
	[2.1] CSS processing task
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

		.pipe(browserSync.stream())
});

/*
	[2.2] JavaScript linting task
	$ gulp jshint
*/

gulp.task('jshint', ['js'], function(){

	// plumbing
	return gulp.src(input.js)

		.pipe(browserSync.stream())

		// lint the javascript
		.pipe(jshint())

		// add color to error report in terminal
		.pipe(jshint.reporter('jshint-stylish'))

		// fail the task if jshint is non-passing
		.pipe(jshint.reporter('fail'))
});

/* 
	[2.3] JavaScript concat & minify tasks
	$ gulp js
	$ gulp js --type production
*/

gulp.task('js', function(cb){
	pump([
		gulp.src(input.js),

		sourcemaps.init(),

			concat('script.js'),

			util.env.type === 'production' ? uglify() : util.noop(),

		sourcemaps.write(),

		gulp.dest(output.js)
	],
	cb 
	);
});

/*
	[2.4]
*/

gulp.task('js-watch', ['jshint'], function(done){
	browserReload;
	done();
});

/*
	[2.5] Browser Sync Server
	$ gulp server
*/

gulp.task('server', ['css', 'js-watch'], function(){
	browserSync.init({
		server: "./"
	});

	gulp.watch('./src/css/*.css', ['css']);
	gulp.watch(input.js, ['jshint']);
	gulp.watch('./*.html').on('change', browserReload);
});

/* 
	[2.6] Default task
	$ gulp
*/

gulp.task('default', ['server']);

/* 
	[2.7] Production task
	$ gulp production
*/
// gulp.task('production', ['css', 'js --type production']);

