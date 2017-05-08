// Ctrl For Signup
app.controller('DashSignupCtrl', function($scope, $http, $rootScope, validation, $location) {
    $scope.user = {};
    $scope.user.businesstype = 'Business Type';
    $scope.bizType = {
        availableOptions: [
          {name: 'Business Type', dis: true},
          {name: 'Removal Company'},
          {name: 'Courier'},
          {name: 'Clearance'},
          {name: 'Logistics'}
        ],
    };

    $scope.register = function(user){
        $http.post('/api/register', $scope.user).success(function(response){
            console.log(response);
//            if(response.message == 'the number is not in the right format'){
//                window.alert("The number must have the correct dial code ++4 ");
//            }
//            else{
//              //  $location.url("/dash");
//            }
            $rootScope.currentUser = user;
            console.log(user);
        });


        /*var valiOptions = [
            {eleName: 'userAddress1', type: 'text', msg: 'Please enter your address!'},
            {eleName: 'userDoorNumber', type: 'text', msg: 'Please enter your door number!'},
            {eleName: 'userCity', type: 'text', msg: 'Please enter your city!'},
            {eleName: 'userPostcode', type: 'postcode', msg: 'Please enter a valid from postcode!'},
            {eleName: 'userFirstname', type: 'name', msg: 'Please enter a valid Firstname!'},
            {eleName: 'userLastname', type: 'name', msg: 'Please enter a valid Lastname!'},
            {eleName: 'userMobile', type: 'number', msg: 'Please enter a valid Mobile Number!'},
            {eleName: 'userEmail', type: 'email', msg: 'Please enter a valid email address!'},
            {eleName: 'userUsername', type: 'text', msg: 'Please enter a username!'},
            {eleName: 'userPassword', type: 'password', msg: 'Please enter a password!'},
            {eleName: 'userPassword2', type: 'passwordConfirm', msg: 'Please confirm password!'},
        ]
        validation.checkVal(valiOptions, function(callback) {
            if(callback > 0) {
                return false
            } else {
                $http.post('/api/register', $scope.user)
                .success(function(user){
                    $rootScope.currentUser = user;
                    console.log(user);
                });
            }
        })*/
    };
})

// Ctrl For Signup
app.controller('DashLoginCtrl', function($scope, $http, $rootScope, $location, $route, $localStorage) {
    $scope.login = function(user, $event){
        $event.preventDefault();
        user.dashTrack = 'dash';
        $http.post('/api/login', user).then(function(response){
            console.log(response);
            if(response.data.success == true) {
                $localStorage['token'] = response.data.data;
                $location.url("/dash");
                $rootScope.currentUser = user;
                toastr.success(response.data.message);
            } else {
                toastr.error(response.data.message);
            }
        });
    };
})

app.controller('StaffSigninCtrl', function($scope, $http, $rootScope, $location) {
    $scope.signin = function(staff, $event){
        $event.preventDefault();
        $http.post('/api/signin', staff).success(function(response){
            $location.url("/admin");
            $rootScope.currentStaff = staff;
        });
    };
})

app.controller('DriverSigninCtrl', function($scope, $http, $rootScope, $location) {
    console.log("radio Phone");
    $scope.driversignin = function(driver, $event){
        $event.preventDefault();
        $http.post('/api/driversignin', driver).success(function(response){
            $location.url("/contractor-home");
            $rootScope.currentDriver = driver;
        });
    };
})


app.controller('DashUsersCtrl', function($scope, $http) {
      $scope.displayOneUser = function(id) {
        var temp = $scope.users.filter(function(ele){
            return ele._id == id;
        })
        $scope.username = temp[0]["username"];
        $scope.email = temp[0]["email"];
        $scope.address = temp[0]["address"];
        $scope.city = temp[0]["city"];
        $scope.postcode = temp[0]["postcode"];
        $scope.bank = temp[0]["bank"];
        $scope.acc = temp[0]["acc"];
        $scope.sc = temp[0]["sc"];
    };
    var refresh = function() {
        $http.post('/api/userlist').success(function(response) {
            $scope.users = response.data;
        });
    };
    refresh();
})

