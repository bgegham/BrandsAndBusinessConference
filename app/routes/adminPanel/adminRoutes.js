module.exports = function(app, multipart) {

    var adminPanelController          = require('../../controllers/adminPanel/adminPanelController');

    // login page
    app.get('/control/admin/login',       multipart.array(), function(req, res){ adminPanelController.get_login(req, res); });

    // create user session on login
    app.post('/control/admin/login',      multipart.array(), function(req, res){ adminPanelController.CREATE_SESSION(req, res); });

    // destroy session and log out
    app.post('/control/admin/logout',     multipart.array(), function(req, res){ adminPanelController.DESTROY_SESSION(req, res); });



//  PRIVATE PAGES

    // dashboard
    app.get('/control/admin/dashboard',             multipart.array(), function(req, res){ adminPanelController.get_dashboard(req, res); });

    // subscribers
    app.get('/control/admin/subscribers',           multipart.array(), function(req, res){ adminPanelController.get_subscribers(req, res); });

    // about
    app.get('/control/admin/about',                 multipart.array(), function(req, res){ adminPanelController.get_about(req, res); });
    app.post('/control/admin/about',                multipart.array(), function(req, res){ adminPanelController.add_about(req, res); });
    app.post('/control/admin/about/delete',         multipart.array(), function(req, res){ adminPanelController.delete_about(req, res); });

    // partners
    app.get('/control/admin/partners',              multipart.array(), function(req, res){ adminPanelController.get_partners(req, res); });
    app.get('/control/admin/partners/add',          multipart.array(), function(req, res){ adminPanelController.add_partners(req, res); });
    app.post('/control/admin/partners/add',         multipart.single('avatar'), function(req, res){ adminPanelController.create_partner(req, res); });
    app.post('/control/admin/partners/delete',      multipart.array(), function(req, res){ adminPanelController.delete_partner(req, res); });






};