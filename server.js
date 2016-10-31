var express             = require('express'),
    session             = require('express-session'),
    app                 = express(),
    bodyParser          = require('body-parser'),
    mongoose	        = require('mongoose'),
    multer              = require('multer'),
    methodOverride      = require('method-override'),
    morgan              = require('morgan'),
    cors                = require('cors'),
    gridFs              = require('gridfs-stream'),
    moment              = require('moment'),
    cookieParser        = require('cookie-parser'),
    expressValidator    = require('express-validator'),
    fs                  = require('fs'),
    path                = require('path'),
    async               = require("async");

global._                = require('underscore');
app.locals.moment       = moment;

app.use(session({
    secret: 'secret_timecrm_ecretdjkfalfkjgvsskjlgajf87kn677867kdfgakdjfn88867akddf867nbadkjfbadjkfbadfdk67kvkjf867da8jdfbnkjdfbndf',
    cookie: { maxAge: 1800000*18 },
    resave: true,
    saveUninitialized: true
}));

// config file with environment
var APP_ENV = process.env.APP_ENV || 'development';
    global.APP_ENV = APP_ENV;

var config              = require('./config')[APP_ENV];

    global.ROOT_DIR     = __dirname + '/';
    global.CONNECTION   = mongoose.connection;
    global.GRIDFS       = gridFs;
    gridFs.mongo = mongoose.mongo;

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.json({limit: '10mb', extended: true, parameterLimit: 100000}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true, parameterLimit: 100000}));
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/*+json' }));
// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/plain' }));
app.use(cookieParser());

// connect to our mongo DB database
mongoose.connect(config.mongo_url);

app.use(cors());

app.use(expressValidator());

// set the static files location /public/img will be /img for users
app.use( express.static( __dirname + '/public'));

app.set('views', '/public/views');
app.set('view engine', 'jade');

app.use(methodOverride('X-HTTP-Method-Override'));

if (APP_ENV === 'development') {
    app.use(morgan('dev'));
}

//start migrate
require('./app/migrations/appFirstStart');

require('./app/routes/adminPanel/adminRoutes')(app, multer({ dest: 'tmp/adminRoutes/' }));

// api routes for mobile
require('./app/routes/api/api')(app, multer({ dest: 'tmp/api/' }));


// route to handle all angular requests
app.get('*', function(req, res) {
    res.render( path.resolve('public/views/errors/404.jade'), {
        title           : "RICHSTONE: PAGE NOT FOUND"
    });
    res.end();
});

// Handle 500
app.use(function(error, req, res, next) {

    if(error.statusCode == 500){
        res.status(500);
        res.render( path.resolve('public/views/errors/500.jade'), {
            title           : "500: Internal Server Error",
            error: error
        });
    } else {
        console.log(error);
        res.status(400).send("Unexpected end of input");
    }
    res.end();

});

// startup our app
var _SERVER_        = app.listen(config.http_port, config.http_host);
global.io           = require('socket.io').listen(_SERVER_);
// socket controller
require('./app/controllers/sockets/socketsController')(app, global.io );

// shout out to the user
console.log(' ________________________________________________');
console.log('|                                                |');
console.log('|     << RICHSTONE >> started on port ' + config.http_port + '       |');
console.log('|                                                |');
console.log(' ------------------------------------------------');


// expose app
exports = module.exports = app;