app.controller('DashDriversCtrl', function($scope, $http) {
    $scope.displayOneDriver = function(id) {
        var temp = $scope.drivers.filter(function(ele){
            return ele._id == id;
        })
        $scope.username = temp[0]["username"];
        $scope.email = temp[0]["email"];
        $scope.day = temp[0]["day"];
        $scope.month = temp[0]["month"];
        $scope.year = temp[0]["year"];
        $scope.address = temp[0]["address"];
        $scope.city = temp[0]["city"];
        $scope.postcode = temp[0]["postcode"];
        $scope.reg = temp[0]["reg"];
        $scope.bank = temp[0]["bank"];
        $scope.acc = temp[0]["acc"];
        $scope.sc = temp[0]["sc"];
    };
    var refresh = function() {
        $http.post('/api/driverlist').success(function(response) {
            $scope.drivers = response.data;
        });
    };
    refresh();
})

app.controller('DashStaffCtrl', function($scope, staff, $http, $rootScope) {
    $scope.staff = staff;
    $scope.addstaff = function(){
        //todo verify if the passwords are the same
        if(staff.password == staff.password2){
            $http.post('/api/addstaff', staff)
            .success(function(staff){
                $rootScope.currentUser = staff;
            });
        };
    };
    var refresh = function() {
        $http.post('/api/stafflist').success(function(response) {
            $scope.stafflist = response.data;
        });
    };
    refresh();
})

app.controller('ContractorSignupCtrl', function($scope, $http, $rootScope, driver) {

    $scope.driver = driver;
    $scope.signup = function(){
        //todo verify if the passwords are the same
            $http.post('/api/signup', driver).success(function(driver){
                $rootScope.currentUser = driver;
            });
    };
})

app.controller('AdminHomeCtrl', function($scope, $http) {
     var refresh = function() {
        $http.post('/api/driverlist').success(function(response) {
            var driverCount = Object.keys(response.data).length
            $scope.drivers = driverCount;
        });
    };
    var refine = function() {
        $http.post('/api/userlist').success(function(response) {
            var userCount = Object.keys(response.data).length
            $scope.users = userCount;
        });
    };
    refresh();
    refine();
})

// Ctrl For Dash
app.controller('DashHomeCtrl', function($scope) {
})

