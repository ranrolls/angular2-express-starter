const gulp = require('gulp');
var copy = require('gulp-copy');

gulp.task('ibmscan', copyFunction);

function copyFunction ()
{
    return gulp
        .src('IBMDomainVerification.html')
        .pipe(copy('dist/client', { prefix: 1 }));       
}