/**
 *  @file   about.js
 *
 *  This file holds the GET controller for the About page.
 */

var path    = require('path');
var ini     = require(global.app.ini());

var index = function(req, res) {

    res.render(path.join(ini.path.partial, 'index'), { title: 'GUI II Project - About' });

} ;

//  Export content
module.exports.index = index;