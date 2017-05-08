// load the things we need
var mongoose = require('mongoose');
//var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var driverSchema = mongoose.Schema({
    firstedit      : Boolean,
    username       : String,
    password       : String,
    email          : String,
    firstname      : String,
    lastname       : String,
    mobile         : String,
    day            : String,
    month          : String,
    year           : String,
    address        : {},
    vehicle        : String,
    reg            : String,
    make           : String,
    model          : String,
    fuel           : String,
    colour         : String,
    year           : String,
    number         : String,
    expiry         : String,
    porters        : String,
    vehiclenumber  : String,
    bank           : String,
    acc            : String,
    sc             : String,
    image          : String,
    city           : String,
    docType        : String,
    accountType    : String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Driver', driverSchema);
