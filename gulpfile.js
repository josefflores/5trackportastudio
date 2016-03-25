
//  includes
var argv        = require('yargs').argv;

// include gulp
var gulp        = require('gulp');

// include gulp plug-ins
var jshint      = require('gulp-jshint');
var jsonlint    = require("gulp-jsonlint");
var csslint     = require('gulp-csslint');
var puglint     = require('gulp-pug-lint');

var git         = require('gulp-git');

//  Variables
var projectFiles = {
    css: ['./www/app/css/*.cs'] ,
    jade: ['./server/mvc/views/*.jade'],
    js: [
        './ini/*.js',
        './server/*.js',
        './www/app/*.js',
        './app.js'
   ],
   json: ['./server/mvc/models/*.json']
};

//  CODE LINTERS

//  Javascript
gulp.task('lint-js', function() {
    gulp.src(projectFiles.js)
        .pipe(jshint())
        .pipe(jshint.reporter('fail'))});

//  Json
gulp.task('lint-json', function() {
    gulp.src(projectFiles.json)
        .pipe(jsonlint())
        .pipe(jsonlint.reporter('fail'))});

//  CSS
gulp.task('lint-css', function() {
    gulp.src(projectFiles.css)
        .pipe(csslint())
        .pipe(csslint.reporter('fail'))});

//  Jade/ Pug
gulp.task('lint-jade', function() {
    gulp.src(projectFiles.jade)
        .pipe(puglint())});


//  GIT
gulp.task('test', function(){
    console.log(argv.m);
});
//  Run git add with options
gulp.task('git-add', function(){
    gulp.src('./')
        .pipe(git.add({args: '-A'}))});

//  Run git commit with options
gulp.task('git-commit', function(){
    gulp.src('./')
        .pipe(git.commit(argv.m))});

//  Push to master
gulp.task('git-push-master', function(){
    git.push('origin', 'master',
        function (err) {
            if (err) throw err;})});

//  Push to heroku
gulp.task('git-push-heroku', function(){
    git.push('origin', 'master:heroku',
        function (err) {
            if (err) throw err; })});

//  Run git pull
gulp.task('git-pull', function(){
    git.pull('origin', 'master',
        function (err) {
            if (err) throw err; })});


//  Check syntax
gulp.task( 'test-lint', ['lint-js', 'lint-json', 'lint-css', 'lint-jade']);
gulp.task( 'update-master', ['test-lint', 'git-add', 'git-commit', 'git-pull', 'git-push-master']);
gulp.task( 'update-heroku', ['test-lint', 'update-mater', 'git-push-heroku']);