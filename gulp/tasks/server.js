import browserSync from 'browser-sync';
import gulp from 'gulp';
import gutil from 'gulp-util';

gulp.task('server', () => (
	browserSync.init({
		proxy: 'localhost:5000',
		open: !!gutil.env.open,
		reloadOnRestart: true,
		port: gutil.env.port || 3000,
		tunnel: !!gutil.env.tunnel,
		ghostMode: false,
	})
));
