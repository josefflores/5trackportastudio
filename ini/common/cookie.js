/**
 *  @file   cookie.js
 *
 *  The configuration file for cookies.
 */

//  Requires

var root            = global.app.root

//  Database configurations
var cookie = {
    options: {
        path:"/"//,
        //domain: "",
        //secure: false,
        //httpOnly: "",
        //firstPartyOnly: true
    },
    ts: {
        user: 'ts_user_id',
        session: 'ts_user_session'
    },
    secret: process.env.TS_COOKIE_SECRET
};

//  Export content
module.exports = cookie;