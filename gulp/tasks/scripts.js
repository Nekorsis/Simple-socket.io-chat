import gulp from 'gulp';
import gutil from 'gulp-util';
import gulpif from 'gulp-if';
import browserify from 'browserify';
import babelify from 'babelify';
import jadeify from 'jadeify';
import buffer from 'vinyl-buffer';
import uglify from 'gulp-uglify';
import source from 'vinyl-source-stream';
import paths from '../paths';

gulp.task('scripts', () => (
	browserify({debug: gutil.env.debug})
		.transform(babelify)
		.transform(jadeify)
		.require('views/scripts/app.js', {entry: true})
		.bundle()
		.on('error', err => console.log('Error: ' + err.message))
		.pipe(source('app.min.js'))
		.pipe(buffer())
		.pipe(gulpif(!gutil.env.debug, uglify()))
		.pipe(gulp.dest(paths.scripts))
));
