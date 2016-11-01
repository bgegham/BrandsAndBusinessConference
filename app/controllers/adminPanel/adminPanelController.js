var config                  = require('../../../config')[APP_ENV],
    session                 = require('express-session'),
    ResponseUtils           = require('../../utils/utils'),
    md5                     = require('MD5'),
    path                    = require('path'),

    Admin                   = require('../../models/Admin'),
    User                    = require('../../models/User'),
    Agenda                  = require('../../models/Agenda'),
    Partner                 = require('../../models/Partner'),
    Speaker                 = require('../../models/Speaker'),
    About                   = require('../../models/About'),

    async                   = require("async"),
    fs                      = require('fs'),
    generateRoomName        = require('password-generator'),
    ObjectId                = require('mongodb').ObjectID;

var AdminPanelController = function() {};
// login flow
AdminPanelController.prototype.get_login =  function (request, response) {
    response.render( path.resolve('public/views/adminPages/auth/login.jade'), {
        title       : "Brands & Business: admin login page"
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
AdminPanelController.prototype.DESTROY_SESSION  = function (request, response) {

    if(request.session.admin){
        request.session.destroy();
        ResponseUtils.send(response, { url: '/control/admin/login' });
    } else {
        ResponseUtils.send(response, { url: '/control/admin/login' });
    }

};

// private pages

// dashboard
AdminPanelController.prototype.get_dashboard    = function (request, response) {
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
                Partner.count({}, function (err, count) {
                    soldPartners = count;
                }).then(function () {
                    Speaker.count({}, function (err, count) {
                        totalSpeakers = count;
                    }).then(function () {

                        response.render( path.resolve('public/views/adminPages/dashboard/view.jade'), {
                            title               : "Brands & Business: admin dashboard",
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
        response.redirect('/control/admin/login');
        response.end();
    }
};

// about
AdminPanelController.prototype.get_about        = function (request, response) {
    if(request.session.admin){

        About.find({})
            .sort({"created_at":-1})
            .exec(function (err, aboutText) {
            if(err){
                response.redirect('/control/admin/dashboard');
                response.end();
            } else {
                response.render( path.resolve('public/views/adminPages/about/about.jade'), {
                    title               : "Brands & Business: admin about text",
                    active_menu         : "about",
                    username            : request.session.admin.username,
                    about               : aboutText
                });
                response.end();
            }
        });


    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};
AdminPanelController.prototype.add_about        = function (request, response) {
    if(request.session.admin){
        var _about            = new About();
            _about.text       = request.body.about;

        _about.save(function(err) {
            if (err) {
                response.render( path.resolve('public/views/adminPages/about/about.jade'), {
                    title               : "Brands & Business: admin about text",
                    active_menu         : "about",
                    username            : request.session.admin.username,
                    oldVal              : request.body,
                    errors              : err.errors
                });
                response.end();
            } else {
                response.cookie('snm', "About text successfully added!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/about');
                response.end();
            }
        });


    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};
AdminPanelController.prototype.delete_about     = function (request, response) {
    if(request.session.admin){

        About.findOne({_id: request.body.id}).exec(function (err, _about) {
           if(err) {
               response.cookie('snm', "Can't Delete Text...", { maxAge: 900000, httpOnly: false });
               response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
               response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
               response.redirect('/control/admin/about');
               response.end();
           } else {
               _about.remove();
               response.cookie('snm', "About text successfully deleted!", { maxAge: 900000, httpOnly: false });
               response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
               response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
               response.redirect('/control/admin/about');
               response.end();

           }
        });

    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};

// subscribers
AdminPanelController.prototype.get_subscribers  = function (request, response) {
    if(request.session.admin){

        User.find({})
            .sort({"created_at":-1})
            .exec(function (err, _users) {
                if(err){
                    response.redirect('/control/admin/dashboard');
                    response.end();
                } else {
                    response.render( path.resolve('public/views/adminPages/subscribers/subscribers.jade'), {
                        title               : "Brands & Business: admin subscribers",
                        active_menu         : "subscribers",
                        username            : request.session.admin.username,
                        subscribers         : _users
                    });
                    response.end();
                }
            });


    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};

// partners
AdminPanelController.prototype.get_partners     = function (request, response) {
    if(request.session.admin){

        Partner.find({})
            .sort({"priority": 1})
            .exec(function (err, _partners) {
                if(err){
                    response.redirect('/control/admin/dashboard');
                    response.end();
                } else {
                    response.render( path.resolve('public/views/adminPages/partners/partners.jade'), {
                        title               : "Brands & Business: admin partners",
                        active_menu         : "partners",
                        username            : request.session.admin.username,
                        partners            : _partners
                    });
                    response.end();
                }
            });


    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};
AdminPanelController.prototype.add_partners     = function (request, response) {
    if(request.session.admin){

        response.render( path.resolve('public/views/adminPages/partners/add.jade'), {
            title       : "Brands & Business: admin partners add",
            menu        : "partners",
            partner     : false,
            errors      : false
        });
        response.end();

    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};
AdminPanelController.prototype.create_partner     = function (request, response) {
    if(request.session.admin){

        var _partner        = new Partner();
            _partner.name   = request.body.name;


        if (_partner.name && request.file) {

            var mimeType = request.file.mimetype;

            if (mimeType.lastIndexOf('image/') === 0) {

                var gfs = GRIDFS(CONNECTION.db);
                var writeStream = gfs.createWriteStream({
                    filename: request.file.originalname
                });
                fs.createReadStream(ROOT_DIR + request.file.path).pipe(writeStream);

                writeStream.on('close', function (file) {

                    _partner.avatar = file._id;

                    _partner.save(function(err) {
                        if (err) {

                            response.cookie('snm', "Partner not added!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/partners/add');
                            fs.unlink(ROOT_DIR + request.file.path);
                            response.end();

                        } else {
                            response.cookie('snm', "Partner successfully added!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/partners/add');
                            fs.unlink(ROOT_DIR + request.file.path);
                            response.end();
                        }
                    });
                });
            } else {
                response.cookie('snm', "Partner not added! wrong image type", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/partners/add');
                response.end();
            }
        } else{
            response.cookie('snm', "Partner not added! wrong image type or name", { maxAge: 900000, httpOnly: false });
            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
            response.redirect('/control/admin/partners/add');
            response.end();
        }

    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};
AdminPanelController.prototype.delete_partner     = function (request, response) {
    if(request.session.admin){

        Partner.findOne({_id: request.body.id }).exec(function(err, _partner) {
            if (err) {
                response.cookie('snm', "Can't Delete partner...", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/partners');
                response.end();
            } else {

                //remove file
                var gfs = GRIDFS(CONNECTION.db);
                gfs.remove({
                    _id :  request.body.image_id
                }, function (err) {
                    if (err) return console.log(err);
                });

                _partner.remove();

                response.cookie('snm', "Partner successfully deleted!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/partners');
                response.end();

            }
        });

    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};


module.exports = new AdminPanelController();