// Ctrl For Dash
app.controller('DashInstantCtrl', function($scope, $location, dashInstant, dashVans, maps, $http, tdispatch, bookingGrab, bookings, misc, user, stripeForm, rates, items) {

    //console.log(items['smItems']);

    var driveTime = 40;
    var fuelCost = 20;

    var tempItems = {
        0:{type: 'smItems', qty: 2},
        1:{type: 'mdItems', qty: 4},
        2:{type: 'lgItems', qty: 5}
    };

    var totalCuft = 0;
    var loadTime = 0;
    var unloadTime = 0;

    for(ti in tempItems) {
        var itemType = tempItems[ti].type;
        var itemQty = tempItems[ti].qty;
        var itemCuft = items[''+itemType+'']['cuFt'];
        loadTime = loadTime + (items[''+itemType+'']['loadTime'] * itemQty);
        unloadTime = unloadTime + (items[''+itemType+'']['unloadTime'] * itemQty);
        totalCuft = totalCuft + (itemCuft * itemQty);
    }

    var rate = 0;
    for(rat in rates) {
        var minRange = rates[rat].minRange;
        var maxRange = rates[rat].maxRange;
        if(totalCuft > minRange && totalCuft < maxRange) {
            var rate = rates[rat].rate;
        }
    }

    console.log('loadTime '+loadTime);
    console.log('unloadTime '+unloadTime);
    var totalTime = loadTime + unloadTime + driveTime;
    var workCost = totalTime * rate;
    var totalCost = workCost + fuelCost;
    console.log(totalCost);

    $scope.slider = $('.bslider').slider();
    $scope.slider.slider('setValue', 1);

    var realTime = new Date();
    $('#job-date-picker').datetimepicker({
        format: 'dd-mm-yy hh:ii',
        startDate: realTime,
        initialDate: realTime,
        todayHighlight: true,
    });

    $scope.dashInstant = dashInstant;
    $scope.dashVans = dashVans;
    $scope.tdispatch = tdispatch;
    $scope.booking = bookings;
    $scope.misc = misc;
    $scope.stripeForm = stripeForm;

    // Set up autocomplete
    $scope.address = dashInstant.address;

    $scope.autocompleteOptions = {
        componentRestrictions: { country: 'uk' },
        types: ['geocode']
    }
    // Start GMaps
    maps.init();

    // Hide Picker When selected
    $('#job-date-picker').datetimepicker().on('changeDate', function(ev){
        $('#job-date-picker').datetimepicker('hide');
    });

    $scope.showWaypointField = function(type) {
        var waypointFields = $('[data-address-type="'+type+'"]').length;
        var hiddenWaypointFields = $('[data-address-type="'+type+'"].hide').length;
        var waypointId = (waypointFields - hiddenWaypointFields) + 2;
        $('[data-address-type="'+type+'"][data-address-id="'+waypointId+'"]').removeClass("hide");
    }

    $scope.chooseVan = function(vanType, $event) {
        // Mark Chosen Van Box
        $('.panel-borders').removeClass('bord-picked');
        $.each($('.panel-borders'), function(i,v) {
            if($(v).attr('data-van') == vanType) {
                $(v).addClass('bord-picked');
            }
        });

        $scope.dashInstant.vanType = $scope.dashVans[vanType]['tdID'];
        $scope.dashInstant.vanName = $scope.dashVans[vanType]['vanType'];
        $scope.vanHourlyPrice = $scope.dashVans[vanType]['hourPriceDriver'];
        $scope.algoCalc();
    }

    $scope.reviewBooking = function() {
        $scope.stripeForm.checkCardRes(function(status) {
            if(status == true) {
                $scope.misc.hasCard = true;
            } else {
                $scope.misc.hasCard = false;
            }
        });
    }



    $scope.updateMaps = function() {
        if($scope.dashInstant.address.start_location.name.formatted_address) {
            $scope.dashInstant.address.start_location.lat =
            $scope.dashInstant.address.start_location.name.geometry.location.lat();
            $scope.dashInstant.address.start_location.lng =
            $scope.dashInstant.address.start_location.name.geometry.location.lng();
            $scope.dashInstant.address.start_location.name = $scope.dashInstant.address.start_location.name.formatted_address;
        }
        if($scope.address.end_location.name.formatted_address) {
            $scope.dashInstant.address.end_location.lat =
            $scope.dashInstant.address.end_location.name.geometry.location.lat();
            $scope.dashInstant.address.end_location.lng =
            $scope.dashInstant.address.end_location.name.geometry.location.lng();
            $scope.dashInstant.address.end_location.name = $scope.dashInstant.address.end_location.name.formatted_address;
        }
        if($scope.address.pickup1.formatted_address) {
            $scope.address.pickup1.name = $scope.address.pickup1.formatted_address;
        }
        if($scope.address.dropoff1.formatted_address) {
            $scope.address.dropoff1.name = $scope.address.dropoff1.formatted_address;
        }
        if($scope.address.pickup2.formatted_address) {
            $scope.address.pickup2.name = $scope.address.pickup2.formatted_address;
        }
        if($scope.address.dropoff2.formatted_address) {
            $scope.address.dropoff2.name = $scope.address.dropoff2.formatted_address;
        }
        if($scope.address.start_location.name !== '' && $scope.address.end_location.name !== '') {
            maps.setDirections($scope.address, function(distance) {
                var tempMiles = 0.000621371192237 * distance;
                $scope.dashInstant.fuelPrice = Math.round(tempMiles * 0.72);
                $scope.algoCalc();
            });
        }
    }

    $scope.algoCalc = function() {
        $scope.dashInstant.estiCalc = ($scope.vanHourlyPrice * $scope.dashInstant.jobHoursEsti) + $scope.dashInstant.fuelPrice;
        dashInstant.estiCalc = $scope.dashInstant.estiCalc;
        if($scope.dashInstant.fuelPrice > 0 && $scope.vanHourlyPrice > 0 && $scope.dashInstant.jobHoursEsti > 0) {
            // OK Hack
            $scope.$apply();
        }
    }

    $($scope.slider).on('change', function() {
        $scope.dashInstant.jobHoursEsti = $scope.slider.val()
        $scope.algoCalc();
    })

    $scope.tester = function(){
        // SAVES JOB TO DB
        $scope.misc.myBookingsReady = true;
        /*$http.post('/api/tester', {data: dashInstant}, function(data) {
            console.log(data);
        }, function(response){
            // DID NOT SAVE
        });*/
    }

    // NO SAVE ButTON
    $scope.saveInstantjob = function(){
        $http.post('/api/save-instant-job', {data: dashInstant}).then(function(res){
            // $scope.matchFields(res);
        }, function(response){
            // failure callback
        });
    }

    $scope.calcInstantJob = function() {
        $http.post('/api/tdispatch-calc', {data: dashInstant}).then(function(res){
            $scope.matchFields(res);
        }, function(response){
            // failure callback
        });
    }

    $scope.matchFields = function(res) {
        $scope.dashInstant.waitTime = 'Wait Time: '+res.data.data.fare.time_to_wait / 60+' Mins';
        $scope.dashInstant.suggestedPrice = res.data.data.fare.total_cost;
        dashInstant = $scope.dashInstant;
    }

    $scope.$watch('misc.dirtModalHack', function(newVal, oldVal) {
        console.log('hack '+newVal);
        if(newVal == true) {
            $('#review-booking-button').click();
        }
    })

})

