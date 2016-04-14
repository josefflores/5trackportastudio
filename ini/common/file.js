/**
 *  The configuration file for mapping documents.
 *
 *  @name   file.js
 */

//  REQUIRES

var path = require('path');
var paths = require('./paths.js');

//  File alias and mime descriptions
var files = {
    docs: [{
        alias: 'doc-readme',
        ext: 'md',
        mime: 'text/markdown',
        sys: path.join(paths.documents, 'readme.md')
    }, {
        alias: 'memo',
        ext: 'pdf',
        mime: 'application/pdf',
        sys: path.join(paths.documents, 'memo','Memo-trackstudio-Anderson-Cabrall-Flores-Meza.pdf')
    }, {
        alias: 'readme',
        ext: 'md',
        mime: 'text/markdown',
        sys: path.join(paths.root, 'readme.md')
    }, {
        alias: 'proposal',
        ext: 'pdf',
        mime: 'application/pdf',
        sys: path.join(paths.documents, 'proposal','Proposal-trackstudio-Anderson-Cabrall-Flores-Meza.pdf')
    }, {
        alias: 'fx-catalog',
        ext: 'json',
        mime: 'application/json',
        sys: path.join(paths.models, 'effects.json')
    }],
    favicon: path.join(paths.images, 'favicon-black.ico')
};

//  Export content
module.exports = files;