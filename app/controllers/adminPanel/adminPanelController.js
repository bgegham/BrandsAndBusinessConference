var config                  = require('../../../config')[APP_ENV],
    session                 = require('express-session'),
    ResponseUtils           = require('../../utils/utils'),
    md5                     = require('MD5'),
    path                    = require('path'),
    Admin                   = require('../../models/Admin'),
    async                   = require("async"),
    fs                      = require('fs'),
    generateRoomName        = require('password-generator'),
    ObjectId                = require('mongodb').ObjectID;

var AdminPanelController = function() {};

AdminPanelController.prototype.get_login =  function (request, response) {
    response.render( path.resolve('public/views/adminPages/auth/login.jade'), {
        title       : "RICHSTONE: admin login page"
    });
    response.end();
};

AdminPanelController.prototype.CREATE_SESSION = function (request, response) {

    var errorMessage    = 'Login failed, please try again.',
        username        = request.body.username,
        password        = request.body.password;

    Admin.findOne({ username: username }).exec( function (err, admin) {
        if (admin == null) {
            ResponseUtils.badRequest(response, errorMessage);
        } else {
            if (admin.password === md5(password)) {
                request.session.admin = admin;
                ResponseUtils.send(response, { url: '/control/admin/dashboard' });

            } else {
                ResponseUtils.badRequest(response, errorMessage);
            }
        }
    });

};

AdminPanelController.prototype.DESTROY_SESSION = function (request, response) {

    if(request.session.admin){
        request.session.destroy();
        ResponseUtils.send(response, { url: '/control/admin/login' });
    } else {
        ResponseUtils.send(response, { url: '/control/admin/login' });
    }

};

// private pages
AdminPanelController.prototype.get_dashboard = function (request, response) {
    if(request.session.admin){

        var totalUsers           = 0,
            totalAgenda          = 0,
            soldPartners         = 0,
            totalSpeakers        = 0;

        User.count({}, function (err, count) {
            totalUsers = count;
        }).then(function () {
            Agenda.count({}, function (err, count) {
                totalAgenda = count;
            }).then(function () {
                Partners.count({}, function (err, count) {
                    soldPartners = count;
                }).then(function () {
                    Speakers.count({}, function (err, count) {
                        totalSpeakers = count;
                    }).then(function () {

                        response.render( path.resolve('public/views/adminPages/dashboard/view.jade'), {
                            title               : "RICHSTONE: admin dashboard",
                            active_menu         : "dashboard",
                            username            : request.session.admin.username,
                            totalUsers          : totalUsers,
                            totalAgenda         : totalAgenda,
                            soldPartners        : soldPartners,
                            totalSpeakers       : totalSpeakers
                        });
                        response.end();
                    });
                });

            });
        });

    } else {
        response.redirect('/login');
        response.end();
    }
};



module.exports = new AdminPanelController();