app.controller('DashScheduleCtrl', function($scope, $location, dashInstant) {
    //
})

app.controller('DashRecurringCtrl', function($scope, $location, dashInstant) {
    //
})

app.controller('DashProjectCtrl', function($scope, $location, dashInstant) {
    //
})

app.controller('DashAddressBookCtrl', function($scope, $location, dashInstant) {
    //
})

app.controller('DashdriversearningsCtrl', function($scope, $http) {
    //
})

app.controller('DashAddressBookCtrl', function($scope, $http, $rootScope) {
    var idGrab = function() {
        return $rootScope.currentUser._id;
    }
    var refresh = function() {
        $http.post('/api/contactlist', {data:idGrab()}).success(function(response) {
            $scope.conlist = response.data;
            console.log($scope.conlist);
        });
    };
    refresh();
    $scope.addContact =function() {
        $http.post('/api/add-contact', {
            contact: $scope.contact,
            user: $rootScope.currentUser._id
        }).success(function(response){
            refresh();
        });
     };
})

app.controller('DashJobCompleteCtrl', function($scope, $location, dashInstant) {
})

// Ctrl For Navigation
app.controller('NaviCtrl', function($scope, views, $route, auth, $http, user, infoGrab, bookings, bookingGrab, bookings, email, $location, misc, stripeForm, cardDetails, currBooking, dashInstant, hackTools, $interval) {
    //
    $scope.views = views;
    views.currentView = $route.current.action;
    views.currentType = $route.current.type;
    views = $scope.views;

    //auth.intercept(views.currentType, function(response) {

        console.log(views);
        //if(response.success == true) {
            // Grab appRoute.js Action Param
            $scope.bookings = bookings;
            $scope.misc = misc;
            $scope.stripeForm = stripeForm;
            $scope.cardDetails = cardDetails;
            $scope.currBooking = currBooking;
            $scope.email = email;
            $scope.isEmailSent = '';
            $scope.dashInstant = dashInstant;
            $scope.hackTools = hackTools;

            /*if(response.message !== 'authenticated' && views.currentType == 'dash') {
                $location.path('/login');
            } else {
                $scope.user = user;
                $scope.email = email;
                $scope.isCardAdded = '';
            }*/

            $scope.cancelJob = function(jobPK) {
                $scope.hackTools.fixModalScroll('md-default');
                $http.post('/api/cancel-job', {data: jobPK}).success(function(resp) {
                    if(resp.success == true) {
                        $scope.misc.myBookingsReady = true;
                        toastr.success(resp.message);
                    } else {
                        toastr.error(resp.message);
                    }
                })
            }

            $scope.checkCard = function() {
                $scope.stripeForm.checkCard();
            }

            $scope.contactSend = function(){
                $http.post("/api/contact-send/", {email: $scope.email}).success(function(response){
                    if(response.success == true) {
                        // valid
                        $scope.email.emailAddress = '';
                        $scope.email.subject = '';
                        $scope.email.message = '';
                        $scope.isEmailSent = true;
                        $interval(function(test){
                            $scope.isEmailSent = false;
                            $interval.cancel();
                        },5000,0);
                    } else {
                        $scope.isEmailSent = false;
                        toastr.error(response.message);
                    }
                });
                console.log("test to see if email")
            };

           $scope.logout = function(){
               $http.post("/api/logout").success(function(){
                   $location.url("/login");
               });
           };

            $scope.displayOneBooking = function(id){
                $scope.hackTools.fixModalScroll('md-default');
                var temp = $scope.bookings.filter(function(ele){
                    return ele._id == id;
                })
                //$scope.currBooking = temp[0];
                $scope.currBooking.jobID = temp[0]["_id"];
                $scope.currBooking.jobPK = temp[0]["pk"];
                $scope.currBooking.jobName = temp[0]["jobName"];
                $scope.currBooking.jobHoursEsti = temp[0]["jobHoursEsti"];
                $scope.currBooking.pickUp = temp[0]["address"]["start_location"]["name"];
                $scope.currBooking.dropOff = temp[0]["address"]["end_location"]["name"];
                $scope.currBooking.jobDate = temp[0]["jobDate"];
                $scope.currBooking.driverNote = temp[0]["driverNote"];
                $scope.currBooking.vanType = temp[0]["vanType"];
                $scope.currBooking.fuelPrice = temp[0]["fuelPrice"];
                $scope.currBooking.suggestedPrice = temp[0]["suggestedPrice"];
                $scope.currBooking.userID = temp[0]["userID"];
                $scope.currBooking.driverName = temp[0]["driverName"];
                $scope.currBooking.driverPlate = temp[0]["driverPlate"];
                $scope.currBooking.driverColor = temp[0]["driverColor"];
                $scope.currBooking.driverPK = temp[0]["driverPK"];
                $scope.currBooking.driverPhone = temp[0]["driverPhone"];
            };

            /*var refresh = function() {
                $http.post('/api/grab-booking-info').success(function(response) {
                    $scope.bookings = response.data;
                });
            };
            refresh();*/

            $scope.displayProfile = function() {
                infoGrab.displayOneRecord(null, "User");
            }


            $scope.displayBooking = bookingGrab.displayAllRecords(null, "Quote", function(resp){
                console.log(resp);
                if(resp.success == true) {
                    $scope.bookings = resp.data;
                } else {
                    toastr.error(resp.message);
                }
            });

            $scope.checkBookingStatus = function(status1, status2, status3) {
                var flag = 0;
                for(var i = 0; $scope.bookings.length > i; i++) {
                    if(
                        $scope.bookings[i]['status'] !== status1 &&
                        $scope.bookings[i]['status'] !== status2 &&
                        $scope.bookings[i]['status'] !== status3)
                    {
                        flag++;
                    }
                }
                if(flag < 1) {
                    return true;
                } else {
                    return false;
                }
            }

            $scope.$watch('misc.myBookingsReady', function(newValue, oldValue) {
                if(newValue == true) {
                    $scope.displayBooking = bookingGrab.displayAllRecords(null, "Quote", function(resp){
                        $scope.bookings = resp;
                        $scope.misc.myBookingsReady = false;
                    });
                }
            });
        /*} else {
            // IF viewstype is dash or admin
            if(views.currentType == 'dash' || views.currentType == 'admin' || views.currentType == 'contractor') {
                $location.path('/login');
            }
        }*/
    //});
})


