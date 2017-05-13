var sgHelper = require('sendgrid').mail;
var sg = require('sendgrid')('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');
var jwtSecret 	= 'jwtSecretKey';
var jwt = require('jsonwebtoken');

module.exports = function(app, models, utils, cont, info) {

	app.post('/api/member/process-signup', function(req, res) {
		cont.func.checkDuplicate(models.User, 'email', req.body.email, function(resp) {
			if(resp.status == true) {
				// there's a duplicate
				cont.func.sendInfo(res, resp.status,
					{message: 'This Email is already signed up. Login or reset password.'});
			} else {
				// No duplicate in mongo so add record
				cont.func.addRecord(models.User, req.body, function(recordStatus) {
					var token = jwt.sign(req.body.email, jwtSecret);
					console.log('tok: '+token);
					cont.func.sendInfo(res, recordStatus,
						{data: token, message: 'Account match!.'});
				})
			}
		})
	})

	app.post('/api/member/process-login', function(req, res) {
		cont.func.checkDuplicate(models.User, ['email', 'password'], [req.body.email, req.body.password], function(duplicate) {
			if(duplicate.status == true) {
				// there's an account match
				var token = jwt.sign(req.body.email, jwtSecret);
				cont.func.sendInfo(res, duplicate.status,
					{data: {data: duplicate.data._id, token: token, message: 'Account match!.'}});
			} else {
				// No duplicate in mongo so no account matches
				cont.func.sendInfo(res, duplicate.status,
					{message: 'Email does not exist. Signup today!'});
			}
		})
	})

	app.post('/api/member/check-token', function(req, res) {
		var token = req.body.data;
		if(token !== false) {
			var decodedEmail = jwt.verify(token, jwtSecret);
			if(decodedEmail) {
				cont.func.sendInfo(res, true, {message: 'authenticated'});
			} else {
				cont.func.sendInfo(res, false, {errMessage: 'Invalid'});
			}
		} else {
			cont.func.sendInfo(res, false, {errMessage: 'Invalid'});
		}
	});

	app.post('/api/member/forgot-pass', function(req, res) {
		cont.func.checkDuplicate(models.User, ['email'], [req.body.email], function(duplicate) {
			if(duplicate.status == true) {
				var emailCode = utils.uuid();
				cont.func.updateRecordByEmail(models.User, {'emailToken': emailCode}, req.body.email, function(status) {

					if(status == true) {

						var nodemailer = require('nodemailer');
						var sgTransport = require('nodemailer-sendgrid-transport');

						// api key https://sendgrid.com/docs/Classroom/Send/api_keys.html
						var options = {
							auth: {
								api_key: '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'
							}
						}
						var mailer = nodemailer.createTransport(sgTransport(options));

						var email = {
							to: [req.body.email],
							from: 'hello@fleetclub.io',
							subject: 'FleetClub Password Reset',
							text: 'FleetClub Password Reset\r\r_________________________________________________________\r\rFollow the link to reset your password\r\rhttps://fleetalpha.herokuapp.com/forgotpasswordcode?token='+emailCode+''
						};

						mailer.sendMail(email, function(err, resp) {
							if(err) {
								cont.func.sendInfo(res, true, {message: 'If the account exists it will recieve an email.'});
							}
							cont.func.sendInfo(res, true, {message: 'If the account exists it will recieve an email.'});
						});

					} else {
						cont.func.sendInfo(res, true, {message: 'If the account exists it will recieve an email.'});
					}

				})
			} else {
				cont.func.sendInfo(res, true, {message: 'If the account exists it will recieve an email.'});
			}
		})
	});

	app.post('/api/member/reset-pass', function(req, res) {
		cont.func.checkDuplicate(models.User, ['emailToken'], [req.body.emailToken], function(duplicate) {
			if(duplicate.status == true) {
				mongoData = {
					selector: 'emailToken',
					selectorVal: req.body.emailToken,
					col: models.User,
					fields: ['password', 'emailToken'],
					newValues: [req.body.password, '']
				};
				cont.func.updateMongoFields(mongoData, function(status) {
					if(status == true) {
						cont.func.sendInfo(res, status, {message: 'Password has been reset.'});
					} else {
						cont.func.sendInfo(res, status, {message: 'Password has not been reset. Please try again.'})
					}
				})
			} else {
				cont.func.sendInfo(res, false, {message: 'Could not find account, please reset your password again.'})
			}
		})
	})

	// CHARGE CUSTOMER DEPOSIT WITH STRIPE
	app.post("/api/charge-card", function(req, res) {
        cont.stripePay.chargeCustomer(req.body.user.deposit, req.body.user.email, req.body.user.name, req.body.stripe.id, function(resp) {
			if(resp == false) {
				// card declined
				cont.func.sendInfo(res, false, {message: 'Payment Failed!'})
			} else {
				// charge ok
				cont.func.sendInfo(res, true, {data: resp, message: 'Payment Successful!'})
			}
		})
	});

	app.post('/api/list-drivers', function(req, res) {
		cont.swift.listDrivers(utils.needle, function(resp) {
			var driverTemp = [];
			for(key in resp) {
				driverTemp.push({id: resp[key].identifier});
			}
			cont.func.sendInfo(res, true, {data: driverTemp, message: 'Got Driver List'})
		})
	})

	app.post('/api/book-job', function(req, res) {
		cont.swift.bookJob(utils.rest, req.body.data, function(resp) {
			//currentStatus
			var obj = JSON.parse(resp.rawEncoded);
			console.log(obj);
			if(obj['delivery']) {
					if(obj['delivery']['currentStatus']) {
							var stat = obj['delivery']['currentStatus'];
							if(stat == 'Received') {
								cont.func.sendInfo(res, true, {message: 'Booking Successful!'});
							} else {
								cont.func.sendInfo(res, false, {message: 'Booking Failed!'});
							}
					} else {
						cont.func.sendInfo(res, false, {message: 'Booking Failed!'});
					}
			} else {
				cont.func.sendInfo(res, false, {message: 'Booking Failed!'});
			}
		})
	})


	// This shows the main angular index
	app.get('*', function(req, res) {
	    res.render('pages/index');
	});



} // END EXPORT
