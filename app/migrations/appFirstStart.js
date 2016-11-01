var md5                 = require('MD5'),
    Admin               = require('../models/Admin');

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