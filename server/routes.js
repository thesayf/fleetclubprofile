var sgHelper = require('sendgrid').mail;
var sg = require('sendgrid')('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');

module.exports = function(app, models, utils, cont, info) {

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

	// CHARGE CUSTOMER DEPOSIT WITH STRIPE
	app.post("/api/send-email", function(req, res) {
		req.body.data.msg = 'Vangrab.com Order Reciept\r_________________________________________________________\rThe Most Convenient Way To Move Anything!\r\rWhether you are moving flat or collecting new furniture from Ikea, eBay, Freecycle or Gumtree, the MoversPro web-app is the simplest, cheapest and quickest way to get a driver, on-demand.\r___________________________\rDATE & TIME\r'+req.body.data.jobDate+'\r___________________________\rPICK UP ADDRESS\r'+req.body.data.address.start_location.number+' '+req.body.data.address.start_location.name+'\r___________________________\rDROP OFF ADDRESS';

		req.body.data.msg = req.body.data.msg+'\r'+req.body.data.address.end_location.number+' '+req.body.data.address.end_location.name+'\r___________________________\rEXTRA HELPER\r'+req.body.data.extraHelp+'\r___________________________\rINVENTORY\rSmall Items x '+req.body.data.itemBoxes[0].qty;

		req.body.data.msg = req.body.data.msg+'\rMedium Items x '+req.body.data.itemBoxes[1].qty+'\rLarge Items x '+req.body.data.itemBoxes[2].qty+'\r___________________________\rTOTAL PRICE\r'+req.body.data.estiCalc+'\r___________________________\rDEPOSIT PAID\r'+req.body.data.deposit+'\r\rRefund Policy: A refund can be given at any time before a driver has been dispatched';

		//var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
		var request = sg.emptyRequest({
		  method: 'POST',
		  path: '/v3/mail/send',
		  body: {
		    personalizations: [
		      {
		        to: [
		          {
		            email: req.body.data.email,
		          },
		        ],
		        subject: 'TheVanClub.io Order Reciept',
		      },
		    ],
		    from: {
		      email: 'hello@thevanclub.io',
		    },
		    content: [
		      {
		        type: 'text/plain',
		        value: req.body.data.msg,
		      },
		    ],
		  },
		});


	//With callback
	sg.API(request, function(error, response) {
	  if (error) {
	    console.log('Error response received');
	  }
	  console.log(response.statusCode);
	  console.log(response.body);
	  console.log(response.headers);
	});

		//req.body.data.subject = 'Vangrab Order Reciept';

		/*var from_email = new utils.sgHelper.Email('hello@thevanclub.io');
		var to_email = new utils.sgHelper.Email(req.body.data.email);
		var subject = 'TheVanClub.io Order Reciept';
		var content = new utils.sgHelper.Content('text/plain', req.body.data.msg);
		var mailObj = new utils.sgHelper.Mail(from_email, subject, to_email, content);*/

		/*var request = utils.sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: emailObj.toJSON(),
    });

    utils.sg.API(request, function(error, response) {
        console.log(error);
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
    });*/

        /*cont.func.sendEmail(req.body.data, utils, function(resp) {
			if(resp == false) {
				// card declined
				cont.func.sendInfo(res, false, {message: 'Payment Failed!'})
			} else {
				// charge ok
				cont.func.sendInfo(res, true, {data: resp, message: 'Payment Successful!'})
			}
		})*/
	});

    // This shows the main angular index
    app.get('*', function(req, res) {
        res.render('pages/index');
    });



} // END EXPORT
