/**
 *  @file   gulpfile.js
 *
 *  This file holds the gulp task scripts, it is the task runner.
 *
 *  to view operations that can be performed run
 *      gulp help
 */

//  INCLUDES
var argv = require('yargs')
    .argv;
var yaml = require('yamljs');
var path = require('path');
var mkdirp = require('mkdirp');
var exec = require('child_process')
    .exec;
var jshint = require('gulp-jshint');
var jsonlint = require("gulp-jsonlint");
var csslint = require('gulp-csslint');
var jadelint = require('gulp-jadelint');
var rm = require('gulp-rm');
var git = require('gulp-git');
var beautify_js = require('gulp-jsbeautify');
var beautify_css = require('gulp-cssbeautify');
var jsonFormat = require('gulp-json-format');

//  Get application root directory and system mode
var root = path.resolve(__dirname);
global.app = require('./server/lib/Global.js')('gulp', root);
var ini = require(global.app.ini()); //  configuration object

//  LOCAL INCLUDES
var errorGulp = require(ini.path.errorGulp);

//  VARIABLES
var cfgMongoDB = yaml.load(ini.path.projectFiles.mongodb.cfg);

//  START GULP WITH HELP
var gulp = require('gulp-help')(require('gulp'), ini.opt.help);

//  CODE FORMATTERS

//  JavaScript
gulp.task('code.format.js', "Formats JS code.", [],
    function () {
        return gulp.src(ini.path.projectFiles.js.loc, ini.opt.inPlace)
            .pipe(beautify_js(require(ini.path.projectFiles.js.format)))
            .pipe(gulp.dest('./'));
    });
//  CSS
gulp.task('code.format.css', "Formats CSS code.", [],
    function () {
        return gulp.src(ini.path.projectFiles.css.loc, ini.opt.inPlace)
            .pipe(beautify_css(require(ini.path.projectFiles.css.format)))
            .pipe(gulp.dest('./'));
    });
//  JSON
gulp.task('code.format.json', "Formats JSON code.", [],
    function () {
        return gulp.src(ini.path.projectFiles.json.loc, ini.opt.inPlace)
            .pipe(jsonFormat(4))
            .pipe(gulp.dest('./'));
    });

//  CODE LINTERS

//  JavaScript
gulp.task('code.lint.js', 'Checks JS syntax.', [],
    function () {
        return gulp.src(ini.path.projectFiles.js.loc)
            .pipe(jshint())
            .pipe(jshint.reporter());
    });
//  Json
gulp.task('code.lint.json', 'Checks json syntax.', [],
    function () {
        return gulp.src(ini.path.projectFiles.json.loc)
            .pipe(jsonlint())
            .pipe(jsonlint.reporter());
    });
//  CSS
gulp.task('code.lint.css', 'Checks css syntax.', [],
    function () {
        return gulp.src(ini.path.projectFiles.css.loc)
            .pipe(csslint(require(ini.path.projectFiles.css.linter)))
            .pipe(csslint.reporter())
            .pipe(csslint.failReporter());
    });
//  Jade/ Pug
gulp.task('code.lint.jade', 'Checks jade/pug syntax.', [],
    function () {
        return gulp
            .src(ini.path.projectFiles.jade.loc)
            .pipe(jadelint(require(ini.path.projectFiles.jade.linter)));
    });

//  GIT TASKS

//  Remove git lock file
gulp.task('git.rm.lock', false, [],
    function () {
        return gulp.src('/.git/index.lock', ini.opt.git.lock)
            .pipe(rm());
    });
//  Store Credentials
gulp.task('git.cred.store', 'Tell git to store your credentials.', [],
    function () {
        var cmdStr = 'git config --global credential.helper store';
        exec(cmdStr, errorGulp.exec);
    });
//  Run git add with -A option
gulp.task('git.add', false, ['code.prepare', 'git.rm.lock'],
    function () {
        return gulp.src('./')
            .pipe(git.add(ini.opt.git.add));
    });
