module.exports = function(app, multipart) {

    var pagesController                         = require('../../controllers/pages/pagesController');

    app.get('/',                                multipart.array(), function(req, res){ pagesController.mainPage(req, res); });

    app.get('/404',                             multipart.array(), function(req, res){ pagesController.pageNotFound(req, res); });

    app.post('/contactus',                      multipart.array(), function(req, res){ pagesController.contactUs(req, res); });

    app.post('/subscribe/user',                 multipart.array(), function(req, res){ pagesController.subscribeUser(req, res); });

    app.get('/images/:id',                      function(req, res) { pagesController.imageShow(req, res); });

    app.get('/test/page/30169093156554538658',  multipart.array(), function(req, res){ pagesController.testPage(req, res); });

};