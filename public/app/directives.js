// Directives Path
var dir = 'app/components/';

app.directive('head', function() {
	return {
		templateUrl: dir+'head.html',
		controller: 'NaviCtrl',
	}
})

app.directive('navi', function() {
	return {
		templateUrl: dir+'navi.html',
		controller: 'NaviCtrl',
	}
})

// DASH PAGES
app.directive('dashHome', function() {
	return {
		templateUrl: dir+'dash/views/dash-home.html',
		controller: 'NaviCtrl',
	}
})

app.directive('dashInstant', function() {
	return {
		templateUrl: dir+'dash/views/dash-instant.html',
		controller: 'DashInstantCtrl',
	}
})




app.directive('dashRoutePlan', function() {
	return {
		templateUrl: dir+'dash/views/modals/dash-route-plan.html',
		controller: 'DashInstantCtrl',
	}
})

app.directive('dashVanType', function() {
	return {
		templateUrl: dir+'dash/views/modals/dash-van-type.html',
		controller: 'DashInstantCtrl',
	}
})




app.directive('contractorHome', function() {
	return {
		templateUrl: dir+'contractors/views/contractor-home.html',
		controller: 'DashDaccountCtrl',
	}
})


app.directive('naviContractor', function() {
	return {
		templateUrl: dir+'navi-contractor.html',
		controller: 'DashDnaviCtrl',
	}
})



app.directive('reviewBooking', function() {
	return {
		templateUrl: dir+'dash/views/modals/review-booking.html',
		controller: 'DashInstantCtrl',
	}
})

app.directive('cubicLimit', function() {
	return {
		templateUrl: dir+'dash/views/modals/cubic-limit.html',
		controller: 'DashInstantCtrl',
	}
})

app.directive('checkout', function() {
	return {
		templateUrl: dir+'dash/views/dash-checkout.html',
		controller: 'CheckoutCtrl',
	}
})

app.directive('checkoutTwo', function() {
	return {
		templateUrl: dir+'dash/views/dash-checkout-2.html',
		controller: 'CheckoutCtrl',
	}
})

app.directive('checkoutThree', function() {
	return {
		templateUrl: dir+'dash/views/dash-checkout-3.html',
		controller: 'CheckoutCtrl',
	}
})

app.directive('bookingComplete', function() {
	return {
		templateUrl: dir+'dash/views/booking-complete.html',
		controller: 'CheckoutCtrl',
	}
})
