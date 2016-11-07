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
    Slider                  = require('../../models/Slider'),

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
            username    : request.session.admin.username,
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

        var _partner            = new Partner();
            _partner.name       = request.body.name;
            _partner.link       = request.body.link;
            _partner.priority   = request.body.priority;


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

// slider
AdminPanelController.prototype.get_slider        = function (request, response) {
    if(request.session.admin){

        Slider.find({})
            .sort({"priority": 1})
            .exec(function (err, _slider) {
                if(err){
                    response.redirect('/control/admin/dashboard');
                    response.end();
                } else {
                    response.render( path.resolve('public/views/adminPages/slider/slider.jade'), {
                        title               : "Brands & Business: admin slider images",
                        active_menu         : "slider",
                        username            : request.session.admin.username,
                        slider              : _slider
                    });
                    response.end();
                }
            });


    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};
AdminPanelController.prototype.add_slider        = function (request, response) {
    if(request.session.admin){

        response.render( path.resolve('public/views/adminPages/slider/add.jade'), {
            title       : "Brands & Business: admin slider images add",
            menu        : "slider",
            username    : request.session.admin.username,
            slider      : false,
            errors      : false
        });
        response.end();

    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};
AdminPanelController.prototype.create_slider        = function (request, response) {
    if(request.session.admin){

        var _slider                 = new Slider();
            _slider.name            = request.body.name;
            _slider.description     = request.body.description;

        if (request.file) {

            var mimeType = request.file.mimetype;

            if (mimeType.lastIndexOf('image/') === 0) {

                var gfs = GRIDFS(CONNECTION.db);
                var writeStream = gfs.createWriteStream({
                    filename: request.file.originalname
                });
                fs.createReadStream(ROOT_DIR + request.file.path).pipe(writeStream);

                writeStream.on('close', function (file) {

                    _slider.image = file._id;

                    _slider.save(function(err) {
                        if (err) {
                            response.cookie('snm', "Slider not added!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/slider/add');
                            fs.unlink(ROOT_DIR + request.file.path);
                            response.end();

                        } else {
                            response.cookie('snm', "Slider successfully added!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/slider/add');
                            fs.unlink(ROOT_DIR + request.file.path);
                            response.end();
                        }
                    });
                });
            } else {
                response.cookie('snm', "Slider not added! wrong image type", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/slider/add');
                response.end();
            }
        } else{
            response.cookie('snm', "Slide not added! select image!", { maxAge: 900000, httpOnly: false });
            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
            response.redirect('/control/admin/slider/add');
            response.end();
        }

    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};
AdminPanelController.prototype.delete_slider     = function (request, response) {
    if(request.session.admin){


        Slider.findOne({_id: request.body.id }).exec(function(err, _partner) {
            if (err) {
                response.cookie('snm', "Can't delete slider...", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/slider');
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

                response.cookie('snm', "Slider successfully deleted!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/slider');
                response.end();

            }

        });

    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};

// speakers
AdminPanelController.prototype.get_speakers     = function (request, response) {
    if(request.session.admin){

        Speaker.find({})
            .sort({"priority": 1})
            .exec(function (err, _speakers) {
                if(err){
                    response.redirect('/control/admin/dashboard');
                    response.end();
                } else {
                    response.render( path.resolve('public/views/adminPages/speakers/speakers.jade'), {
                        title               : "Brands & Business: admin speakers",
                        active_menu         : "speakers",
                        username            : request.session.admin.username,
                        speakers            : _speakers
                    });
                    response.end();
                }
            });


    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};
AdminPanelController.prototype.add_speakers     = function (request, response) {
    if(request.session.admin){

        response.render( path.resolve('public/views/adminPages/speakers/add.jade'), {
            title       : "Brands & Business: admin speakers add",
            menu        : "speakers",
            username    : request.session.admin.username,
            speaker     : false,
            errors      : false
        });
        response.end();

    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};
AdminPanelController.prototype.create_speaker     = function (request, response) {
    if(request.session.admin){

        var _speaker            = new Speaker();
            _speaker.name       = request.body.name;
            _speaker.position   = request.body.position;
            _speaker.company    = request.body.company;
            _speaker.country    = request.body.country;
            _speaker.priority   = request.body.priority;


        if (_speaker.name && request.file) {

            var mimeType = request.file.mimetype;

            if (mimeType.lastIndexOf('image/') === 0) {

                var gfs = GRIDFS(CONNECTION.db);
                var writeStream = gfs.createWriteStream({
                    filename: request.file.originalname
                });
                fs.createReadStream(ROOT_DIR + request.file.path).pipe(writeStream);

                writeStream.on('close', function (file) {

                    _speaker.avatar = file._id;

                    _speaker.save(function(err) {
                        if (err) {

                            response.cookie('snm', "Speaker not added!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/speaker/add');
                            fs.unlink(ROOT_DIR + request.file.path);
                            response.end();

                        } else {
                            response.cookie('snm', "Speaker successfully added!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/speaker/add');
                            fs.unlink(ROOT_DIR + request.file.path);
                            response.end();
                        }
                    });
                });
            } else {
                response.cookie('snm', "Speaker not added! wrong image type", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/speaker/add');
                response.end();
            }
        } else{
            response.cookie('snm', "Partner not added! wrong image type or name", { maxAge: 900000, httpOnly: false });
            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
            response.redirect('/control/admin/speaker/add');
            response.end();
        }

    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};
AdminPanelController.prototype.delete_speaker     = function (request, response) {
    if(request.session.admin){

        Speaker.findOne({_id: request.body.id }).exec(function(err, _speaker) {
            if (err) {
                response.cookie('snm', "Can't delete speaker...", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/speaker');
                response.end();
            } else {

                //remove file
                var gfs = GRIDFS(CONNECTION.db);
                gfs.remove({
                    _id :  request.body.image_id
                }, function (err) {
                    if (err) return console.log(err);
                });

                _speaker.remove();

                response.cookie('snm', "Speaker successfully deleted!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/speaker');
                response.end();

            }
        });

    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};

// agenda
AdminPanelController.prototype.get_agenda     = function (request, response) {
    if(request.session.admin){

        Agenda.find({})
            .exec(function (err, _agenda) {
                if(err){
                    response.redirect('/control/admin/agenda');
                    response.end();
                } else {
                    response.render( path.resolve('public/views/adminPages/agenda/agenda.jade'), {
                        title               : "Brands & Business: admin agenda",
                        active_menu         : "agenda",
                        username            : request.session.admin.username,
                        agenda              : _agenda
                    });
                    response.end();
                }
            });


    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};
AdminPanelController.prototype.add_agenda     = function (request, response) {
    if(request.session.admin){

        response.render( path.resolve('public/views/adminPages/agenda/add.jade'), {
            title       : "Brands & Business: admin agenda add",
            menu        : "agenda",
            username    : request.session.admin.username,
            agenda      : false,
            errors      : false
        });
        response.end();

    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};
AdminPanelController.prototype.create_agenda     = function (request, response) {
    if(request.session.admin){

        var _speaker            = new Speaker();
        _speaker.name       = request.body.name;
        _speaker.position   = request.body.position;
        _speaker.company    = request.body.company;
        _speaker.country    = request.body.country;
        _speaker.priority   = request.body.priority;


        if (_speaker.name && request.file) {

            var mimeType = request.file.mimetype;

            if (mimeType.lastIndexOf('image/') === 0) {

                var gfs = GRIDFS(CONNECTION.db);
                var writeStream = gfs.createWriteStream({
                    filename: request.file.originalname
                });
                fs.createReadStream(ROOT_DIR + request.file.path).pipe(writeStream);

                writeStream.on('close', function (file) {

                    _speaker.avatar = file._id;

                    _speaker.save(function(err) {
                        if (err) {

                            response.cookie('snm', "Speaker not added!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/speaker/add');
                            fs.unlink(ROOT_DIR + request.file.path);
                            response.end();

                        } else {
                            response.cookie('snm', "Speaker successfully added!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/speaker/add');
                            fs.unlink(ROOT_DIR + request.file.path);
                            response.end();
                        }
                    });
                });
            } else {
                response.cookie('snm', "Speaker not added! wrong image type", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/speaker/add');
                response.end();
            }
        } else{
            response.cookie('snm', "Partner not added! wrong image type or name", { maxAge: 900000, httpOnly: false });
            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
            response.redirect('/control/admin/speaker/add');
            response.end();
        }

    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};
AdminPanelController.prototype.delete_agenda     = function (request, response) {
    if(request.session.admin){

        Speaker.findOne({_id: request.body.id }).exec(function(err, _speaker) {
            if (err) {
                response.cookie('snm', "Can't delete speaker...", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/speaker');
                response.end();
            } else {

                //remove file
                var gfs = GRIDFS(CONNECTION.db);
                gfs.remove({
                    _id :  request.body.image_id
                }, function (err) {
                    if (err) return console.log(err);
                });

                _speaker.remove();

                response.cookie('snm', "Speaker successfully deleted!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/speaker');
                response.end();

            }
        });

    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};


module.exports = new AdminPanelController();