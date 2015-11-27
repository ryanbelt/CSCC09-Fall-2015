// app.js Node.js server

"use strict;"   // flag JS errors 

/* Module dependencies:
 *
 * require() loads a nodejs "module" - basically a file.  Anything
 * exported from that file (with "exports") can now be dotted off
 * the value returned by require(), in this case e.g. splat.api
 * The convention is use the same name for variable and module.
 */
var https = require("https"),   // ADD CODE
    // NOTE, use the version of "express" linked to the assignment handout
    express = require("express"),   // ADD CODE
    fs = require("fs"),
    path = require("path"),
    url = require("url"),
    multer = require("multer"),
    logger = require("morgan"),
    compression = require("compression"),
    session = require("express-session"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    directory = require("serve-index"),
    errorHandler = require("errorhandler"),
    basicAuth = require("basic-auth-connect"),  // optional, for HTTP auth

    // config is an object module, that defines app-config attribues,
    // such as "port", DB parameters
    config = require("./config"),
    splat = require('./routes/splat.js'),
    options = {
        key: fs.readFileSync('key.pem'),  // RSA private-key
        cert: fs.readFileSync('cert.pem')  // RSA public-key certificate
    };  // route handlers ... ADD CODE

// middleware check that req is associated with an authenticated session
function isAuthd(req, res, next) {
    if(req.session.auth){
        return next();
    }
    else{
        res.status(403).send("please signin to countinue your application.")
    }
};


var app = express();  // Create Express app server

// Configure app server

// use PORT environment variable, or local config file value
app.set('port', process.env.PORT || config.port);

// activate basic HTTP authentication (to protect your solution files)
//app.use(basicAuth('username', 'password'));  // REPLACE username/password


// change param value to control level of logging  ... ADD CODE
app.use(logger('dev'));  // 'default', 'short', 'tiny', 'dev'

// use compression (gzip) to reduce size of HTTP responses
app.use(compression());

// parse HTTP request body
app.use(bodyParser.json({limit:'1mb'}));
app.use(bodyParser.urlencoded({limit:'1mb',
        extended: true
}));

app.use(session({
    name: config.sessionKey,
    secret: config.sessionSecret,  // A3 ADD CODE
    rolling: true,  // reset session timer on every client access
    cookie: { maxAge:config.sessionTimeout,  // A3 ADD CODE
        // maxAge: null,  // no-expire session-cookies for testing
        httpOnly: true },
    saveUninitialized: false,
    resave: false
}));

//client can log
// set file-upload directory for poster images
app.use(multer({dest: __dirname + '/public/img/uploads/'}));
app.use(multer({dest: __dirname + config.videoPath}));
// checks req.body for HTTP method overrides
app.use(methodOverride());


// App routes (RESTful API) - handler implementation resides in routes/splat.js

// Perform route lookup based on HTTP method and URL.
// Explicit routes go before express.static so that proper
// handler is invoked rather than static-content processor

// Heartbeat test of server API
app.get('/', splat.api);

// Retrieve a single movie by its id attribute

app.get('/movies/:id', splat.getMovie);

// ADD CODE to support other routes listed on assignment handout
app.get('/movies', splat.getMovies);

app.post('/movies', isAuthd,splat.addMovie);

app.put('/movies/:id',isAuthd, splat.editMovie);

app.delete('/movies/:id',isAuthd, splat.deleteMovie);

app.get('/movies/:id/reviews', splat.getReviews);

app.post('/movies/:id/reviews', isAuthd,splat.addReview);

app.get('/movies/:id/video', splat.playMovie);

app.post('/auth', splat.signup);

app.put('/auth', splat.auth);

app.put('/auth/:id', splat.auth);
// return error details to client - use only during development
app.use(errorHandler({ dumpExceptions:true, showStack:true }));

// location of app's static content ... may need to ADD CODE
app.use(express.static(__dirname + "/public"));
// Default-route middleware, in case none of above match

app.use(function (req, res) {
    res.status(404).send('<h3>File Not Found</h3>');
});



// Start HTTP server
https.createServer(options,app).listen(app.get('port'), function () {
    console.log("Express server listening on port %d in %s mode",
    		app.get('port'), config.env );
});