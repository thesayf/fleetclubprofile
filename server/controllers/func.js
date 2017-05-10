var User = require(__dirname + '/../models/user');
var Quote = require(__dirname + '/../models/quote');

var func = {};

func.checkDuplicate = function(model, field, value, callback) {
    var query = {};
    if(typeof(field) == 'object') {
        for(var i = 0; i < field.length; i++) {
            query[field[i]] = value[i];
        }
    } else {
        query[field] = value;
    }
    model.findOne(query, function(err, duplicate) {
        if(err) {callback(err);}
        if(duplicate) {
            callback({data: duplicate, status: true});
        } else {
            callback({data: duplicate, status: false});
        }
    })
}

func.addRecord = function(model, dataObj, callback) {
    var mod = new model();
    for (var prop in dataObj) {
        mod[prop] = dataObj[prop];
    }
    mod.save(function(err, user){
        if(err){
            callback(false);
        } else {
            callback(user);
        }
    })
}

func.getUserFields = function(userID, fields, callback) {
    User.findOne({'_id': userID}, fields, function (err, doc) {
        //console.log(doc);
        //console.log(err);
        callback(doc);
    });
}

func.updateUserField = function(userID, field, newValue, callback) {
    User.findOne({'_id': userID}, function (err, doc) {
        doc.cardAdded = newValue;
        doc.save(function(err) {
            if(err) {
                callback(err);
            } else {
                callback(true);
            }
        })
    });
}



// fields = [0: "stripeID", 1:"cardID"];
// newValues = [0: "red", 1:"blue"];
func.updateUserFields = function(userID, fields, newValues, callback) {
    User.findOne({'_id': userID}, function(err, doc) {
        fields.forEach(function(v, k) {
            doc[v] = newValues[k];
        });
        doc.save(function(err) {
            if(err) {
                callback(err);
            } else {
                callback(true);
            }
        })
    })
}


func.updateMongoFields = function(mongoData, callback) {
    mongoData.query = {};
    mongoData.query[mongoData.selector] = mongoData.selectorVal;

    mongoData.col.findOne(mongoData.query, function(err, doc) {
        mongoData.fields.forEach(function(v, k) {
            doc[v] = mongoData.newValues[k];
        });
        doc.save(function(err) {
            if(err) {
                callback(err);
            } else {
                callback(true);
            }
        })
    });

    /*
    var fieldSelector = mongoData.selector;
    var colObj = mongoData.col;
    console.log(mongoData);

    colObj.findOne({fieldSelector: mongoData.selectorVal}, function(err, doc) {
        console.log(err);
        console.log(doc);
        mongoData.fields.forEach(function(v, k) {
            doc[v] = mongoData.newValues[k];
        });
        doc.save(function(err) {
            if(err) {
                callback(err);
            } else {
                if(mongoData.pullBack) {
                    callback(doc);
                } else {
                    callback(true);
                }
            }
        })
    })*/
}

func.getMongoFields = function(mongoData, callback) {
    mongoData.query = {};
    mongoData.query[mongoData.selector] = mongoData.selectorVal;

    mongoData.col.findOne(mongoData.query, mongoData.fields, function(err, doc) {
        if(err) {
            callback(err);
        } else {
            callback(doc);
        }
    });
}

func.param = function(data) {
    return Object.keys(data).map(function(key) {
        return [key, data[key]].map(encodeURIComponent).join("=");
    }).join("&");
}

func.sendEmail = function(data, utils, cb) {
    // create reusable transporter object using the default SMTP transport
    var transporter = utils.nodemailer.createTransport('smtps://hello@thevanclub.io:hakeem44@smtp.gmail.com');

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: '"Hello" <hello@thevanclub.io>', // sender address
        to: data.email, // list of receivers
        subject: data.subject, // Subject line
        text: data.msg // plaintext body
        //html: '<b>Hello world ?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}

func.sendInfo = function(res, status, dataObj) {
    if(dataObj && dataObj.data) {
        var dataHold = dataObj.data;
    }
    if(status == true) {
        res.json({
            success: status,
            message: dataObj.message,
            data: dataHold
        })
    } else {
        res.json({
            success: status,
            message: dataObj.message,
            data: dataHold
        })
    }
}


func.userIDByBookingPk = function(bookingPK, callback) {
    Quote.findOne({'pk': bookingPK}, function(err, doc) {
        if(err) {
            callback(err)
        } else {
            callback(doc.userID);
        }
    })
}


module.exports = func;
