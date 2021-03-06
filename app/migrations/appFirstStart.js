var md5                 = require('MD5'),
    Admin               = require('../models/Admin'),
    About               = require('../models/About');

// create super admin
Admin.find({}, function(err, admins){
    if (err) {
        LOG.error("ADMIN", "appFirstStart.js line:8", err);
    } else {
        if (admins) {
            if(admins.length == 0){
                var admin = new Admin();
                admin.username               = "admin";
                admin.password               = md5("admin");
                admin.save(function(err){
                    if(err){
                        console.log("**************************************************************************************");
                        console.log("*************************  Can't create first admin  *********************************");
                        console.log("**************************************************************************************");
                    } else {
                        console.log("**************************************************************************************");
                        console.log("**********************  Automatically create admin  **********************************");
                        console.log("**********************                              **********************************");
                        console.log("**********************  USERNAME :    admin         **********************************");
                        console.log("**********************  PASSWORD :    admin         **********************************");
                        console.log("**************************************************************************************");
                    }
                });
            }
        }
    }
});
About.find({}).exec(function (err, about) {
    if(err){
        console.log("error create about", err)
    } else {
        if(about){
            if(about.length == 0){
                var _about = new About();
                _about.save();
            }
        }
    }
});