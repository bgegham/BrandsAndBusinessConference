var config                  = require('../../../config')[APP_ENV],
    session                 = require('express-session'),
    ResponseUtils           = require('../../utils/utils'),
    path                    = require('path'),
    async                   = require("async"),
    fs                      = require('fs'),
    moment                  = require('moment'),
    User                    = require('../../models/User'),
    Agenda                  = require('../../models/Agenda'),
    Partner                 = require('../../models/Partner'),
    Speaker                 = require('../../models/Speaker'),
    About                   = require('../../models/About'),
    Slider                  = require('../../models/Slider'),
    emailHelper             = require('sendgrid').mail,
    ObjectId                = require('mongodb').ObjectID;


var PagesController = function() {};

PagesController.prototype.mainPage      =  function (request, response) {

    Slider.find({})
        .sort({"priority" : 1})
        .exec(function (err, _slider) {
            if(err){
                console.log(err)
            }
        }).then(function (_slider) {
            Partner.find({})
                   .sort({"priority" : 1})
                   .exec(function (err,_partner) {
                       if(err){
                           console.log(err)
                       }
                   }).then(function (_partner) {
                        Speaker.find({})
                            .sort({"priority" : 1})
                            .exec(function (err,_speakers) {
                                if(err){
                                    console.log(err)
                                }
                            }).then(function (_speakers) {

                            Agenda.find({date:"24/11/2016"})
                                .sort({"priority" : 1})
                                .exec(function (err, _agenda24) {

                                Agenda.find({date:"26/11/2016"})
                                    .sort({"priority" : 1})
                                    .exec(function (err, _agenda26) {


                                    About.find({}).exec(function (err, _about) {


                                        response.render( path.resolve('public/views/pages/main/index.jade'), {
                                            title           : "Brands & Business: brands business conference 2016",
                                            _sliderData     : _slider,
                                            _partnerData    : _partner,
                                            _speakersData   : _speakers,
                                            _about          : _about[0],
                                            _agenda24          : _agenda24,
                                            _agenda26          : _agenda26
                                        });
                                        response.end();



                                    });

                                });


                            });



                        });
                    });
        });

};

PagesController.prototype.contactUs = function(request, response) {

    var firstName               = request.body.firstName;
    var lastName                = request.body.lastName;
    var phoneNumber             = request.body.phoneNumber;
    var gender                  = request.body.gender;
    var birthDate               = request.body.birthDate;
    var position                = request.body.position;
    var position_description    = request.body.position_description;
    var email                   = request.body.email;
    var ticket                  = request.body.ticket;


    var errors                     = {};
    errors.firstName               = false;
    errors.lastName                = false;
    errors.phone                   = false;
    errors.gender                  = false;
    errors.birthDate               = false;
    errors._posCheck               = false;
    errors.position_description    = false;
    errors._email                   = false;
    errors.ticket                  = false;

    function validatorEmail(value) {
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
    }

    if(validatorEmail(email)){
        errors._email = false;

    } else {
        errors._email = "Is not valid email address.";
    }
    if(firstName){
        errors.firstName = false;

    } else {
        errors.firstName = "First name is required.";
    }
    if(lastName){
        errors.lastName = false;

    } else {
        errors.lastName = "Last name is required.";
    }
    if(phoneNumber){
        errors.phone = false;

    } else {
        errors.phone = "Phone number is required.";
    }
    if(!gender){
        gender = "Male";
    }
    if(position){
        errors._posCheck = false;

    } else {
        errors._posCheck = "Position is required.";
    }
    if(position_description){
        errors._customPosText = false;

    } else {
        errors._customPosText = "Position information is required.";
    }
    if(gender){
        errors.gender = false;

    } else {
        errors.gender = "Gender information is required.";
    }
    if(birthDate){
        if(moment(birthDate,'DD.MM.YYYY').isValid()){
            errors.birthDate = false;
        } else{
            errors.birthDate = "Birth date is not valid date.";
        }
    } else {
        errors.birthDate = "Birth date is required.";
    }


    if(errors._email || errors.firstName || errors.lastName || errors.phone || errors._posCheck || errors._customPosText || errors.gender || errors.birthDate) {
        ResponseUtils.badRequest(response, errors);
    } else {
        var _user = new User();
            _user.firstName     = firstName;
            _user.lastName      = lastName;
            _user.birthDate     = birthDate;
            _user.phoneNumber   = phoneNumber;
            _user.gender        = gender;
            _user.position      = position;
            _user.position_description = position_description;
            _user.email         = email;
            _user.ticket        = ticket;

        _user.save(function (err, newUser) {
            if(err){
                console.log("Save subscriber error",err);
                ResponseUtils.badRequest(response, err.errors);
            }
        }).then(function (newUser) {
            ResponseUtils.send(response, { status: 'success' });

            //sending process
            response.render(path.resolve(global.ROOT_DIR+'public/views/email_templates/default.jade'), {
                firstName           : firstName,
                lastName            : lastName,
                phoneNumber         : phoneNumber,
                gender              : gender,
                birthDate           : birthDate,
                position            : position,
                position_description: position_description,
                email               : email,
                ticket              : ticket
            }, function(err, html){

                    var from_email  = new emailHelper.Email("purchase@ticket");
                    var to_email    = new emailHelper.Email("b.gegham@gmail.com");
                    var subject     = "Purchase ticket";
                    var content     = new emailHelper.Content('text/html', html);
                    var mail    = new emailHelper.Mail(from_email, subject, to_email, content);
                    var sg      = require('sendgrid')(config.SENDGRID_API_KEY);
                    var request = sg.emptyRequest({
                        method: 'POST',
                        path: '/v3/mail/send',
                        body: mail.toJSON()
                    });

                    sg.API(request, function(error, responseEmail) {
                        if(error){
                            console.log("error", error);
                        } else {
                            console.log("send email ------")
                        }

                    });
            });

            //sending process end
        });

    }




};

PagesController.prototype.subscribeUser = function (request, response) {
    var email                   = request.body.email;
    var _error_                 = false;
    function validatorEmail(value) {
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
    }

    if(validatorEmail(email)){
        _error_ = false;

    } else {
        _error_ = "Is not valid email address.";
    }

    if(_error_) {
        ResponseUtils.badRequest(response, _error_);
    } else {

            ResponseUtils.send(response, { status: 'success' });

            //sending process
            response.render(path.resolve(global.ROOT_DIR+'public/views/email_templates/subscribe.jade'), {
                _email_           : email
            }, function(err, html){

                var from_email  = new emailHelper.Email("subscribe@user");
                var to_email    = new emailHelper.Email("b.gegham@gmail.com");
                var subject     = "NEW SUBSCRIBER";
                var content     = new emailHelper.Content('text/html', html);
                var mail    = new emailHelper.Mail(from_email, subject, to_email, content);
                var sg      = require('sendgrid')(config.SENDGRID_API_KEY);
                var request = sg.emptyRequest({
                    method: 'POST',
                    path: '/v3/mail/send',
                    body: mail.toJSON()
                });

                sg.API(request, function(error, responseEmail) {
                    if(error){
                        console.log("error", error);
                    } else {
                        console.log("send email ------")
                    }

                });
            });

            //sending process end
    }

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
