import gulp from 'gulp';
import svgSymbols from 'gulp-svg-symbols';
import gulpif from 'gulp-if';
import rename from 'gulp-rename';
import path from 'path';

gulp.task('icons', () => (
	gulp.src('views/icons/**/*.svg')
		.pipe(svgSymbols({
			title: false,
			id: 'icon_%f',
			className: '%f',
			templates: [
				path.join(__dirname, '../utils/svg.styl'),
				'default-svg',
			],
		}))
		.pipe(gulpif(/\.styl$/, gulp.dest('views/styles/helpers')))
		.pipe(gulpif(/\.svg$/, rename('icon.svg')))
		.pipe(gulpif(/\.svg$/, gulp.dest('static/assets/images/')))
));