// Ctrl For Navigation
app.controller('NaviAdminCtrl', function($scope, views, $route, admin, $route, $http, $location, auth) {
    $scope.admin = admin;
    // Grab appRoute.js Action Param
    admin.currentView = $route.current.action;

//    $scope.views = views;
//    // Grab appRoute.js Action Param
//    views.currentType = $route.current.action.type;
//    views.currentView = $route.current.action.view;
//    views = $scope.views;
//    auth.intercept(views);
})

app.controller('DashDaccountCtrl', function($scope, $http, driver, Upload, driverDocs) {
    //
$scope.profile = 'start';
$scope.file = 'noFile';
$scope.driverDocs = driverDocs;
$scope.driver = driver;
$scope.deleted == false;

$scope.upload = function(file){

   console.log("this is working");
   $scope.file = 'file';

    $scope.submitFileInfo = function(docType){

       console.log("this is working");
       console.log(file);

        Upload.upload({
           url: '/api/driver-document-update',
           method: 'POST',
           data: {file: file, docType: docType}})
           .success(function(response){
               console.log("photo sent");
               console.log(response);
               $scope.driverDocs[response.data.docType] = response.data;
               console.log($scope.driverDocs);
               $scope.file = 'uploaded';
       });

//         $http.post('/api/driver-doucument-update', {"file":file}).success(function(response) {
//             console.log(resp);
//        });

   };

}


$scope.deleteFile = function() {


    $http.post('/api/delete-image', {image: driverDocs.insurance.image}).then(function(res) {
        if(res.data. success == true){
            refresh();
            $scope.file == 'noFile';
        }else{
            console.log("this didnt wokred");
        }
    })
}


$scope.editProfile = function(){
    console.log("this is working");
    $scope.firstedit = true;


}

 $scope.submitAccountInfo = function(){
        console.log($scope.driver);

        $http.post('/api/driver-account-update', $scope.driver).success(function(response) {
            console.log("we added the stuff");
            console.log(response);
            if (response.success == true){
                $scope.profile = 'updated';
                refresh();
            }
        });

    }


//    $scope.checkDriverCard = function() {
//        console.log("three");
//        if($scope.isCardAdded == 'added') {
//            console.log("four");
//
//        } else {
//            console.log("five");
//            $http.post('/api/check-driver-card').success(function(res) {
//                console.log("six");
//                console.log(res);
//                $scope.isCardAdded = res.message;
//                console.log($scope.isCardAdded);
//                $scope.cardDetails = {};
//                $scope.cardDetails.brand = res.data.brand;
//                $scope.cardDetails.last4 = res.data.last4;
//            })
//        }
//
//    }
//
//     $scope.getCardForm = function() {
//        $('#payment-form').submit(function(event) {
//            event.preventDefault();
//            var $form = $(this);
//
//            Stripe.setPublishableKey('pk_test_GrFP5ytVZ9Df9ZKztAJbiOmc');
//
//            Stripe.card.createToken($form, function(status, res) {
//               // console.log(res);
//                $http.post("/api/add-driver-card", res).success(function(status){
//                    console.log("one");
//                    if(status.success == true) {
//                        console.log("two");
//                        $scope.checkDriverCard();
//                    }
//                });
//            });
//        })
//    }

     var refresh = function(id, colName) {
        $http.post('/api/driver-account-details', {"id":id, "colName":colName}).success(function(response) {
            console.log(response);
            if(response.data){
                $scope.firstname = response.data.firstname
                $scope.lastname = response.data.lastname;
                $scope.mobile = response.data.mobile;
                $scope.vehicle = response.data.vehicle;
                $scope.username = response.data.username;
                $scope.address = response.data.address;
                $scope.bank = response.data.bank;
                $scope.acc = response.data.acc;
                $scope.sc = response.data.sc;
                $scope.reg = response.data.reg;
                $scope.make = response.data.make;
                $scope.model = response.data.model;
                $scope.fuel = response.data.fuel;
                $scope.colour = response.data.colour;
                $scope.number = response.data.number;
                $scope.expiry = response.data.expiry;
                $scope.year = response.data.year;
                $scope.firstedit = response.data.firstedit;
                $scope.image = response.data.image;
                if(response.data.docType == undefined) {
                    //
                } else {
                    $scope.docType = response.data.docType;
                    $scope.driverDocs[$scope.docType]["image"] = response.data.image;
                }

            }
        });
    };

    refresh();

    //

})

