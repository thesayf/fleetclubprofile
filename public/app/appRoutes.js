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
            type        : 'protected'
        })

        .when('/checkout', {
            templateUrl : 'app/components/dash/views/dash-checkout.html',
            controller  : 'CheckoutCtrl',
            //action    : 'dash-allmessages'
            type        : 'protected'
        })

    .when('/bookedjobs', {
            templateUrl : 'app/components/dash/views/bookedjobs.html',
            controller  : 'CheckoutCtrl',
            //action    : 'dash-allmessages'
            type        : 'protected'
        })

    .when('/bookinghistory', {
            templateUrl : 'app/components/dash/views/bookinghistory.html',
            controller  : 'CheckoutCtrl',
            //action    : 'dash-allmessages'
            type        : 'protected'
        })

    .when('/addcard', {
            templateUrl : 'app/components/dash/views/addcard.html',
            controller  : 'CheckoutCtrl',
            //action    : 'dash-allmessages'
            type        : 'protected'
        })

        .when('/checkout-2', {
            templateUrl : 'app/components/dash/views/dash-checkout-2.html',
            controller  : 'CheckoutCtrl',
            //action    : 'dash-allmessages'
            type        : 'protected'
        })

        .when('/checkout-3', {
            templateUrl : 'app/components/dash/views/dash-checkout-3.html',
            controller  : 'CheckoutCtrl',
            //action    : 'dash-allmessages'
            type        : 'protected'
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
            type        : 'protected'
        })

        .when('/job-form', {
            templateUrl : 'app/components/dash/views/jobform.html',
            controller  : 'CheckoutCtrl',
            //action    : 'dash-allmessages'
            type        : 'protected'
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

app.run(function($http, $localStorage, $log, $location, details, $rootScope) {
    //$('body').hide();
    $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {
        if(current.$$route.type) {
            var type = current.$$route.type;
            if(type !== undefined) {
                var type = current.$$route.type;
                if(type == 'protected') {
                    var token = $localStorage.vctoken;
                    if(token) {
                        $http.post('/api/member/check-token', {data: token}).then(function(res) {
                            if(res.data.success == true) {
                                // verified
                                details.loggedIn = true;
                            } else {
                                details.loggedIn = false;
                                $location.path('/');
                            }
                        })
                    } else {
                        details.loggedIn = false;
                        $location.path('/');
                    }
                }
            }
        }
        $('.modal-backdrop').hide();
    })
})
