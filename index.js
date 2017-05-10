var express                 = require('express');
var app                     = express();
var mongoose                = require('mongoose');
var bodyParser              = require('body-parser');
var cookieParser            = require('cookie-parser');
var session                 = require ('express-session');
var passport                = require('passport');
var localStrategy           = require('passport-local').Strategy;
var needle                  = require('needle');
var rest                    = require('restler');
var flash                   = require('connect-flash');
var crypto                  = require('crypto');
var multipart               = require('connect-multiparty');
var multipartMiddleware     = multipart();
var fs                      = require('fs-extra');
var path                    = require('path');
var jwt                     = require('jsonwebtoken');
var sgHelper = require('sendgrid').mail;
var sg = require('sendgrid')('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');
var nodemailer              = require('nodemailer');


var utils = {};
utils.fs = fs;
utils.path = path;
utils.needle = needle;
utils.rest = rest;
utils.sgHelper = sgHelper;
utils.sg = sg;
utils.jwt = jwt;
utils.crypto = crypto;
utils.multipart = multipart;
utils.multipartMiddleware = multipartMiddleware;
utils.passport = passport;
utils.localStrategy = localStrategy;
utils.nodemailer = nodemailer;

var Quote       = require(__dirname + '/server/models/quote');
var Token       = require(__dirname + '/server/models/token');
var User        = require(__dirname + '/server/models/user');
var Contact     = require(__dirname + '/server/models/contact');
var Driver      = require(__dirname + '/server/models/driver');
var Staff       = require(__dirname + '/server/models/staff');

var models = {};
models.Quote = Quote;
models.Token = Token;
models.User = User;
models.Contact = Contact;
models.Driver = Driver;
models.Staff = Staff;

var td = require(__dirname + '/server/controllers/td.js');
var pp = require(__dirname + '/server/controllers/passport.js');
var stripePay = require(__dirname + '/server/controllers/stripe.js');
var func = require(__dirname + '/server/controllers/func.js');
var member = require(__dirname + '/server/controllers/member.js');
var gs = require(__dirname + '/server/controllers/gs.js');
var swift = require(__dirname + '/server/controllers/swift.js');

var cont = {};
cont.td = td;
cont.pp = pp;
cont.stripePay = stripePay;
cont.func = func;
cont.member = member;
cont.gs = gs;
cont.swift = swift;

var info = {};
info.gsAPI = process.env.GSAPI;

// DB configuration ============================================================
var configDB = require('./config/database.js');
mongoose.connect(configDB.url); // connect to our database

// Set Port ====================================================================
app.set('port', (process.env.PORT || 5009));


// Need to make sure that the ngfile upload was bing used so just writw this code
app.use('/node_modules', express.static(__dirname + "/node_modules"));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(multipartMiddleware);

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// routes ==================================================
require(__dirname + '/server/routes')(app, models, utils, cont, info);

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
