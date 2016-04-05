var moment = require('moment');
var path = require('path');

exports = module.exports = function (app, bcryptnodejs) {
    app.api.User = {};

    /**
     * req.body = {
     *   userEmail
     *   userPassword
     * }
     * */
    app.api.User.signin = function (req, next, cancel, bcryptnodejs) {
        app.db.models.User.findOne({email: req.body.email}, function (err, record) {
            if (err) {
                cancel();
            } else if (record) {
                console.log('COMPARING TOKEN');
                console.log('record', record);

                bcryptnodejs.compare(req.body.password, record.password, function (err, result) {
                    console.log(err);
                    console.log(result);

                    if (result) {
                        if (record.verified == 'verified') {
                            console.log('data' + result);
                            console.log('req.ip    ', req.ip);
                            next({
                                expire: moment(Date.now()).add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
                                contentType: req.get('Content-Type'),
                                userAgent: req.header('user-agent'),
                                firstName: record.firstName,
                                lastName: record.lastName,
                                email: record.email,
                                verified: record.verified,
                                companyId: record.companyId,
                                type: record.type,
                                _id: record._id
                            });
                        }
                        else {
                            cancel({
                                status: false,
                                message: 'Your Account is not activated, check your Email'
                            });
                        }
                    } else {
                        cancel();
                    }
                });
            } else {
                cancel();
            }
        });
    };

    /**
     * req.body = {
     *   userFirstName
     *   userLastName
     *   userEmail
     *   userPassword
     * }
     * */
    app.api.User.signup = function (req, res, next) {

        app.db.models.User.findOne({email: req.body.email}, function (userErr, userData) {
            if (userErr) {
                res.send({status: false, message: 'Internal Error while finding user!!', error: userErr});
            } else if (!userData) {
                app.db.models.Company.findOne({domain: req.body.domain}, function (companyErr, companyData) {
                    if (companyErr) {
                        res.send({status: false, message: 'Internal Error while finding Company!!', error: companyErr});
                    } else if (companyData) {
                        //(req.body.type != "Professional") ? signup(companyData) : res.send({status : false, message: 'Already have an account'})
                        signup(companyData)
                    } else {
                        if(req.body.type == "Professional"){
                            var newCompany = new app.db.models.Company({
                                title     : req.body.title,
                                domain   : req.body.domain,
                                picture    : 'https://media.licdn.com/mpr/mpr/shrink_200_200/AAEAAQAAAAAAAAU9AAAAJDIxMTE0ODUwLTdmYzAtNDk3OS1hMWUzLWMyODdiYTdlNWFkYQ.png'
                            });
                            newCompany.save(function (err3, data) {
                                if (err3) {
                                    console.log("Internal Error in Saving Company " , err3);
                                    res.send({status: false, message: "Internal Error in Saving Company", error: err3})
                                } else {
                                    console.log("company successfully created!!! ", data);
                                        signup(data);
                                    //res.send({status: true, data: data})
                                }
                            });
                        }
                        else {
                            res.send({status: false, message: req.body.type + " can't create company."});
                        }
                    }
                })
            }
            else {
                res.send({status: false, message: 'Email Address Already Exist!!'});
            }
        });
         function signup(company){
             bcryptnodejs.hash(req.body.password, null, null, function (err, hash) {
                 if (err) {
                     res.send({status: false, message: 'Internal Error in Hashing', error: err});
                 }
                 else {
                     //req.body.password = hash;
                     //req.body.verified = 'verified';
                     //req.body.type = 'Professional';
                     //req.body.companyId = company._id;
                     //var user = {
                     //    email: req.body.email,
                     //    confirmationCode: req.body.verified
                     //};
                     //app.utils.email.sendVerificationEmail(user);

                     var newUser = new app.db.models.User(req.body);
                     newUser.save(function (err2, data) {
                         if (err2) {
                             res.send({
                                 status: false,
                                 message: 'Internal Error in Saving User',
                                 error: err2
                             });
                         }
                         else {
                             res.send({status: true, data: true});
                         }
                     })
                 }
             });
         }
    };


    app.api.User.confirmEmail = function (req, res, next) {

        res.render(path.join(__dirname, '../../client/confirmationEmail.html'), {
            signin: app.config.baseUrl
        });
        //app.db.models.User.findOneAndUpdate({verified: req.query.code}, {
        //    $set: {
        //        verified: 'verified'
        //    }
        //}, function (err, user) {
        //    if (err) {
        //        console.log('err');
        //        res.send({status: false, message: 'internal error'});
        //    }
        //
        //    else if (user) {
        //        console.log('Confirmed');
        //        res.render(path.join(__dirname, '../../client/confirmationEmail.html'),{
        //            signin: app.config.baseUrl
        //        });
        //    }
        //    else {
        //        console.log('invalid code');
        //        res.send({status: false, message: 'invalid code'});
        //    }
        //});
    };
    app.api.User.getCompliance = function (req, res) {
        console.log("req.params", req.params.complianceId);
        app.db.models.User.findById(req.params.complianceId, function (err, record) {
            if (err) {
                console.log("err", err);
                res.send({status: false, message: 'Internal Error while finding user!!', error: err});
            } else {
                console.log("record", record);
                var user = record;
                delete user.password;
                delete user['type'];
                delete user['verified'];

                res.send({status: true, data: user});
            }
        })
    }

};