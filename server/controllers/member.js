var member = {};

member.register = function(User, req, query, cont, callback) {
    User.findOne(query, function(err, user){
        if(user){
            callback({status: false, msg: 'This user already exists'});
        } else {
            var user = new User();
            user.username = req.body.username;
            user.password = req.body.password;
            //user.email = req.body.email;
            //user.businessname = req.body.businessname;
            //user.address = req.body.address;
            //user.doornumber = req.body.doornumber;
            //user.city = req.body.city;
            //user.postcode = req.body.postcode;
            user.businesstype = req.body.businesstype;
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;
            user.mobile = req.body.mobile;
            user.accountType = 'dash';

            // Save to mongo
            user.save(function(err, user){
                if(err) {console.log(err);} else {
                    callback({status: true, user: user});
                }
                // Create Tdispatch account for user
                /*cont.td.createAccount(user, function(data) {
                    // Save xtra details from tdisptch to user db
                   if(data.status = "Failed"){
                       callback({status: false, msg: "the number is not in the right format"});
                   }*/
                   /*cont.td.saveAccountDetails(User, data, user, function(status) {
                       console.log(status);
                        if(status == true) {
                            callback({status: true, user: user});
                        }
                    })*/
                //})
            });
        } //else close
    });
}


module.exports = member;
