// load the things we need
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    password: String,
    email: String,
    businessname: String,
    //address: String,
    //doornumber: String,
    //city: String,
    //postcode: String,
    name: String,
    number: String,
    //pk: String,
    emailToken: String,
    //refreshToken: String,
    //stripeID: String,
    //cardAdded: String,
    //cardID: String,
    //accountType: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
