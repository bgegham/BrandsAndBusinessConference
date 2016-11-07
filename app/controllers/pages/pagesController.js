var config                  = require('../../../config')[APP_ENV],
    session                 = require('express-session'),
    ResponseUtils           = require('../../utils/utils'),
    path                    = require('path'),
    async                   = require("async"),
    fs                      = require('fs'),

    User                    = require('../../models/User'),
    Agenda                  = require('../../models/Agenda'),
    Partner                 = require('../../models/Partner'),
    Speaker                 = require('../../models/Speaker'),
    About                   = require('../../models/About'),
    Slider                  = require('../../models/Slider'),

    ObjectId                = require('mongodb').ObjectID;


var PagesController = function() {};

PagesController.prototype.mainPage      =  function (request, response) {

    Slider.find({})
        .sort({"priority" : -1})
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

                                response.render( path.resolve('public/views/pages/main/index.jade'), {
                                    title           : "Brands & Business: brands business conference",
                                    _sliderData     : _slider,
                                    _partnerData    : _partner,
                                    _speakersData   : _speakers
                                });
                                response.end();
                        });
                    });
        });

};

PagesController.prototype.contactUs = function(request, response) {

    var fullName     = request.body.fullName;
    var email        = request.body.email;


    var errors              = {};
    errors.errorFullName    = false;
    errors.errorEmail       = false;

    function validatorEmail(value) {
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
    }

    if(validatorEmail(email)){
        errors.errorEmail = false;

    } else {
        errors.errorEmail = "Is not valid email address.";
    }
    if(fullName){
        errors.errorFullName = false;

    } else {
        errors.errorFullName = " Full name is required.";
    }

    if(errors.errorEmail || errors.errorFullName ) {
        ResponseUtils.badRequest(response, {"name": errors.errorFullName, "email": errors.errorEmail});
    } else {
        var _user = new User();
            _user.name  = fullName;
            _user.email = email;

        _user.save(function (err, newUser) {
            if(err){
                console.log("Save subscriber error",err);
                ResponseUtils.badRequest(response, {"name": errors.errorFullName, "email": errors.errorEmail});
            }
        }).then(function (newUser) {
            ResponseUtils.send(response, { status: 'success' });
        });

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
