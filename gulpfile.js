/*
	Dojo gulpfile
	@link http://gulpjs.com
	
	Table of Contents

	[0.0] Available Gulp Commands

	[1.0] Variable definations
		[1.1] Glup Plugins
		[1.2] PostCSS Plugins
		[1.3.1] Asset Inputs
		[1.3.2] Asset Outputs

	[2.0] Build Tasks
		[2.1] CSS Concat & Minify
		[2.2] JS Concat & Minify

	[3.0] Linting / Testing Tasks
		[3.1] JS Linting

	[4.0] Util Tasks
		[4.1] JS Reload Plumbing
		[4.2] IMG Processing 
		[4.3] Start Browser Sync Server
		[4.4] Drop /dist Assets
		[4.5] Drop Cache

	[5.0] Master Tasks
		[5.1] Default Task
		[5.2] Production Task
 

	[0.0] Available Gulp Commands
		$ gulp [5.1]
		$ gulp server [4.3]
		$ gulp css [2.1]
		$ gulp js [2.2]
		$ gulp img [4.2]
		$ gulp jshint [3.1]
		$ gulp js-plumbing [4.1]
		$ gulp drop:assets [4.4]
		$ gulp drop:cache [4.5]
*/

/* 
	[1.1]
*/

var autoprefixer    = require('autoprefixer')
var browserSync     = require('browser-sync').create();
var browserReload   = browserSync.reload;
var mqpacker        = require('css-mqpacker');
var cssnano         = require('cssnano');
var del             = require('del');
var cache           = require('gulp-cache');
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
	Define PostCSS plugin use and order for the CSS processing task below
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
	[1.3.1]
	Define either as a string or array paths relative to the site root
	for assets to be consumed and processed via gulp tasks
*/

var input 			= {
	'css': './src/css/tachyons.css',
	'js': [
		'./node_modules/barba.js/dist/barba.js',
		'./src/js/*.js',
		'./src/js/_main.js'
	],
	'img': './src/img/**.*'
};

/*
	[1.3.2]
	Define asset output paths
*/

var output 			= {
	'css': './dist/css',
	'js': './dist/js',
	'img': './dist/img'
};

/* 
	[2.1] CSS Concat & Minify
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
	[2.2] JS Concat & Minify
	
	@see https://github.com/mafintosh/pump
	@see https://github.com/floridoo/gulp-sourcemaps
	@see https://github.com/contra/gulp-concat
	@see https://github.com/gulpjs/gulp-util
	@see https://github.com/terinjokes/gulp-uglify

	$ gulp js
	$ gulp js --type min
*/

gulp.task('js', function(cb){
	pump([
		gulp.src(input.js),

		sourcemaps.init(),

			concat('scripts.js'),

			util.env.type === 'min' ? uglify() : util.noop(),

		sourcemaps.write(),

		gulp.dest(output.js)
	],
	cb 
	);
});

/*
	[3.1] JS Linting
	$ gulp jshint
*/

gulp.task('jshint', ['js'], function(){

	// plumbing
	return gulp.src(input.js)

		.pipe(browserSync.stream())

		// extract javascript from HTML files before linting
		// only reads and reports
		.pipe(jshint.extract('auto'))

		// lint the javascript
		.pipe(jshint())

		// add color to error report in terminal
		.pipe(jshint.reporter('jshint-stylish'))

		// fail the task if jshint is non-passing
		.pipe(jshint.reporter('fail'))
});



/*
	[4.1] JS Reload Plumbing
	Just used for plumping
*/

gulp.task('js-plumbing', ['jshint'], function(done){
	browserReload;
	done();
});

/*
	[4.2] IMG Processing
	$ gulp img
*/

gulp.task('img', function(){
	return gulp.src(input.img)

		.pipe(cache(imagemin({
			// imagemin options
			verbose: true,
			interlaced: true
		})))

		.pipe(gulp.dest(output.img))
});

/*
	[4.3] Start Browser Sync Server
	$ gulp server
*/

gulp.task('server', ['css', 'js-plumbing'], function(){
	browserSync.init({
		server: "./"
	});

	gulp.watch('./src/css/*.css', ['css']);
	gulp.watch(input.js, ['jshint']);
	gulp.watch('./*.html').on('change', browserReload);
});

/*
	[4.4] Drop /dist Assets
	$ gulp drop:assets
*/

gulp.task('drop:assets', function(){
	return del.sync('dist')
});

/*
	[4.5] Drop Cache
	$ gulp drop:cache
*/

gulp.task('drop:cache', function(cb){
	return cache.clearAll(cb)
});

/* 
	[5.1] Default task
	$ gulp
*/

gulp.task('default', ['server']);

/* 
	[5.2] Production task
	$ gulp production
*/
// gulp.task('production', ['css', 'js --type production']);

