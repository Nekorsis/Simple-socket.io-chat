import gulp from 'gulp';
import runSequence from 'run-sequence';
import {reload} from 'browser-sync';
import watch from 'gulp-watch';

gulp.task('watch', () => {
	global.watch = true;

	watch('views/sprite/**/*.png', gulp.start(
		'sprite'
	));

	watch('views/{styles,blocks}/**/*.styl', () => runSequence(
		'styles',
		() => reload('assets/styles/app.min.css')
	));

	watch('views/{pages,blocks}/**/*.jade', () => runSequence(
		// 'templates',
		reload
	));

	watch('views/resources/**/*', () => runSequence(
		'copy',
		reload
	));

	watch('views/scripts/**/*.js', () => gulp.start(
		'scripts',
		'lint',
		reload
	));

	watch('views/icons/**/*.svg', () => runSequence(
		'icons',
		reload
	));
});
