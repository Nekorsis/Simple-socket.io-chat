import gulp from 'gulp';
import runSequence from 'run-sequence';
import ghpages from 'gulp-gh-pages';

gulp.task('deploy', () => (
	runSequence(
		'del',
		'build',
		() => gulp.src('static/**/*').pipe(ghpages({branch: 'dist'}))
	)
));
