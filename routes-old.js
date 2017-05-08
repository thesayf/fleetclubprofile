var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var td = require(__dirname + '/controllers/td.js');
var pp = require(__dirname + '/controllers/passport.js');
var stripePay = require(__dirname + '/controllers/stripe.js');
var crypto = require('crypto');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
//var fs = require('fs-extra');
var fs = require('fs');
var path = require('path');

var func = require(__dirname + '/controllers/func.js');
var jwt = require('jsonwebtoken');

//td.getFinalCost(bookingID, 'TDOBkkz4aH2ACzJ6Uw1aHH19', function() {})


module.exports = function(app, Quote, Token, User, Contact, needle, rest, Driver, Staff, sendgrid) {}

    app.post('/api/check-token', function(req, res) {
        pp.checkAuthDetails(req.cookies["remember_me"], pageType, function(userID){
    })

    /*app.post('/api/tester', function(req, res) {
        obj = {};
        obj.booking_pk = '1a79411de89087ab4ea56259';

        func.userIDByBookingPk(obj.booking_pk, function(userID) {
            console.log(userID);
            td.getAccessToken(userID, function(token) {
                var sendData = {userID: userID, token: token, bookingPK: obj.booking_pk};
                console.log(obj.booking_pk);
                td.getDriverInfo(sendData, function(resp) {
                    var mongoData = {};
                    mongoData.col = Quote;
                    mongoData.fields = ["driverPK", "driverName", "driverPhone", "driverPlate", "driverColor"];
                    var driv = resp.bookings[0].driver;
                    mongoData.newValues = [driv.pk, driv.name, driv.phone, driv.vehicle.plate, driv.vehicle.color];
                    mongoData.selector = 'pk';
                    mongoData.selectorVal = obj.booking_pk;
                    func.updateMongoFields(mongoData, function(status) {
                        console.log(status);
                    })
                });
            })
        })
    })*/


    app.post('/api/check-auth', function(req, res) {
        var pageType = req.body.data;
        if(!req.cookies["remember_me"]) {
            res.json({
                success: false,
                message: "user no exist"
            })
        } else {
            pp.checkAuthDetails(req.cookies["remember_me"], pageType, function(userID){
                if(userID !== false) {
                    res.json({
                        success: true,
                        message: "authenticated"
    			    })
                } else {
                    // delete cookie aswell
                    res.json({
                        success: false,
                        message: "user no exist"
    			    })
                }
            })
            /*pp.getUserID(req.cookies["remember_me"], function(userID){
                if(userID) {
                    res.json({
                        success: true,
                        message: "authenticated"
    			    })
                } else {
                    // delete cookie aswell
                    res.json({
                        success: false,
                        message: "user no exist"
    			    })
                }
            })*/
        }
    })


        ////FILE UPLOAD///////
    app.post("/api/driver-document-update", multipartMiddleware, function(req, res){

        pp.getUserID(req.cookies['remember_me'], function(userID) {
             var file = req.files.file;
             var userID = userID;
             var docType = req.body.docType;
//             console.log(req.body.docType);
//                console.log(docType);
//                console.log("this is the user id" + userID);
//                console.log("in here");
                console.log(req.files);

            var uploadDate = JSON.stringify(Math.round(new Date().getTime()/1000));

            var tempPath = file.path;
            var targetPath = path.join(__dirname, "../uploads/driver/" + userID + '-' + uploadDate + '-' + docType + file.name);
            console.log(tempPath);
            console.log(targetPath);
            var savePath = userID + '-' + uploadDate + '-' + docType + file.name;
            //fs.renameSync(tempPath, targetPath);
            /*fs.rename(tempPath, targetPath, function (err){

                if(err){
                    console.log(err);
                }else{
                    console.log("the file has been moved");
                    Driver.findOne({_id: userID}, function(err, driverData){
//                        console.log(driverData);
//                        console.log(driver.image);
                        var driver = driverData;
                        driver.image = savePath;
                        driver.docType = docType;
                        driver.save(function(err, record){
                            if(err){
                                console.log("failed save");
                            }else{
                                console.log("save success");
                                 res.json({data: record})
                            }
                        })

                    })
                }


            })*/

        });

    });


    //DELETE THE IMAGE////

    app.post("/api/delete-image", function (req, res){
        console.log("this is the delete image function");
            Driver.findOne({image: req.body.image}, {image: 1}, function(err, doc){
                console.log(doc);
                doc.image = "";
                doc.save(function(err, record){
                    if(err){
                        console.log("there was an error");
                    }else{
                        console.log("delete success");
                        res.json({
                            success:true,
                            message: "file was deleted",
                        })
                    }
                });
            });
    })

    //DRIVER ACCOUNT DETAILS
     app.post('/api/driver-account-update', function(req, res){
       console.log(req);
       if(req.cookies["remember_me"]){
           pp.getUserID(req.cookies["remember_me"], function(userID){
               Driver.findOne({_id: userID}, function(err, driver){
                    driver.mobile = req.body.mobile;
                    driver.address = req.body.address;
                    driver.vehicle = req.body.vehicle;
                    driver.bank = req.body.bank;
                    driver.acc = req.body.acc;
                    driver.sc = req.body.sc;
                    driver.reg = req.body.reg;
                    driver.make = req.body.make;
                    driver.model = req.body.model;
                    driver.fuel = req.body.fuel;
                    driver.colour = req.body.colour;
                    driver.year = req.body.year;
                    driver.number = req.body.number;
                    driver.expiry = req.body.expiry;
                    driver.firstedit = false;

                    driver.save(function(err, record) {
                            if(err) {
                                console.log(err);
                            } else {
                                console.log(true);
                                console.log("it worked");
                                res.json({
                                    success:true,
                                    message: "found",
                                    status: 1,
                                    data:record
                                })

                            }
                        })

               })
           })
       }

   })

      app.post('/api/driver-account-details', function(req, res) {
//       console.log(req.cookies["remember_me"]);

        if(req.cookies["remember_me"]) {
            pp.getUserID(req.cookies["remember_me"], function(userID){
                console.log(userID);
                Driver.findOne({_id: userID}, function(err, records){
                    res.json({
                        success:true,
                        message: "found",
                        status: 1,
                        data:records
    			    })
                })
           });
        } else {
             // no cookie
             res.send(false);
         }


   })

    // EMAIL FORM
    app.post("/api/contact-send/", function (req, res){
         //sends email to Moverspro from the users email address.
        sendgrid.send({
              to:       req.body.email.sentTo,
              from:     req.body.email.emailAddress,
              subject:  req.body.email.subject,
              text:     req.body.email.message
        }, function(err, data) {
            //err brings back an error message from sendgrid
            //the data is the data coming back from sendgrid if successful
            if(err) {
                //if there is an erorr will let you know
                res.json({
                    success:false,
                    message: "Was unable to send email. Try again later.",
                })
            } else {
                //if email has been deliveed it will let you know
                res.json({
                    success:true,
                    message: "message was delivered",
                    data: data
                })
            }
        });
    })



    //GRABS THE BOOKING INFO FOR THE BOOKINGINFO FUNCTION ////////////////////////////////////////////////////////////////////

    app.post("/api/grab-booking-info", function(req, res){
        if(req.cookies["remember_me"]) {
            pp.getUserID(req.cookies["remember_me"], function(userID){
                Quote.findOne({userID: userID}, function(err, records){
                    res.json({
                        success:true,
                        message: "found",
                        status: 1,
                        data:records
    			    })
                })
           });
        } else {
             // no cookie
             res.send(false);
         }
    });

    //GRABS DATA FOR USERGRAB SERVICE/////////////////////////////////////////////////////////////////////////////////////////
    app.post("/api/grab-one-record", function(req, res){
        if(req.cookies["remember_me"]) {
            pp.getUserID(req.cookies["remember_me"], function(userID){
                excludedFields = {password:0, accessToken:0, stripeID:0, pk:0, refreshToken:0, cardID:0};
                User.findOne({_id: userID}, excludedFields, function(err, record){
                    if(err) {
                        res.json({
                            success:false
        			    })
                    } else {
                        //console.log(record);
                        res.json({
                            success:true,
                            message: "found",
                            status: 1,
                            data:record
        			    })
                    }
                })
            });
        } else {
            // no cookie
            res.send(false);
        }

	});

    ////GRABS DATA FOR BOOKINGGRAB SERVICE///////////////////////////////////////////////////////////////////////////////////
    app.post("/api/grab-bookings", function(req, res){
        if(req.cookies["remember_me"]) {
            pp.getUserID(req.cookies["remember_me"], function(userID){
                //var tempdb = db.getCollection. req.body.colName;
                Quote.find({userID: userID}, function(err, records){
                    if(err) {
                        func.sendInfo(res, false, {errMessage: 'There was error, try again later.'});
                    } else {
                        func.sendInfo(res, true, {data: records, errMessage: 'There was error, try again later.'});
                    }
                })
            });
        } else {
            // no cookie
            res.send(false);
        }
	});


    ////T-DISPATCH WEBHOOK //////////////////////////////////////////////////////////////////////////////////////////////

    app.post('/webhooks/td-status', function(req, res) {
        var statusNews = req.body.payload;

        // Decode base64
        var statusNews = new Buffer(statusNews, 'base64')
        var en = statusNews.toString('binary');
        var iv = en.substr(0, 16);
        var data = en.substr(16);
        var password = 'secretaeskey1234';
        var decipher = crypto.createDecipheriv('aes-128-cbc', password, iv);
        decipher.setAutoPadding(false);
        var decoded  = decipher.update(data);
        decoded += decipher.final();

        // 9 STAR HACK GENERAL
        var decodedText = JSON.stringify(decoded);
        var decodedRegex = decodedText.replace(/[\*]/g, "");

        var decodedRegex = decodedRegex.replace(/[\\]/g, "");
        var decodedRegex = decodedRegex.replace(/[\{]/g, "");
        var decodedRegex = decodedRegex.replace(/[\}]/g, "");
        var decodedRegex = decodedRegex.replace(/[\"]/g, "");

        var properties = decodedRegex.split(', ');
        var obj = {};
        properties.forEach(function(property) {
            var tup = property.split(':');
            obj[tup[0]] = tup[1].trim();
        });

        var mongoData = {};
        mongoData.col = Quote;
        mongoData.fields = ["status"];
        mongoData.newValues = [obj.new_booking_status];
        mongoData.selector = 'pk';
        mongoData.selectorVal = obj.booking_pk;
        mongoData.pullBack = true;

        //console.log(obj.new_booking_status);

        /*dispatched
        confirmed
        on_way_to_job
        arrived_waiting
        passenger_on_board
        drop
        completed*/

        if(obj.new_booking_status == 'confirmed') {
            func.userIDByBookingPk(obj.booking_pk, function(userID) {
                //console.log(userID);
                td.getAccessToken(userID, function(token) {
                    var sendData = {userID: userID, token: token, bookingPK: obj.booking_pk};
                    //console.log(obj.booking_pk);
                    td.getDriverInfo(sendData, function(resp) {
                        var mongoData = {};
                        mongoData.col = Quote;
                        mongoData.fields = ["driverPK", "driverName", "driverPhone", "driverPlate", "driverColor"];
                        var driv = resp.bookings[0].driver;
                        mongoData.newValues = [driv.pk, driv.name, driv.phone, driv.vehicle.plate, driv.vehicle.color];
                        mongoData.selector = 'pk';
                        mongoData.selectorVal = obj.booking_pk;
                        func.updateMongoFields(mongoData, function(status) {
                            //console.log(status);
                        })
                    });
                })
            })
        }

        if(obj.new_booking_status == 'incoming') {
            //func.updateMongoFields(mongoData, function(status) {
        }

        if(obj.new_booking_status == "completed") {
            func.updateMongoFields(mongoData, function(status) {
                //console.log(status);
                if(status == true) {
                    //console.log('in 0');
                    // GET ACCESS TOKEN & STRIPE ID FROM DB
                    func.userIDByBookingPk(obj.booking_pk, function(userID) {
                        var mongoData = {};
                        mongoData.col = User;
                        mongoData.selector = '_id';
                        mongoData.selectorVal = userID;
                        mongoData.fields = {"stripeID":1, "cardID":1, "accessToken":1};
                        func.getMongoFields(mongoData, function(respo) {
                            //console.log('in 2 ');
                            //console.log(respo);
                            // GET FINAL COST FROM TD
                            td.getFinalCost(obj.booking_pk, respo.accessToken, function(bookingData) {
                                //console.log('in 3 ');
                                //console.log(bookingData.booking.total_cost.value);
                                var price = bookingData.booking.total_cost.value;
                                // STRIPE CHARGE
                                stripePay.chargeCustomer(price, respo.stripeID, function(resp) {
                                    //console.log('in 4 ');
                                    // ALSO SAVE PRICE TO MONGO
                                    //console.log(resp);
                                    var mongoData = {col: Quote, fields: ["finalCost"], newValues: [price], selector: 'pk', selectorVal: obj.booking_pk};
                                    // SAVE FINAL COST TO DB
                                    func.updateMongoFields(mongoData, function(status) {
                                        //console.log('in 5 ');
                                        if(status) {
                                            // if
                                        }
                                    })
                                })
                            })
                        })
                    })

                } else {
                    //console.log(status);
                }
            })
        } // IF COMPLETED STATUS
    })

    /////  CONTACTS  /////
    app.post('/api/contactlist', function (req, res) {
        Contact.find({'userID': req.user._id}, function (err, docs) {
            res.json({
                success:true,
                message: "Saved",
                status: 1,
                data:docs
            })
        });
    });

    app.post('/api/add-contact', function (req, res){
        var contact = new Contact();
        contact.userID = req.user._id;
        contact.organization = req.body.contact.organization;
        contact.name = req.body.contact.name;
        contact.relationship = req.body.contact.relationship;
        //console.log(req.body);
        contact.save(function(err, user){
            if(err){
                return done(err);
            } else {
                res.json({
                    success:true,
                    message: "Saved",
                    status: 1
                })
            }
        });
    });


	/////  LOGIN SYSTEM  /////
    app.post('/api/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            console.log(user);
            if (user === false) {
                return res.json({
                    success: false,
                    message: 'Unable to login.'
                });
            } else {
                pp.issueToken(user, function(err, token) {
                    return res.json({
                        success: true,
                        message: 'Login successful.',
                        data: token
                    });
                });
           }
        })(req, res, next);
    });


    passport.use('local', new localStrategy(function(username, password, done){
	    User.findOne({username: username, password: password}, function(err, user){
	        if(user){
                return done(null, user);
            } else {
                return done(null, false, {message: 'Unable to login'});
            }
	    });
	}));

	passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });



    /*app.post("/api/login", passport.authenticate('local'), function(req, res){

	});*/

	app.post("/api/signin", passport.authenticate('local-admin'), function(req, res){
		res.json(req.staff);
	});

    app.post("/api/driversignin", passport.authenticate('local-driver'), function(req, res){
		res.json(req.driver);
	});

	// logs the user out by deleting the cookie
	app.post("/api/logout", function(req, res){
        req.logOut();
        res.cookie('connect.sid', '', { expires: new Date(1), path: '/' });
        res.cookie('remember_me', '', { expires: new Date(1), path: '/' });
		res.json(req.user);
	});

    app.post("/api/login-auth",  function(req, res) {
        if(req.cookies['remember_me']) {
            pp.getToken(req.cookies['remember_me'], function(toke) {
                if(toke){
                    if(req.cookies['remember_me'] == toke) {
                        res.send(true ? req.user : '0');
                    }
                } else {
                    res.send(req.isAuthenticated() ? req.user : '0');
                }
            });
        } else {
            res.send(false);
        }
	});

	//authenitcates staff login
	app.post("/api/signin-auth",  function(req, res) {
		res.send(req.isAuthenticated() ? req.staff : '0');
	});

    // This registers the Users
	app.post("/api/register", function(req, res){
        //req.body.username = 'test';

		User.findOne({username: req.body.username}, function(err, user){
			if(user){
			 	return res.json({
					success: false,
					message: "This user already exists"
				});
			} else {
		   		var user = new User();
				user.username = req.body.username;
				user.password = req.body.password;
				user.email = req.body.email;
				user.businessname = req.body.businessname;
				user.address = req.body.address;
				user.doornumber = req.body.doornumber;
				user.city = req.body.city;
				user.postcode = req.body.postcode;
				user.businesstype = req.body.businesstype;
				user.firstname = req.body.firstname;
				user.lastname = req.body.lastname;
				user.mobile = req.body.mobile;
                user.accountType = 'dash';
				/*user.username = 'test';
				user.password = '123';
				user.email = 'test004@test.com';
				user.businessname = 'test biz';
				user.address = 'test address';
				user.doornumber = '103';
				user.city = 'test city';
				user.postcode = 'cr77jj';
				user.businesstype = 'tester';
				user.firstname = 'test first';
				user.lastname = 'test last';
				user.mobile = '+447894564410';*/

                // Save to mongo
				user.save(function(err, user){
                    // Create Tdispatch account for user
                    td.createAccount(user, function(data) {
                        // Save xtra details from tdisptch to user db
                       if (data.status = "Failed"){
                           return res.json({
					           success: false,
					           message: "the number is not in the right format"
				            });
                       }
                       else {
                           console.log("there is no error");
                       }
                        td.saveAccountDetails(User, data, user, function(status) {
                            if(status == true) {
                                pp.issueToken(user, function(err, token) {
                                    res.cookie('remember_me', token, { maxAge: 604800000 });
                                    if(err) {
                                        return next(err);
                                    } else {
                                        res.json(req.user);
                                    }
                                });
                            }
                        })
                    })
				});
			} //else close
		});
	});

    app.post('/api/check-card', function(req, res) {
        pp.getUserID(req.cookies['remember_me'], function(userID) {
            func.getUserFields(userID, {'cardAdded':1, 'cardID':1, 'stripeID':1}, function(data) {
                if(data.cardAdded) {
                    stripePay.getCard(data.stripeID, data.cardID, function(cardData) {
                        var cardDetails = {};
                        if(cardData) {
                            cardDetails.brand = cardData.brand;
                            cardDetails.last4 = cardData.last4;
                        }
                        return res.json({
                            success: true,
                            message: 'added',
                            data: cardDetails
                        });
                    })
                } else {
                    return res.json({
                        success: false,
                        message: 'none',
                        data: data
                    });
                }
            })
        })
    })

    app.post('/api/remove-card', function(req, res) {
        pp.getUserID(req.cookies['remember_me'], function(userID) {
            func.getUserFields(userID, {'stripeID':1, 'cardID':1}, function(fields) {
                stripePay.deleteCard(fields.stripeID, fields.cardID, function(status) {
                    var tempFields = ["cardID", "cardAdded"];
                    var tempValues = [undefined, undefined];
                    func.updateUserFields(userID, tempFields, tempValues, function(status) {
                        //console.log(status);
                        if(status == true) {
                            return res.json({
                                success: true,
                                message: 'card removed',
                            })
                        } else {
                            return res.json({
                                success: false,
                                message: status
                            })
                        }
                    })
                })
            })
        })
    })

    app.post('/api/add-card', function(req, res) {
        pp.getUserID(req.cookies['remember_me'], function(userID) {
            func.getUserFields(userID, {'pk':1, 'email':1, 'stripeID':1}, function(userFields) {
                //combine fields for stripe
                var userData = {};
                userData.email = userFields.email;
                userData.pk = userFields.pk;
                userData.id = userID;
                userData.tokenID = req.body.id;
                //IF uSER ALREDY STRIPED
                if(userFields.stripeID) {
                    stripePay.addCard(userFields.stripeID, userData.tokenID, function(cardData) {
                        //console.log(cardData);
                        if(cardData.id) {
                            //SAVE TO MONGO
                            stripePay.saveCardData(cardData, userData.id, function(status) {
                                if(status == true) {
                                    return res.json({
                                        success: true,
                                        message: 'card added'
                                    })
                                } else {
                                    return res.json({
                                        success: false,
                                        message: 'The card can not be processed, please check your card details.'
                                    })
                                }
                            })

                        } else {
                            return res.json({
                                success: false,
                                message: 'The card can not be processed, please check your card details.'
                            })
                        }
                    })
                } else {
                    // Create Cutomer In Stripe
                    stripePay.createCustomer(userData, function(stripeInfo) {
                        // Save Stripe ID in MONGO
                        stripePay.saveCustomerData(stripeInfo, function(status) {
                            // IF STRIPE SAVED LOG IN
                            if(status == true) {
                                return res.json({
                                    success: true,
                                    msg: 'Added Card'
                                });
                            } else {
                                return res.json({
                                    success: false,
                                    msg: 'No Card Added'
                                });
                            }
                        })
                    })
                }
            })
        })
    })


	//**USERLIST** Displays our users information in the admin User Page.
 	app.post('/api/userlist', function (req, res) {
		User.find({},{password: 0}, function (err, docs) {
			res.json({
				success:true,
				message: "found",
				status: 1,
				data:docs
			})
		});
	});

	//**driverlist** Displays our driver information in the admin Driver Page.
 	app.post('/api/driverlist', function (req, res) {
		Driver.find({},{password: 0}, function (err, docs) {
			//console.log(docs);
			res.json({
				success:true,
				message: "found",
				status: 1,
				data:docs
			})
		});
	});

	app.post('/api/stafflist', function (req, res) {
		Staff.find({},{password: 0}, function (err, docs) {
			res.json({
				success:true,
				message: "found",
				status: 1,
				data:docs
			})
		});
	});

 	//Signs New drivers up to the platform to allow us to investigate and activate there account.
 	app.post("/api/signup", function(req, res){
		Driver.findOne({username: req.body.username}, function(err, driver){
			if(driver){
			 	return res.json({
					success: false,
					message: "This user already exists"
				});
			} else {
			   	var driver = new Driver();
				driver.username = req.body.username;
				driver.password = req.body.password;
				driver.email = req.body.email;
				driver.firstname = req.body.firstname;
				driver.lastname = req.body.lastname;
				driver.mobile = req.body.mobile;
				driver.day = req.body.day;
				driver.month = req.body.month;
				driver.year = req.body.year;
				driver.address = req.body.address;
				driver.city = req.body.city;
				driver.postcode = req.body.postcode;
				driver.vehicle = req.body.vehicle;
				driver.reg = req.body.reg;
				driver.porters = req.body.porters;
				driver.vehiclenumber = req.body.vehiclenumber;
				driver.bank = req.body.bank;
				driver.acc = req.body.acc;
				driver.sc = req.body.sc;
                driver.accountType = 'contractor';
				driver.save(function(err, driver){
                    if(driver){
                        pp.issueToken(driver, function(err, token) {
                            res.cookie('remember_me', token, { maxAge: 604800000 });
                                if(err) {
                                    return next(err);
                                } else {
                                    res.json(req.driver);
                                }
                        });
                    }
                    else{
                            return res.json({
                                    success: true,
                                });
                    }
				});
			} //else close
		});
	});

	app.post("/api/addstaff", function(req, res){
		Staff.findOne({username: req.body.username}, function(err, staff){
			if(staff){
		 		return res.json({
					success: false,
					message: "This user already exists"
				});
			} else {
		   		var staff = new Staff();
				staff.username = req.body.username;
				staff.password = req.body.password;
				staff.email = req.body.email;
				staff.firstname = req.body.firstname;
				staff.lastname = req.body.lastname;
				staff.position = req.body.position;
				staff.save(function(err, staff){
				   	return res.json({
						success: true,
					});
				});
			} //else close
		});
	});


    /////  T DISPATCH  /////
	app.post('/api/tdispatch-book', function(req, res) {
        var jobInfo = req.body.data;
        // GET USERID FROM COOKIE
        pp.getUserID(req.cookies['remember_me'], function(userID) {
            // GET ACCESS TOKEN FROM DB
            td.getAccessToken(userID, function(access) {
                // CALL TDISPTCH API TO BOOK
    			td.bookJob(jobInfo, access, function(data) {
                    // EXPIRED TOKEN GET NEW OnE  - (STRING MAY CHANGE ON TDIPATCH)
                    td.manageExpiredToken(data.message, userID, function(expiredData) {
                        if(expiredData.status == true) {
                            td.bookJob(jobInfo, expiredData.newToken, function(data) {
                                //
                            })
                        }
                    })
                    if(data.status == 'OK') {
                        // SAVE BOOKING TO MONGO
                        td.saveQuote(jobInfo ,data, userID, function(status) {
                            func.sendInfo(res, status, {message: 'booked', errMessage: 'booking not saved'});
                        })
                    } else {
                        func.sendInfo(res, false, {errMessage: 'We were unable to book your job.'});
                    }
    			})
    		})
        })
	})

    app.post('/api/cancel-job', function(req, res) {
        pp.getUserID(req.cookies['remember_me'], function(userID) {
            td.getAccessToken(userID, function(access) {
                td.cancelJob({jobPK: req.body.data, token: access}, function(cancelData) {
                    td.manageExpiredToken(cancelData.message, userID, function(expiredData) {
                        if(expiredData.status == true) {
                            td.cancelJob({jobID: req.body.data, token: access}, function(cancelData) {
                                //
                            })
                        }
                    })
                    if(cancelData.status == 'OK') {
                        // update status in mongo
                        var mongoData = {col: Quote, fields: ["status"], newValues: ['cancelled'], selector: 'pk', selectorVal: req.body.data};
                        // SAVE FINAL COST TO DB
                        func.updateMongoFields(mongoData, function(status) {
                            // send back info
                            if(status) {
                                func.sendInfo(res, status, {message: 'Job cancelled', errMessage: 'Job Not cancelled'});
                            } else {
                                func.sendInfo(res, false, {errMessage: 'Job Not cancelled'});
                            }
                        })
                    } else {
                        td.getBookingData(req.body.data, access, function(bookingInfo) {
                            if(bookingInfo.booking.status == 'missed') {
                                var mongoData = {col:Quote, fields:["status"], newValues: [bookingInfo.booking.status], selector:'pk', selectorVal:req.body.data};
                                func.updateMongoFields(mongoData, function(status) {
                                    if(status) {
                                        func.sendInfo(res, true, {message: 'Job Cancelled'});
                                    } else {
                                        func.sendInfo(res, false, {errMessage: 'Job Not Cancelled'});
                                    }
                                })
                            }
                        })
                        //func.sendInfo(res, false, {errMessage: 'Job Not cancelled'});
                    }
                })
            })
        })
	})

    app.post('/api/tdispatch-calc', function(req, res) {
		td.getMainAccessToken(User, function(access) {
			td.calcFare(res, access, function(data) {
                func.sendInfo(res, status, {message: 'calc complete', errMessage: 'calc not complete', data: data});
			})
		})
	})


    app.post('/api/save-instant-job', function(req, res) {
		var quote = new Quote();

		// set the user's local credentials
        pp.getUserID(req.cookies['remember_me'], function(userID) {
            quote.userID = userID;
    		quote.jobName = req.body.data.jobName;
            quote.driverNote = req.body.data.driverNote;
    		quote.vanType = req.body.data.vanType;
    		quote.porterQty = req.body.data.porterQty;
    		quote.jobDate = req.body.data.jobDate;
    		quote.fuelPrice = req.body.data.fuelPrice;
    		quote.suggestedPrice = req.body.data.suggestedPrice;
    		quote.address = req.body.data.address;
    		quote.distance = req.body.data.distance;
    		quote.pk = req.body.data.pk;
    		quote.recieptUrl = req.body.data.recieptUrl;
    		quote.status = req.body.data.status;

    		// save the quote
    		quote.save(function(err) {
    			//console.log(err);
    			if(err) {
    				return done(false);
    			} else {
    				res.json({
    					success: true,
    					message: 'Quote Saved'
    				});
    			}
    		});
        });
	})


	app.get('*', function(req, res) {
        res.render('pages/index');
    });



