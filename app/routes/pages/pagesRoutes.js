module.exports = function(app, multipart) {

    var pagesController    = require('../../controllers/pages/pagesController');

    app.get('/',             multipart.array(), function(req, res){ pagesController.mainPage(req, res); });

    app.get('/404',          multipart.array(), function(req, res){ pagesController.pageNotFound(req, res); });

    app.get('/images/:id',   function(req, res) { pagesController.imageShow(req, res); });

};