app.config(function($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider

        .when('/', {
            templateUrl : 'app/components/home/con-web/index.html',
            controller  : 'HomeCtrl'
        })

        .when('/driver-terms', {
            templateUrl : 'app/components/home/con-web/driver-terms.html',
            controller  : 'HomeCtrl'
        })

        .when('/customer-terms', {
            templateUrl : 'app/components/home/con-web/con-terms.html',
            controller  : 'HomeCtrl'
        })

        .when('/drivers', {
            templateUrl : 'app/components/home/con-web/jobs.html',
            controller  : 'HomeCtrl'
        })

        .when('/contact', {
            templateUrl : 'app/components/home/con-web/contact.html',
            controller  : 'HomeCtrl'
        })
    
        .when('/forgotpassword', {
            templateUrl : 'app/components/home/con-web/forgotpassword.html',
            controller  : 'HomeCtrl'
        })
    
    .when('/forgotpasswordcode', {
            templateUrl : 'app/components/home/con-web/forgotpasswordcode.html',
            controller  : 'HomeCtrl'
        })
    
        .when('/faq', {
            templateUrl : 'app/components/home/con-web/faq.html',
            controller  : 'HomeCtrl'
        })

        .when('/dash', {
            templateUrl : 'app/components/dash/views/dash-instant.html',
            controller  : 'DashHomeCtrl',
            action      : 'dash-instant',
            type        : 'dash'
        })

        .when('/checkout', {
            templateUrl : 'app/components/dash/views/dash-checkout.html',
            controller  : 'CheckoutCtrl',
            //action    : 'dash-allmessages'
        })
    
    .when('/bookedjobs', {
            templateUrl : 'app/components/dash/views/bookedjobs.html',
            controller  : 'CheckoutCtrl',
            //action    : 'dash-allmessages'
        })
    
    .when('/bookinghistory', {
            templateUrl : 'app/components/dash/views/bookinghistory.html',
            controller  : 'CheckoutCtrl',
            //action    : 'dash-allmessages'
        })
    
    .when('/addcard', {
            templateUrl : 'app/components/dash/views/addcard.html',
            controller  : 'CheckoutCtrl',
            //action    : 'dash-allmessages'
        })

        .when('/checkout-2', {
            templateUrl : 'app/components/dash/views/dash-checkout-2.html',
            controller  : 'CheckoutCtrl',
            //action    : 'dash-allmessages'
        })

        .when('/checkout-3', {
            templateUrl : 'app/components/dash/views/dash-checkout-3.html',
            controller  : 'CheckoutCtrl',
            //action    : 'dash-allmessages'
        })

        .when('/about-us', {
            templateUrl : 'app/components/home/con-web/page.html',
            controller  : 'DashSignupCtrl',
            //action    : 'dash-allmessages'
        })

        .when('/driver-signup', {
            templateUrl : 'app/components/home/con-web/page2.html',
            controller  : 'ContractorSignupCtrl',
            //action    : 'dash-allmessages'
        })

        .when('/booking-complete', {
            templateUrl : 'app/components/dash/views/booking-complete.html',
            controller  : 'CheckoutCtrl',
            //action    : 'dash-allmessages'
        })

        .when('/job-form', {
            templateUrl : 'app/components/dash/views/jobform.html',
            controller  : 'CheckoutCtrl',
            //action    : 'dash-allmessages'
        })

        .when('/404-page', {
            templateUrl : 'app/components/home/404-page.html',
            controller  : 'HomeCtrl',
            //action    : 'dash-allmessages'
        })

        .otherwise({
            redirectTo: '/'
        });

        //$httpProvider.interceptors.push("authInter");
        $locationProvider.html5Mode(true);

});

/*app.run(function($http, $location, $rootScope, $localStorage) {
    $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {
        var type = current.type;
        console.log(type);

        if(type !== undefined) {
            var type = current.type;
            if(type == 'dash') {
                var token = $localStorage.token;
                if(token) {
                    console.log(token);
                    $http.post('/api/check-token', {data: token}).then(function(res) {
                        if(res.data.success == true) {
                            // verified
                            console.log('verified');
                            //details.loggedIn = true;
                        } else {
                            //details.loggedIn = false;
                            $location.path('/login');
                        }
                    })
                } else {
                    //details.loggedIn = false;
                    $location.path('/login');
                }
            }
        }
    })
})*/
