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

PagesController.prototype.mainPage      =  function (request, response) {
    response.render( path.resolve('public/views/pages/main/index.jade'), {
        title       : "Brands & Business: index page"
    });
    response.end();
};

PagesController.prototype.pageNotFound  =  function (request, response) {
    response.render( path.resolve('public/views/errors/404.jade'), {
        title           : "Brands & Business: PAGE NOT FOUND"
    });
    response.end();
};

PagesController.prototype.imageShow     =  function (request, response) {
    var gfs = GRIDFS(CONNECTION.db);
    gfs.exist( { _id: request.params.id }, function (err, found) {
        if (err || !found) {
            ResponseUtils.notFound(response);
        } else {
            var readStream = gfs.createReadStream({ _id: request.params.id });
            readStream.pipe(response);
        }
    });
};



module.exports = new PagesController();