app.controller('DashDearningsCtrl', function($scope, $location) {
    //
})

app.controller('DashDnaviCtrl', function($scope, contractor, $route, $http, $location) {
    $scope.contractor = contractor;
    // Grab appRoute.js Action Param
    contractor.currentView = $route.current.action;
})

app.controller('CardAddedCtrl', function($scope, user, stripeForm, misc, hackTools) {
    $scope.user = user;
    $scope.stripeForm = stripeForm;
    $scope.misc = misc;

    $scope.addCard = function() {
        if($scope.misc.reviewCardRoute == true) {
            $scope.stripeForm.getCardFormRes(function(resp) {
                if(resp == true) {
                    misc.hasCard = true;
                    // DIRT HACK MODAL BUG
                    $('#add-card-close-icon').click();
                    $('#review-booking-modal').click();
                    $scope.hackTools.fixModalScroll('md-review');
                } else {
                    toastr.error(resp.message);
                }
            });
        } else {
            $scope.stripeForm.getCardForm(function(resp) {
                if(resp == true) {
                    //
                } else {
                    toastr.error(resp.message);
                }
            });
        }
    }

    $scope.removeCard = function() {
        $scope.stripeForm.removeCard(function(resp) {
            if(resp == true) {
                $scope.user.cardAdded = 'none';
            } else {
                toastr.error(resp.message);
            }
        });
    }

})