//  Run git commit with -m option
gulp.task('git.commit', false, ['git.add'],
    function () {
        var message = argv.m ? argv.m : 'Pushing with Gulp.';
        return gulp.src('./')
            .pipe(git.commit(message));
    }, ini.opt.git.commit);
//  Run git pull
gulp.task('git.pull', false, ['git.commit'],
    function () {
        return git.pull('origin', 'master', errorGulp.git);
    });
//  Push to master
gulp.task('git.push.master', false, ['git.pull'],
    function () {
        return git.push('origin', 'master', errorGulp.git);
    });
//  Push to heroku
gulp.task('git.push.heroku', false, ['git.push.master'],
    function () {
        return git.push('origin', 'master:heroku', errorGulp.git);
    });

//  WINDOWS SERVICES

//  Show translated configuration file to json
gulp.task('service.mongodb.show.config', false, [],
    function () {
        console.log(cfgMongoDB);
    });
//  Create necessary directories
gulp.task('service.mongodb.create.dirs', false, [],
    function () {
        var mpath = cfgMongoDB.systemLog.path.split('\\');
        mpath.pop();
        mkdirp(cfgMongoDB.storage.dbPath);
        mkdirp(mpath.join('\\'));
    });
//  Create MongoDB service
gulp.task('service.mongodb.create', false, ['service.mongodb.create.dirs'],
    function (cb) {
        var cmdStr = 'mongod.exe --config ' + ini.path.projectFiles.mongodb.cfg + ' --install';
        exec(cmdStr, errorGulp.exec);
    });
//  Stop MongoDB service
gulp.task('service.mongodb.stop', false, [],
    function (cb) {
        var cmdStr = 'net stop ' + cfgMongoDB.processManagement.windowsService.serviceName;
        exec(cmdStr, errorGulp.exec);
    });
//  Start MongoDB service
gulp.task('service.mongodb.start', false, [],
    function (cb) {
        var cmdStr = 'net start ' + cfgMongoDB.processManagement.windowsService.serviceName;
        exec(cmdStr, errorGulp.exec);
    });
//  Remove MongoDB service
gulp.task('service.mongodb.remove', false, ['service.mongodb.stop'],
    function (cb) {
        var cmdStr = 'sc.exe delete ' + cfgMongoDB.processManagement.windowsService.serviceName;
        exec(cmdStr, errorGulp.exec);
    });

//  DISPLAYED ROUTINES

//  MongoDB
gulp.task('mongodb.config', 'Shows the MongoDB config file in json.', ['service.mongodb.show.config']);
gulp.task('mongodb.create', 'Creates MongoDB service on windows.', ['service.mongodb.create']);
gulp.task('mongodb.start', 'Starts MongoDB service on windows.', ['service.mongodb.start']);
gulp.task('mongodb.stop', 'Stops MongoDB service on windows.', ['service.mongodb.stop']);
gulp.task('mongodb.delete', 'Removes MongoDB service on windows.', ['service.mongodb.remove']);

//  Code scripts
gulp.task('code.lint', 'Performs all syntax tests', ['code.lint.js', 'code.lint.json', 'code.lint.css', 'code.lint.jade']);
gulp.task('code.format', 'Formats code base', ['code.format.js', 'code.format.css', 'code.format.json']);
gulp.task('code.prepare', 'Checks and formats code base', ['code.format', 'code.lint']);

//  Git updates
gulp.task('git.error', 'Handle commong Git errors', ['git.rm.lock']);
gulp.task('git.master', 'Pushes code to master branch.', ['git.push.master'], function () {}, {
    options: {
        'm="message"': 'Commit message to use.'
    }
});
gulp.task('git.heroku', 'Pushes code to master branch, heroku branch, and deploys to heroku.', ['git.push.heroku'], function () {}, {
    options: {
        'm="message"': 'Commit message to use.'
    }
});