//THIS IS THE USER SIGN IN CONDITIONS///



//THIS IS THE STAFF SIGN IN CONDITIONS///

    passport.use('local-admin', new localStrategy(function(username, password, done){
	    Staff.findOne({username: username, password: password}, function(err, staff){
	        if(staff){return done(null, staff);}
	    	return done(null, false, {message: 'Unable to login'});
	    });
	}));

	passport.serializeUser(function(staff, done) {
        done(null, staff);
    });
    passport.deserializeUser(function(staff, done) {
        done(null, staff);
    });


    // THIS IS THE Driver SIGN IN CONDITIONS//

    passport.use('local-driver', new localStrategy(function(username, password, done){
	    Driver.findOne({username: username, password: password}, function(err, driver){
	        if(driver){return done(null, driver);}
	    	return done(null, false, {message: 'Unable to login'});
	    });
	}));

	passport.serializeUser(function(driver, done) {
        done(null, driver);
    });
    passport.deserializeUser(function(driver, done) {
        done(null, driver);
    });



// EXPORT








/*td.authCode = function(callback) {

	var options = {
		key: 'c5c13f4fe1aac89e417c879c0d8554ae',
		response_type: 'code',
		client_id: 'iesgbqOcGs@tdispatch.com',
		//redirect_uri: '',
		scope: '',
		//grant_type: 'user',
		response_format: 'json'
	};

	options = func.param(options);

	var url = 'http://api.tdispatch.com/passenger/oauth2/auth?'+options;
	var databody = {'username': 'test444@test.com', 'password': '123'};

	needle.post(url, databody, function(err, resp, body) {
		callback(body['auth_code']);
	});
}*/

/*td.getTokens = function(authCode, callback) {
	var options = {
		code: ''+authCode+'',
		client_id: 'iesgbqOcGs@tdispatch.com',
		client_secret: 'PeYQRXDWWFAa3WQR7UwHJRs2DZD5eKsP',
		//redirect_uri: '',
		grant_type: 'authorization_code',
		response_format: 'json'
	};

	options = func.param(options);

	var url = 'http://api.tdispatch.com/passenger/oauth2/token';

	needle.post(url, options, function(err, resp, body) {
		callback(body);
	});

*/
/*td.authCode(function(authCode) {
	if(authCode) {
		td.getTokens(authCode, function(tokens) {
			td.saveTokens(tokens, function() {

			})

		})
		res.json({
			success: true,
			message: 'Auth Code Success',
			data: authCode
		});
	}
});*/
