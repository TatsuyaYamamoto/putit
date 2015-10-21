// 'use strict';

var gulp 		= require('gulp');
var $ 			= require('gulp-load-plugins');

var runSequence = require('run-sequence');
var del 		= require('del');

var electron 	= require('electron-connect').server.create();
var electron_packager = require('electron-packager');
var _config		= require('./config.json');


gulp.task('default', ['watch', 'electron_start']);


/* electron packagerタスク */
gulp.task('package', ['electron_package'])

/* 監視タスク　*/
gulp.task('watch', function(){
	// ファイルが変更されたとき
	gulp.watch(
		[
			_config.dir.src + 'index.html',
			_config.dir.src + 'js/*',
			_config.dir.src + 'css/*'
		]
		, ['liveReload']
	)

	// BrowserProcessが読み込むファイルが変更されたとき
	gulp.watch(_config.dir.src + 'index.js', ['liveRestart'])
})

gulp.task('liveReload', function(callback){
	runSequence('dist', 'electron_reload', callback)
})

gulp.task('liveRestart', function(callback){
	runSequence('dist', 'electron_restart', callback)
})


/* dist dirタスク　*/
gulp.task('dist', function(callback){
	runSequence(
		'del_dist', 
		[
			'dist_core',
			'dist_js',
			'dist_lib',
			'dist_css',
			'dist_img',
			'dist_sound'
		], 
		callback
	)
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
		dir: _config.dir.dist,              // アプリケーションのパッケージとなるディレクトリ
		out: _config.dir.appFile,    // .app や .exeの出力先ディレクトリ
		name: _config.appName,      // アプリケーション名
		arch: 'x64',              // CPU種別. x64 or ia32
		platform: 'darwin',       // OS種別. darwin or win32 or linux
		version: _config.system.version         // Electronのversion
	}, function (err, path) {
		// 追加でパッケージに手を加えたければ, path配下を適宜いじる
		done();
	});
});


// files: delete dist dir -------------------------------------------------
gulp.task('del_dist', function(){
	del([_config.dir.dist])
});

// files: src --> dist -------------------------------------------------

/* electron core */
// html, js files: / --> dist
gulp.task('dist_core', function(){
	gulp.src(_config.dir.src + 'index.html')
		.pipe(gulp.dest(_config.dir.dist));
	gulp.src(_config.dir.src + 'index.js')
		.pipe(gulp.dest(_config.dir.dist));
});

/* Javascript */
// js files: src --> dist
gulp.task('dist_js', function(){
	gulp.src(_config.dir.src + 'js/*')
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
		.pipe(gulp.dest(_config.dir.dist + 'css/'));
})

// img files: src --> dist
gulp.task('dist_img', function(){
	gulp.src(_config.dir.src + 'img/**/*')
		// .pipe($.imagemin())
		.pipe(gulp.dest(_config.dir.dist + 'img/'));
})


// sound files: src --> dist
gulp.task('dist_sound', function(){
	gulp.src(_config.dir.src + 'sound/**/*')
		.pipe(gulp.dest(_config.dir.dist + 'sound/'));
})