app.controller('ReviewBookingCtrl', function($scope, user, stripeForm, misc, dashInstant, $http, bookings, bookingGrab, deets, hackTools, func) {

    $scope.dashInstant = dashInstant;
    $scope.stripeForm = stripeForm;
    $scope.bookings = bookings;
    $scope.bookingGrab = bookingGrab;
    $scope.user = user;
    $scope.misc = misc;
    $scope.deets = deets;
    $scope.hackTools = hackTools;
    $scope.func = func;

    $scope.showAddCard = function() {
        //$('#payment-button:hidden').click();
        $scope.misc.reviewCardRoute = true;
    }

    // FROM BOOK BUTTON TO SERVER ROUTES (DATA IT SENDS: DASHINSTANT)
    $scope.bookInstantJob = function(){
        // if customer has card in mongo
        if(user.cardAdded == 'added') {
            // SAVES JOB TO DB
            $http.post('/api/tdispatch-book', {data: dashInstant}).then(function(resp){
                console.log(resp);
                if(resp.data.success == true) {
                    bookingGrab.displayAllRecords(null, "Quote", function(resp){
                        $scope.bookings = resp;
                        $scope.misc.myBookingsReady = true;
                        $('#review-booking-close').click();
                        $('#job-complete-modal').click();
                        // DIRT HACK MODAL BUG
                        $scope.hackTools.fixModalScroll('md-complete');
                        $scope.func.resetQuote();
                    });
                } else {
                    // NO BOOK
                    toastr.error(resp.data.message);
                }
            }, function(response){
                // failure callback
            });
        } else {
            // cant book need card
            document.getElementById('payment-button').click();
            $scope.stripeForm.checkCard();
        }
    }
})

// Ctrl For Home
app.controller('HomeCtrl', function($scope) {

})

app.controller('WebsiteCtrl', function($scope) {

})

app.controller('DashProfileCtrl', function($scope) {

})

app.controller('DashMessageCtrl', function($scope) {

})

app.controller('DashPaymentCtrl', function($scope) {

})

app.controller('DashStatusCtrl', function() {

})
