// 'use strict';

var gulp 		= require('gulp');
var plumber 	= require('gulp-plumber');
var imagemin 	= require('gulp-imagemin');

var runSequence = require('run-sequence');
var del 		= require('del');

var electron 	= require('electron-connect').server.create();
var electron_packager = require('electron-packager');
var _config		= require('./config.json');


gulp.task('default', ['watch', 'electron_start']);

/* electron packagerタスク */
gulp.task('package', function(callback){
	runSequence(
		'del_package', 
		[
			'dist_core',
			'dist_js',
			'dist_lib',
			'dist_css',
			'dist_img',
			'dist_sound'
		], 
		'electron_package',
		callback
	)
})

/* 監視タスク　*/
gulp.task('watch', function(){
	// ファイルが変更されたとき
	gulp.watch(
		[
			_config.dir.src + 'index.html',
			_config.dir.src + 'js/*',
			_config.dir.src + 'css/*'
		]
		, ['electron_reload']
	)

	// BrowserProcessが読み込むファイルが変更されたとき
	gulp.watch(_config.dir.src + 'index.js', ['electron_restart'])
})

// electron task -------------------------------------------------

gulp.task('electron_start', function(){
	electron.start();
});
gulp.task('electron_restart', function(){
	electron.restart();
})
gulp.task('electron_reload', function(){
	electron.reload();
})
gulp.task('electron_package', function (done) {
	electron_packager({
		dir: _config.dir.dist,
		out: _config.dir.appFile,
		name: _config.appName,
		arch: 'x64',						// CPU種別. x64 or ia32
		platform: 'darwin',					// OS種別. darwin or win32 or linux
		version: _config.system.version,	// Electronのversion
		asar: true,							// アーカイブ化
		icon: "icon.icns"
	}, function (err, path) {
		// 追加でパッケージに手を加えたければ, path配下を適宜いじる
		done();
	});
});

// files: delete dir -------------------------------------------------
gulp.task('del_package', function(){
	del([_config.dir.appFile+'/*'])
});

// files: src --> dist -------------------------------------------------

/* electron core */
// html, js files: / --> dist
gulp.task('dist_core', function(){
	gulp.src(_config.dir.src + 'index.html')
		.pipe(gulp.dest(_config.dir.dist));
	gulp.src(_config.dir.src + 'index.js')
		.pipe(plumber())
		.pipe(gulp.dest(_config.dir.dist));
	gulp.src(_config.dir.src + 'package.json')
		.pipe(plumber())
		.pipe(gulp.dest(_config.dir.dist));
});

/* Javascript */
// js files: src --> dist
gulp.task('dist_js', function(){
	gulp.src(_config.dir.src + 'js/*')
		.pipe(plumber())
		.pipe(gulp.dest(_config.dir.dist + 'js/'));

})

// lib files: src --> dist
gulp.task('dist_lib', function(){
	gulp.src(_config.dir.src + 'lib/**/*')
		.pipe(gulp.dest(_config.dir.dist + 'lib/'));
})

// css files: src --> dist
gulp.task('dist_css', function(){
	gulp.src(_config.dir.src + 'css/**/*')
		.pipe(plumber())
		.pipe(gulp.dest(_config.dir.dist + 'css/'));
})

// img files: src --> dist
gulp.task('dist_img', function(){
	gulp.src(_config.dir.src + 'img/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest(_config.dir.dist + 'img/'));
})


// sound files: src --> dist
gulp.task('dist_sound', function(){
	gulp.src(_config.dir.src + 'sound/**/*')
		.pipe(gulp.dest(_config.dir.dist + 'sound/'));
})

