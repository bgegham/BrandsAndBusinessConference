module.exports = function(app, multipart) {

    var adminPanelController          = require('../../controllers/adminPanel/adminPanelController');

    // login page
    app.get('/control/admin/login',             multipart.array(), function(req, res){ adminPanelController.get_login(req, res); });

    // create user session on login
    app.post('/control/admin/login',            multipart.array(), function(req, res){ adminPanelController.CREATE_SESSION(req, res); });

    // destroy session and log out
    app.post('/control/admin/logout',           multipart.array(), function(req, res){ adminPanelController.DESTROY_SESSION(req, res); });




//  PRIVATE PAGES
    app.get('/control/admin/dashboard',         multipart.array(), function(req, res){ adminPanelController.get_dashboard(req, res); });
    // brilliants
    app.get('/admin/brilliants',                multipart.array(), function(req, res){ adminPanelController.get_brilliants(req, res); });
    app.get('/admin/brilliants/view',           multipart.array(), function(req, res){ adminPanelController.get_brilliants(req, res); });
    app.get('/admin/brilliants/add',            multipart.array(), function(req, res){ adminPanelController.add_brilliants(req, res); });
    app.get('/admin/brilliants/edit/:id',       multipart.array(), function(req, res){ adminPanelController.edit_brilliants(req, res); });
    app.post('/admin/brilliants/edit/:id',      multipart.single('image'), function(req, res){ adminPanelController.EDIT_BRILLIANT(req, res); });
    app.post('/admin/brilliants/add',           multipart.single('image'), function(req, res){ adminPanelController.CREATE_BRILLIANT(req, res); });
    // object images
    app.get('/brilliant/img/:id',               function(req, res) { adminPanelController.imageShow(req, res); });
    // brilliants unpublish
    app.post('/admin/brilliants/unpublish',     multipart.array(), function(req, res) { adminPanelController.UNPUBLISH_BRILLIANT(req, res); });
    // brilliants publish
    app.post('/admin/brilliants/publish',       multipart.array(), function(req, res) { adminPanelController.PUBLISH_BRILLIANT(req, res); });

    // users
    app.get('/admin/users',                     multipart.array(), function(req, res){ adminPanelController.get_users(req, res); });
    app.get('/admin/users/view',                multipart.array(), function(req, res){ adminPanelController.get_users(req, res); });
    app.get('/admin/users/addFake',             multipart.array(), function(req, res){ adminPanelController.add_userFake(req, res); });
    app.post('/admin/users/addFake',            multipart.single('image'), function(req, res){ adminPanelController.CREATE_USER_FAKE(req, res); });

    app.get('/admin/users/edit/:id',            multipart.array(), function(req, res){ adminPanelController.edit_User(req, res); });
    app.post('/admin/users/edit/:id',           multipart.single('image'), function(req, res){ adminPanelController.EDIT_USER_FAKE(req, res); });
    app.post('/admin/users/edit/gold/:id',      function(req, res){ adminPanelController.EDIT_USER_INSTAGRAM(req, res); });

    app.get('/admin/users/images/add/:id',      multipart.array(), function(req, res){ adminPanelController.add_UserImages(req, res); });
    app.post('/admin/users/images/add/:id',     multipart.single('image'), function(req, res){ adminPanelController.ADD_USER_FAKE_IMAGES(req, res); });
    app.post('/admin/users/images/delete/:id',  multipart.array(), function(req, res) { adminPanelController.DELETE_USER_FAKE_IMAGES(req, res) });
    // user unpublish
    app.post('/admin/user/unpublish',           multipart.array(), function(req, res) { adminPanelController.UNPUBLISH_USER(req, res); });
    // user publish
    app.post('/admin/user/publish',             multipart.array(), function(req, res) { adminPanelController.PUBLISH_USER(req, res); });

    // transactions
    app.get('/admin/transactions',              multipart.array(), function(req, res){ adminPanelController.get_transactions(req, res); });
    app.get('/admin/transactions/view',         multipart.array(), function(req, res){ adminPanelController.get_transactions(req, res); });
    app.get('/admin/transactions/addFake',      multipart.array(), function(req, res){ adminPanelController.add_transactionFake(req, res); });
    app.post('/admin/transactions/addFake',     multipart.array(), function(req, res){ adminPanelController.CREATE_TRANSACTION_FAKE(req, res); });
    // transactions unpublish
    app.post('/admin/transaction/unpublish',     multipart.array(), function(req, res) { adminPanelController.UNPUBLISH_TRANSACTION(req, res); });
    // transactions publish
    app.post('/admin/transaction/publish',       multipart.array(), function(req, res) { adminPanelController.PUBLISH_TRANSACTION(req, res); });
    // find user keyword
    app.get('/admin/search/users',              function(req, res) { adminPanelController.usersSearch(req, res); });
    app.get('/admin/search/brilliant',          function(req, res) { adminPanelController.brilliantSearch(req, res); });

// CHAT
    app.get('/admin/chat',                      multipart.array(), function(req, res){ adminPanelController.getUserChatRoom(req, res); });
    app.get('/admin/chat/pagination',           multipart.array(), function(req, res){ adminPanelController.getUserChatMessages(req, res); });



};