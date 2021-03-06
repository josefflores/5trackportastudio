/**
 *  The configuration file for absolute paths.
 *
 *  @name   paths.js
 */

//  REQUIRES

var path = require('path');

//  VARIABLES

var root = global.app.root;

//  File and Directory Paths
var paths = {
    angular: path.join(root, 'node_modules', 'angular'),
    api: path.join(root, 'server', 'routes', 'api'),
    apiHandler: path.join(root, 'server', 'lib', 'Api'),
    bootstrap: path.join(root, 'node_modules', 'bootstrap', 'dist'),
    ctrl: path.join(root, 'server', 'mvc', 'controllers'),
    documents: path.join(root, 'doc'),
    models: path.join(root, 'server', 'mvc', 'models'),
    error: path.join(root, 'server', 'lib', 'ErrorHandler'),
    images: path.join(root, 'www', 'app', 'img'),
    jquery: path.join(root, 'node_modules', 'jquery', 'dist'),
    jquerycolor: path.join(root, 'node_modules', 'jquery-color-animation'),
    jqueryui: path.join(root, 'node_modules', 'jquery-ui'),
    jqueryvalidation: path.join(root, 'node_modules', 'jquery-validation', 'dist'),
    jscookie: path.join(root, 'node_modules', 'js-cookie', 'src'),
    nodeModules: path.join(root, 'node_modules'),
    lib: path.join(root, 'server', 'lib'),
    mongodb: path.join(root, 'server', 'lib', 'mongodb'),
    mixin: path.join(root, 'server', 'mvc', 'views', 'mixin'),
    private: path.join(root, 'server'),
    public: path.join(root, 'www'),
    projectFiles: {
        css: {
            format: path.join(root, 'ini', 'format', 'css.json'),
            linter: path.join(root, 'ini', 'linter', 'css.json'),
            loc: [
                path.join(root, 'bin', '**', '*.css'),
                path.join(root, 'doc', '**', '*.css'),
                path.join(root, 'ini', '**', '*.css'),
                path.join(root, 'server', '**', '*.css'),
                path.join(root, 'www', 'app', '**', '*.css'),
                path.join(root, '*.css'),
            ],
        },
        jade: {
            format: path.join(root, 'ini', 'format', 'jade.json'),
            linter: path.join(root, 'ini', 'linter', 'jade.json'),
            loc: [
                path.join(root, 'bin', '**', '*.jade'),
                path.join(root, 'doc', '**', '*.jade'),
                path.join(root, 'ini', '**', '*.jade'),
                path.join(root, 'server', '**', '*.jade'),
                path.join(root, 'www', 'app', '**', '*.jade'),
                path.join(root, '*.jade'),
            ]
        },
        json: {
            format: path.join(root, 'ini', 'format', 'json.json'),
            linter: path.join(root, 'ini', 'linter', 'json.json'),
            loc: [
                path.join(root, 'bin', '**', '*.json'),
                path.join(root, 'ini', '**', '*.json'),
                path.join(root, 'doc', '**', '*.json'),
                path.join(root, 'server', '**', '*.json'),
                path.join(root, 'www', 'app', '**', '*.json'),
                path.join(root, '*.json'),
            ]
        },
        js: {
            format: path.join(root, 'ini', 'format', 'js.json'),
            linter: path.join(root, 'ini', 'linter', 'js.json'),
            loc: [
                path.join(root, 'bin', '**', '*.js'),
                path.join(root, 'ini', '**', '*.js'),
                path.join(root, 'doc', '**', '*.js'),
                path.join(root, 'server', '**', '*.js'),
                path.join(root, 'www', 'app', '**', '*.js'),
                path.join(root, '*.js')
            ]
        },
        mongodb: {
            cfg: path.join(root, 'ini', 'mongodb.cfg'),
            exe: path.join('C:', 'Program Files', 'MongoDB', 'Server', '3.2', 'bin', 'mongod.exe')
        }
    },
    root: root,
    routes: path.join(root, 'server', 'routes', 'paths'),
    security: path.join(root, 'server', 'lib', 'Security'),
    users: path.join(root, 'server', 'routes', 'users'),
    template: path.join(root, 'server', 'mvc', 'views', 'template'),
    tripjs: path.join(root, 'node_modules', 'trip.js', 'dist'),
    views: path.join(root, 'server', 'mvc', 'views', 'jade'),
    ejs: path.join(root, 'server', 'mvc', 'views', 'ejs')
};

//  Export content
module.exports = paths;