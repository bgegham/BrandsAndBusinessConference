var config                  = require('../../../config')[APP_ENV],
    session                 = require('express-session'),
    ResponseUtils           = require('../../utils/utils'),
    md5                     = require('MD5'),
    path                    = require('path'),

    Admin                   = require('../../models/Admin'),
    User                    = require('../../models/User'),
    Agenda                  = require('../../models/Agenda'),
    Workshop                = require('../../models/Workshop'),
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
AdminPanelController.prototype.get_login        = function (request, response) {
    response.render( path.resolve('public/views/adminPages/auth/login.jade'), {
        title       : "Brands & Business: admin login page"
    });
    response.end();
};
AdminPanelController.prototype.CREATE_SESSION   = function (request, response) {

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
            .exec(function (err, aboutText) {
            if(err){
                response.redirect('/control/admin/dashboard');
                response.end();
            } else {
                response.render( path.resolve('public/views/adminPages/about/about.jade'), {
                    title               : "Brands & Business: admin about text",
                    active_menu         : "about",
                    username            : request.session.admin.username,
                    oldVal              : aboutText[0]
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

        About.findOne({_id : request.body._id}).exec(function (err, updateAbout) {
            if(err){
                console.log(request.body._id)
            } else {
                updateAbout.text1 = request.body.text1;
                updateAbout.text2 = request.body.text2;
                updateAbout.text3 = request.body.text3;
                updateAbout.text4 = request.body.text4;

                updateAbout.save(function (err) {
                    if(err){
                        response.cookie('snm', "About text not updated!", { maxAge: 900000, httpOnly: false });
                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                        response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                        response.redirect('/control/admin/about');
                        response.end();
                    } else {
                        response.cookie('snm', "About text successfully updated!", { maxAge: 900000, httpOnly: false });
                        response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                        response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                        response.redirect('/control/admin/about');
                        response.end();
                    }
                });
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
AdminPanelController.prototype.create_partner   = function (request, response) {
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
AdminPanelController.prototype.delete_partner   = function (request, response) {
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
AdminPanelController.prototype.get_slider       = function (request, response) {
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
AdminPanelController.prototype.add_slider       = function (request, response) {
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
AdminPanelController.prototype.create_slider    = function (request, response) {
    if(request.session.admin){

        var _slider                 = new Slider();
            _slider.name            = request.body.name;
            _slider.description     = request.body.description;
            _slider.priority        = request.body.priority;

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
AdminPanelController.prototype.delete_slider    = function (request, response) {
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
        Speaker.find()
            .sort({"priority": 1})
            .exec(function (err, speakersData) {
                if(err){
                    response.redirect('/control/admin/dashboard');
                    response.end();
                } else {
                    response.render( path.resolve('public/views/adminPages/speakers/speakers.jade'), {
                        title               : "Brands & Business: admin speakers",
                        active_menu         : "speakers",
                        username            : request.session.admin.username,
                        speakersData        : speakersData
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
AdminPanelController.prototype.edit_speakers    = function (request, response) {
    if(request.session.admin){

        Speaker.findOne({_id : request.params.id}).exec(function (err, _speaker) {
            if(_speaker){
                response.render( path.resolve('public/views/adminPages/speakers/edit.jade'), {
                    title       : "Brands & Business: admin speaker edit",
                    menu        : "speakers",
                    username    : request.session.admin.username,
                    speaker     : _speaker,
                    oldVal      : _speaker,
                    errors      : false
                });
                response.end();
            } else{
                console.log(err);
                response.render( path.resolve('public/views/errors/404.jade'), {
                    title           : "Brands & Business: PAGE NOT FOUND"
                });
                response.end();
            }
        });

    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};
AdminPanelController.prototype.update_speakers  = function (request, response) {
    if(request.session.admin){

        var currentSpeaker    = Object();
        var errors            = Object();
        var hasError          = false;

        Speaker.findOne( { _id: request.params.id } , function (err, _speaker) {
            currentSpeaker = _speaker;
            if (!_speaker) {
                errors.general = 'Speaker not exists.';
                hasError = true;
            }
        }).then(function (_speaker) {

            if(!hasError){

                currentSpeaker.tab_country  = request.body.tab_country;
                currentSpeaker.name         = request.body.name;
                currentSpeaker.tab_country  = request.body.tab_country;
                currentSpeaker.position     = request.body.position;
                currentSpeaker.company      = request.body.company;
                currentSpeaker.country      = request.body.country;
                currentSpeaker.priority     = request.body.priority;

                if(request.file){
                    var mimeType        = request.file.mimetype;

                    if (mimeType.lastIndexOf('image/') === 0) {
                        var gfs = GRIDFS(CONNECTION.db);
                        var writeStream = gfs.createWriteStream({
                            filename: request.file.originalname
                        });
                        fs.createReadStream(ROOT_DIR + request.file.path).pipe(writeStream);

                        writeStream.on('close', function (file) {
                            if (currentSpeaker.avatar) {
                                gfs.remove({ _id: currentSpeaker.avatar });
                            }
                            currentSpeaker.avatar = file._id;
                            fs.unlink(ROOT_DIR + request.file.path);
                            _save();
                        });
                    } else {
                        errors.image = "Wrong image type.";
                        hasError = true;
                        _save();
                    }
                } else {
                    _save();
                }

                function _save() {
                    if(hasError){
                        response.render( path.resolve('public/views/adminPages/speakers/edit.jade'), {
                            title       : "Brands & Business: admin speaker edit",
                            menu        : "speakers",
                            username    : request.session.admin.username,
                            speaker     : currentSpeaker,
                            errors      : errors,
                            oldVal      : request.body
                        });
                        response.end();
                    }else {

                        currentSpeaker.save( function(err) {
                            if (err) {
                                response.render( path.resolve('public/views/adminPages/speakers/edit.jade'), {
                                    title       : "Brands & Business: admin speaker edit",
                                    menu        : "speakers",
                                    username    : request.session.admin.username,
                                    speaker     : currentSpeaker,
                                    errors      : err.errors,
                                    oldVal      : request.body
                                });
                                response.end();
                            } else {
                                response.cookie('snm', "Speaker successfully updated!", { maxAge: 900000, httpOnly: false });
                                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                                response.redirect('/control/admin/speaker/edit/'+request.params.id);
                                response.end();
                            }
                        });
                    }

                }


            } else {
                response.redirect('/admin/brilliants/edit/'+request.params.id);
                response.end();
            }

        });


    } else {
        response.redirect('/login');
        response.end();
    }

};
AdminPanelController.prototype.create_speaker   = function (request, response) {
    if(request.session.admin){

        var _speaker                = new Speaker();
            _speaker.name           = request.body.name;
            _speaker.tab_country    = request.body.tab_country;
            _speaker.position       = request.body.position;
            _speaker.company        = request.body.company;
            _speaker.country        = request.body.country;
            _speaker.priority       = request.body.priority;


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
AdminPanelController.prototype.delete_speaker   = function (request, response) {
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
AdminPanelController.prototype.get_agenda       = function (request, response) {
    if(request.session.admin){

        Agenda.find({date:"24/11/2016"})
            .sort({"priority" : 1})
            .exec(function (err, _agenda24) {
                if(err){
                    response.redirect('/control/admin/agenda');
                    response.end();
                } else {

                    Agenda.find({date:"26/11/2016"})
                        .sort({"priority" : 1})
                        .exec(function (err, _agenda26) {
                            if(err){
                                response.redirect('/control/admin/agenda');
                                response.end();
                            } else {

                                response.render( path.resolve('public/views/adminPages/agenda/agenda.jade'), {
                                    title               : "Brands & Business: admin agenda",
                                    active_menu         : "agenda",
                                    username            : request.session.admin.username,
                                    _agenda24           : _agenda24,
                                    _agenda26           : _agenda26
                                });
                                response.end();
                            }
                        });

                }
            });


    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};
AdminPanelController.prototype.add_agenda       = function (request, response) {
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
AdminPanelController.prototype.edit_agenda      = function (request, response) {
    if(request.session.admin){

        Agenda.findOne({_id : request.params.id}).exec(function (err, agenda) {
            if(agenda){
                response.render( path.resolve('public/views/adminPages/agenda/edit.jade'), {
                    title       : "Brands & Business: admin agenda edit",
                    menu        : "agenda",
                    username    : request.session.admin.username,
                    agenda      : agenda,
                    errors      : false
                });
                response.end();
            } else{
                console.log(err);
                response.render( path.resolve('public/views/errors/404.jade'), {
                    title           : "Brands & Business: PAGE NOT FOUND"
                });
                response.end();
            }
        });

    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};
AdminPanelController.prototype.create_agenda    = function (request, response) {
    if(request.session.admin){

        var _agenda            = new Agenda();
        _agenda.date       = request.body.date;
        // _agenda.place   = request.body.place;
        _agenda.label    = request.body.label;
        _agenda.time    = request.body.time;
        _agenda.color    = request.body.color;
        _agenda.bgcolor    = request.body.bgcolor;
        _agenda.date_sm   = request.body.date_sm;
        _agenda.description   = request.body.description;
        _agenda.priority   = request.body.priority;

        _agenda.speakers   = [];

        for(var i=1;i<=10;i++){
            _agenda.speakers.push(request.body["speaker"+i]);
        }


        if (_agenda.date && _agenda.label) {

            _agenda.save(function(err) {
                if (err) {

                    response.cookie('snm', "Agenda not added!", { maxAge: 900000, httpOnly: false });
                    response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                    response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                    response.redirect('/control/admin/agenda/add');
                    response.end();

                } else {
                    response.cookie('snm', "Agenda successfully added!", { maxAge: 900000, httpOnly: false });
                    response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                    response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                    response.redirect('/control/admin/agenda/add');
                    response.end();
                }
            });

            } else {
                response.cookie('snm', "Agenda not added! wrong params", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/agenda/add');
                response.end();
            }


    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};
AdminPanelController.prototype.update_agenda    = function (request, response) {
    if(request.session.admin){

        Agenda.findOne({_id : request.params.id}).exec(function (err, _agenda) {
            if(_agenda){

                // _agenda.place   = request.body.place;
                _agenda.label    = request.body.label;
                _agenda.time    = request.body.time;
                _agenda.color    = request.body.color;
                _agenda.bgcolor    = request.body.bgcolor;
                _agenda.date_sm   = request.body.date_sm;
                _agenda.description   = request.body.description;
                _agenda.priority   = request.body.priority;

                _agenda.speakers   = [];

                for(var i=1;i<=10;i++){
                    _agenda.speakers.push(request.body["speaker"+i]);
                }

                if (_agenda.label) {

                    _agenda.save(function(err) {
                        if (err) {

                            response.cookie('snm', "Agenda not updated!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/agenda/edit/'+request.params.id);
                            response.end();

                        } else {
                            response.cookie('snm', "Agenda successfully updated!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/agenda/edit/'+request.params.id);
                            response.end();
                        }
                    });

                } else {
                    response.cookie('snm', "Agenda not updated! wrong params", { maxAge: 900000, httpOnly: false });
                    response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                    response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                    response.redirect('/control/admin/agenda/edit/'+request.params.id);
                    response.end();
                }


            } else{
                console.log(err);
                response.render( path.resolve('public/views/errors/404.jade'), {
                    title           : "Brands & Business: PAGE NOT FOUND"
                });
                response.end();
            }
        });

    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};
AdminPanelController.prototype.delete_agenda    = function (request, response) {
    if(request.session.admin){

        Agenda.findOne({_id: request.body.id }).exec(function(err, _agenda) {
            if (err) {
                response.cookie('snm', "Can't delete agenda...", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/agenda');
                response.end();
            } else {

                _agenda.remove();

                response.cookie('snm', "Agenda successfully deleted!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/agenda');
                response.end();

            }
        });

    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};


// workshop
AdminPanelController.prototype.get_workshop       = function (request, response) {
    if(request.session.admin){

        Workshop.find({date:"24/11/2016"})
            .sort({"priority" : 1})
            .exec(function (err, _workshop24) {
                if(err){
                    response.redirect('/control/admin/workshop');
                    response.end();
                } else {

                    Workshop.find({date:"26/11/2016"})
                        .sort({"priority" : 1})
                        .exec(function (err, _workshop26) {
                            if(err){
                                response.redirect('/control/admin/workshop');
                                response.end();
                            } else {

                                response.render( path.resolve('public/views/adminPages/workshop/workshop.jade'), {
                                    title               : "Brands & Business: admin workshop",
                                    active_menu         : "workshop",
                                    username            : request.session.admin.username,
                                    _workshop24         : _workshop24,
                                    _workshop26         : _workshop26
                                });
                                response.end();
                            }
                        });

                }
            });


    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};
AdminPanelController.prototype.add_workshop       = function (request, response) {
    if(request.session.admin){

        response.render( path.resolve('public/views/adminPages/workshop/add.jade'), {
            title       : "Brands & Business: admin workshop add",
            menu        : "workshop",
            username    : request.session.admin.username,
            workshop    : false,
            errors      : false
        });
        response.end();

    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};
AdminPanelController.prototype.edit_workshop      = function (request, response) {
    if(request.session.admin){

        Workshop.findOne({_id : request.params.id}).exec(function (err, workshop) {
            if(workshop){
                response.render( path.resolve('public/views/adminPages/workshop/edit.jade'), {
                    title       : "Brands & Business: admin workshop edit",
                    menu        : "workshop",
                    username    : request.session.admin.username,
                    workshop    : workshop,
                    errors      : false
                });
                response.end();
            } else{
                console.log(err);
                response.render( path.resolve('public/views/errors/404.jade'), {
                    title           : "Brands & Business: PAGE NOT FOUND"
                });
                response.end();
            }
        });

    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};
AdminPanelController.prototype.create_workshop    = function (request, response) {
    if(request.session.admin){

    var _workshop           = new Workshop();
        _workshop.date      = request.body.date;
        _workshop.time      = request.body.time;
        _workshop.conducts  = request.body.conducts;
        _workshop.theme     = request.body.theme;
        _workshop.color     = request.body.color;
        _workshop.bgcolor   = request.body.bgcolor;
        _workshop.priority  = request.body.priority;


        if (_workshop.date && _workshop.date) {

            _workshop.save(function(err) {
                if (err) {

                    response.cookie('snm', "Workshop not added!", { maxAge: 900000, httpOnly: false });
                    response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                    response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                    response.redirect('/control/admin/workshop/add');
                    response.end();

                } else {
                    response.cookie('snm', "Workshop successfully added!", { maxAge: 900000, httpOnly: false });
                    response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                    response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                    response.redirect('/control/admin/Workshop/add');
                    response.end();
                }
            });

        } else {
            response.cookie('snm', "Workshop not added! wrong params", { maxAge: 900000, httpOnly: false });
            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
            response.redirect('/control/admin/workshop/add');
            response.end();
        }


    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};
AdminPanelController.prototype.update_workshop    = function (request, response) {
    if(request.session.admin){

        Workshop.findOne({_id : request.params.id}).exec(function (err, _workshop) {
            if(_workshop){

                _workshop.date      = request.body.date;
                _workshop.time      = request.body.time;
                _workshop.conducts  = request.body.conducts;
                _workshop.theme     = request.body.theme;
                _workshop.color     = request.body.color;
                _workshop.bgcolor   = request.body.bgcolor;
                _workshop.priority  = request.body.priority;

                if (_workshop.date) {

                    _workshop.save(function(err) {
                        if (err) {

                            response.cookie('snm', "Workshop not updated!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/workshop/edit/'+request.params.id);
                            response.end();

                        } else {
                            response.cookie('snm', "Workshop successfully updated!", { maxAge: 900000, httpOnly: false });
                            response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                            response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                            response.redirect('/control/admin/workshop/edit/'+request.params.id);
                            response.end();
                        }
                    });

                } else {
                    response.cookie('snm', "Workshop not updated! wrong params", { maxAge: 900000, httpOnly: false });
                    response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                    response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                    response.redirect('/control/admin/workshop/edit/'+request.params.id);
                    response.end();
                }


            } else{
                console.log(err);
                response.render( path.resolve('public/views/errors/404.jade'), {
                    title           : "Brands & Business: PAGE NOT FOUND"
                });
                response.end();
            }
        });

    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};
AdminPanelController.prototype.delete_workshop    = function (request, response) {
    if(request.session.admin){

        Workshop.findOne({_id: request.body.id }).exec(function(err, _workshop) {
            if (err) {
                response.cookie('snm', "Can't delete workshop...", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-danger", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/workshop');
                response.end();
            } else {

                _workshop.remove();

                response.cookie('snm', "Workshop successfully deleted!", { maxAge: 900000, httpOnly: false });
                response.cookie('sns', "true", { maxAge: 900000, httpOnly: false });
                response.cookie('snc', "alert-success", { maxAge: 900000, httpOnly: false });
                response.redirect('/control/admin/workshop');
                response.end();

            }
        });

    } else {
        response.redirect('/control/admin/login');
        response.end();
    }
};


module.exports = new AdminPanelController();