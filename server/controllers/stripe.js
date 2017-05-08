var stripe = require("stripe")(
  "sk_live_soQQdjDzUEp49Ue0Xb2qkPyP"
  //"sk_test_L7l15Y9Hf3elbyUbjdcxlGiC"
);
var User = require(__dirname + '/../models/user');

var stripePay = {};

stripePay.chargeCustomer = function(price, customerID, name, token, callback) {
    stripe.charges.create({
        amount: price * 100, // stripe takes pence
        currency: "GBP",
        metadata: {name: name},
        source: token,
        description: customerID
    }, function(err, charge) {
        // asynchronously called
        if(err) {
            callback(false);
        } else {
            callback(charge);
        }
    });
}




module.exports = stripePay;
