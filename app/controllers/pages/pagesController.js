var config                  = require('../../../config')[APP_ENV],
    session                 = require('express-session'),
    ResponseUtils           = require('../../utils/utils'),
    md5                     = require('MD5'),
    path                    = require('path'),
    async                   = require("async"),
    fs                      = require('fs'),
    generateRoomName        = require('password-generator'),
    ObjectId                = require('mongodb').ObjectID;


var PagesController = function() {};

PagesController.prototype.mainPage =  function (request, response) {
    response.render( path.resolve('public/views/pages/main/index.jade'), {
        title       : "RICHSTONE: index page"
    });
    response.end();
};

module.exports = new PagesController();
