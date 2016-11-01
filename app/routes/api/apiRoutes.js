var config                  = require('../../../config')[APP_ENV],
    jwt                     = require('jsonwebtoken'),
    ResponseUtils           = require('../../utils/utils'),
    path                    = require('path');



module.exports = function(app, multipart) {

    var apiController             = require('../../controllers/api/apiController');

    // Create user
    app.get('/api/1.0/instagram/callback/', function(req, res) { apiController.authorizeInstagram(req, res); });

    // object images
    app.get('/user/avatar/:id', function(req, res) { apiController.imageShow(req, res); });

    app.get('/user/images/:id', function(req, res) { apiController.imageShow(req, res); });
    // GET USER LAST IMAGE
    app.get('/api/1.0/:user_id/lastImage/:id',   function(req, res) { apiController.userLastImage(req, res); });


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var apiRoutes = require('express').Router();
    apiRoutes.use(function(req, res, next) {
        var token = req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, config.secret, function(err, decoded) {
                if (err) {
                    return ResponseUtils.unauthorized(res);
                } else {
                    User.findOne({ _id: decoded }).exec( function(err, user) {
                        if (err) {
                            return ResponseUtils.unauthorized(res);
                        } else if(user){
                            req.decoded = decoded;
                            next();
                        } else {
                            return ResponseUtils.unauthorized(res);
                        }
                    });
                }
            });
        } else {
            return ResponseUtils.unauthorized(res);
        }
    });
    app.use('/api', apiRoutes);

    // GET USER INFO
    app.get('/api/1.0/user/info',               function(req, res) { apiController.userInfo(req, res); });
    // GET USER MEDIA
    app.get('/api/1.0/user/self/media',         function(req, res) { apiController.userMedia(req, res); });
    // GET OTHER USER MEDIA
    app.get('/api/1.0/user/other/media/:id',    function(req, res) { apiController.otherUserMedia(req, res); });
    // GET USER FAVORITES
    app.get('/api/1.0/user/favorites',          function(req, res) { apiController.userFavorites(req, res); });
    // GET USER INFO
    app.post('/api/1.0/user/info',              multipart.single('avatar'), function(req, res) { apiController.USER_EDIT(req, res); });
    // GET USERS LIST
    app.get('/api/1.0/users/list',              function(req, res) { apiController.usersList(req, res); });
    // FIND USER KEYWORD
    app.get('/api/1.0/users/find',              function(req, res) { apiController.usersFind(req, res); });
    // ADD TO FAVORITES
    app.post('/api/1.0/user/favorite',          function(req, res) { apiController.CREATE_FAVORITE(req, res); });
    // DELETE FROM FAVORITES
    app.post('/api/1.0/user/favorites/remove',  function(req, res) { apiController.DELETE_FAVORITE(req, res); });
    // GET AVAILABLE BRILLIANT LIST
    app.get('/api/1.0/brilliants/list',         function(req, res) { apiController.brilliantsList(req, res); });
    // GET BRILLIANTS FOR ME
    app.get('/api/1.0/brilliants/sendForMe',    function(req, res) { apiController.brilliantsListMy(req, res); });
    // GET BRILLIANTS FOR OTHER
    app.get('/api/1.0/brilliants/sendForOther', function(req, res) { apiController.brilliantsListOther(req, res); });
    // ACTIVITY
    app.get('/api/1.0/activity/list',           function(req, res) { apiController.allActivity(req, res); });
    app.get('/api/1.0/activity/favorites',      function(req, res) { apiController.favoritesActivity(req, res); });

// SEND BRILLIANT TO FROM
    app.post('/api/1.0/user/sendBrilliant',     function(req, res) { apiController.SEND_BRILLIANT(req, res); });

// COUNTS
    app.get('/api/1.0/user/media/count',        function(req, res) { apiController.userMediaCount(req, res); });


// MESSAGING
    // GET AVAILABLE ROOM LIST
    app.get('/api/1.0/user/chat/rooms',         function(req, res) { apiController.chatRooms(req, res); });
    // SEND MESSAGE IN ROOM
    app.get('/api/1.0/user/chat/room/messages', function(req, res) { apiController.chatRoomMessages(req, res); });


// DEVICE TOKEN ADD
    app.post('/api/1.0/user/device/add',  function(req, res) { apiController.userDeviceTokenAdd(req, res); });
// DEVICE TOKEN REMOVE
    app.post('/api/1.0/user/device/remove',  function(req, res) { apiController.userDeviceTokenRemove(req, res); });

// GOLD PLUS
    app.post('/api/1.0/user/gold/plus',  function(req, res) { apiController.userGoldPlus(req, res); });

// GOLD MINUS
    app.post('/api/1.0/user/gold/minus',  function(req, res) { apiController.userGoldMinus(req, res); });

// DOLLARS PLUS
    app.post('/api/1.0/user/dollars/plus',  function(req, res) { apiController.userDollarsPlus(req, res); });

};