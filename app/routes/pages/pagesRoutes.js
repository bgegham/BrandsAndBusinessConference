module.exports = function(app, multipart) {

    var pagesController    = require('../../controllers/pages/pagesController');

    app.get('/',             multipart.array(), function(req, res){ pagesController.mainPage(req, res); });



};