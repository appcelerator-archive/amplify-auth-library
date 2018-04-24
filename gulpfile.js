'use strict';

const gulp = require('gulp');
const babel = require("gulp-babel");
const eslint = require('gulp-eslint');

const files = ['src/**/*.js', 'test/**/*.js'];

gulp.task('lint', () => {
	return gulp.src(files)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('default', ['lint'], () =>
	gulp.src(files, { base: '.' })
		.pipe(babel({ presets: ['es2015'] }))
		.pipe(gulp.dest('dist'))
);
