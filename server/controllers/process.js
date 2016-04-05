module.exports = function (app, bcryptnodejs, Q) {
    app.api.process = {};


    /**
     *   Get Process Template
     * */

    app.api.process.getProcessTemplates = function (req, res) {
        console.log("req.body", req.body);
        console.log("req.authToken", req.authToken.companyId);
        app.db.models.Company.findById(req.authToken.companyId, function (companyErr, companyData) {/*createdBy : req.authToken._id*/
            if (companyErr) {
                //console.log('error', err);
                res.send({status: false, message: 'Internal Server Error', error: companyErr});
            }
            else {
                console.log("companyData", companyData);
                app.db.models.ProcessTemplate.find({domain: companyData.domain}, function (err, list) {/*createdBy : req.authToken._id*/
                    if (err) {
                        //console.log('error', err);
                        res.send({status: false, message: 'Internal Server Error', error: err});
                    }
                    else {
                        //console.log("succes", list);
                        res.send({status: true, data: list});
                    }
                });
            }
        });
    };


    /**
     * Start Process
     *  req.body = {
            client: {
                email: '',
                password: ''
            },
            compliance: {
                email: '',
                password: ''
            },
            processTemplateId: ''
        };
     * */
    app.api.process.startprocess = function (req, res, next) {
        //console.log('req.authToken ', req.authToken);
        app.db.models.User.findOne({email: req.body.client.email}, function (clientErr, clientRecord) {/*productUser: req.user._id*/
                if (clientErr) {
                    console.log('Internal Server Error in finding client', clientErr);
                    res.send({status: false, message: 'Internal Server Error', error: clientErr});
                }
                else if (!clientRecord) {
                    bcryptnodejs.hash('123', null, null, function (hashErr, hash) {   // password will be changed
                        if (hashErr) {
                            console.log("error in hashing", hashErr);
                            res.send({status: false, message: 'Internal Error in Hashing', error: hashErr});
                        }
                        else {
                            //console.log("successfully hash");
                            var fullName = req.body.client.name.split(" ");
                            var userObject = {
                                "firstName": fullName.shift(),
                                "lastName": (fullName.join(" ") != '' || req.body.client.name.split(" ").shift()),
                                "email": req.body.client.email,
                                "password": hash,
                                "verified": "verified",
                                "companyId": req.authToken.companyId,
                                "type": "Client"
                            };
                            //console.log("userObject", userObject);
                            var newUser = new app.db.models.User(userObject);
                            newUser.save(function (newClientErr, newClient) {
                                if (newClientErr) {
                                    console.log("new client error", newClientErr);
                                    res.send({
                                        status: false,
                                        message: 'Internal Error in Saving Client',
                                        error: newClientErr
                                    });
                                }
                                else {
                                    process(newClient);
                                }
                            })
                        }
                    })
                }
                    //console.log("record not found!!!");
                    /* bcryptnodejs.hash('123', null, null, function (hashErr, hash) {   // password will be changed
                     if (hashErr) {
                     console.log("error in hashing", hashErr);
                     res.send({status: false, message: 'Internal Error in Hashing', error: hashErr});
                     }
                     else {
                     //console.log("successfully hash");
                     var fullName = req.body.client.name.split(" ");
                     var userObject = {
                     "firstName": fullName.shift(),
                     "lastName": (fullName.join(" ") != '' || req.body.client.name.split(" ").shift()),
                     "email": req.body.client.email,
                     "password": hash,
                     "verified": "verified",
                     "companyId": req.authToken.companyId,
                     "type": "Client"
                     };
                     //console.log("userObject", userObject);
                     var newUser = new app.db.models.User(userObject);
                     newUser.save(function (newClientErr, newClient) {
                     if (newClientErr) {
                     console.log("new client error", newClientErr);
                     res.send({
                     status: false,
                     message: 'Internal Error in Saving Client',
                     error: newClientErr
                     });
                     }
                     else {
                     //console.log(">>>>>>>>>>>>>>> new Client >>>>>>>>>>>>>>>>>>>", newClient);
                     app.db.models.User.findOne({email: req.body.compliance.email}, function (complianceErr, complianceRecord) {/!*productUser: req.user._id*!/
                     if (complianceErr) {
                     console.log('Internal Server Error in finding client', complianceErr);
                     res.send({
                     status: false,
                     message: 'Internal Server Error',
                     error: complianceErr
                     });
                     } else {
                     //console.log(">>>>>>>>>>>>>> complianceRecord >>>>>>>>>>>>>>>>>>>>", complianceRecord);
                     app.db.models.ProcessTemplate.findById(req.body.processTemplateId, function (processTemplateErr, processTemplateData) {
                     if (processTemplateErr) {
                     console.log('processTemplateErr ', processTemplateErr);
                     res.send({
                     status: false,
                     message: 'Internal Server Error',
                     error: processTemplateErr
                     });
                     }
                     else {
                     //console.log("processTemplateData found ", processTemplateData);
                     var urlToken = app.utils.generateConfirmationCode(30);
                     var processObject = {
                     title: processTemplateData.title,
                     domain: processTemplateData.domain,
                     clientId: newClient._id,
                     complianceOfficerId: complianceRecord._id,
                     createdBy: req.authToken._id,
                     steps: [],
                     token: urlToken,
                     processTemplateId: processTemplateData._id
                     };

                     for (var i = 0; i < processTemplateData.stepTemplates.length; i++) {
                     processObject.steps.push({
                     order: processTemplateData.stepTemplates[i].order,
                     status: 'waiting for signature',
                     templateId: processTemplateData.stepTemplates[i].documentTemplateId
                     });
                     }
                     var newProcess = new app.db.models.Process(processObject);
                     newProcess.save(function (newProcessErr, procesData) {
                     if (newProcessErr) {
                     console.log('Internal Error in Saving Process', newProcessErr);
                     res.send({
                     status: false,
                     message: 'Internal Error in Saving Process',
                     error: newProcessErr
                     });
                     } else {
                     app.utils.email.sendEmail(req.body, req.authToken, processTemplateData, urlToken, Q)
                     .then(function (data) {
                     console.log("email send  successfully");
                     res.send({status: true, data: data})
                     });
                     }
                     });
                     }
                     });
                     }
                     });
                     }
                     });
                     }
                     });*/

                else {
                    process(clientRecord);
                    //console.log(">>>>>>>>>>>>>>> clientRecord >>>>>>>>>>>>>>>>>>>", clientRecord);
                    /*app.db.models.User.findOne({email: req.body.compliance.email}, function (complianceErr, complianceRecord) {
                     if (complianceErr) {
                     console.log('Internal Server Error in finding client', complianceErr);
                     res.send({status: false, message: 'Internal Server Error', error: complianceErr});
                     } else {
                     //console.log(">>>>>>>>>>>>>> complianceRecord >>>>>>>>>>>>>>>>>>>>", complianceRecord);
                     app.db.models.ProcessTemplate.findById(req.body.processTemplateId, function (err, processTemplateData) {
                     if (err) {
                     console.log('error', err);
                     res.send({status: false, message: 'Internal Server Error', error: err});
                     }
                     else {
                     console.log("processTemplateData found", processTemplateData);
                     var urlToken = app.utils.generateConfirmationCode(30);
                     var processObject = {
                     title: processTemplateData.title,
                     domain: processTemplateData.domain,
                     clientId: clientRecord._id,
                     complianceOfficerId: complianceRecord._id,
                     createdBy: req.authToken._id,
                     steps: [],
                     token: urlToken,
                     processTemplateId: processTemplateData._id
                     };

                     for (var i = 0; i < processTemplateData.stepTemplates.length; i++) {
                     processObject.steps.push({
                     order: processTemplateData.stepTemplates[i].order,
                     status: 'waiting for signature',
                     templateId: processTemplateData.stepTemplates[i].documentTemplateId
                     });
                     }
                     var newProcess = new app.db.models.Process(processObject);
                     newProcess.save(function (processErr, procesData) {
                     if (processErr) {
                     console.log('Internal Error in Saving Process', processErr);
                     res.send({
                     status: false,
                     message: 'Internal Error in Saving Process',
                     error: processErr
                     });
                     } else {
                     app.utils.email.sendEmail(req.body, req.authToken, processTemplateData, urlToken, Q)
                     .then(function (data) {
                     console.log("email send  successfully");
                     res.send({status: true, data: data})
                     });
                     }
                     });
                     }
                     });
                     }
                     });*/
                }
            }
        );
        function process(clientRecord) {
            app.db.models.User.findOne({email: req.body.compliance.email}, function (complianceErr, complianceRecord) {
                if (complianceErr) {
                    console.log('Internal Server Error in finding client', complianceErr);
                    res.send({status: false, message: 'Internal Server Error', error: complianceErr});
                } else {
                    //console.log(">>>>>>>>>>>>>> complianceRecord >>>>>>>>>>>>>>>>>>>>", complianceRecord);
                    app.db.models.ProcessTemplate.findById(req.body.processTemplateId, function (err, processTemplateData) {
                        if (err) {
                            console.log('error', err);
                            res.send({status: false, message: 'Internal Server Error', error: err});
                        }
                        else {
                            console.log("processTemplateData found", processTemplateData);
                            var urlToken = app.utils.generateConfirmationCode(30);
                            var processObject = {
                                title: processTemplateData.title,
                                domain: processTemplateData.domain,
                                clientId: clientRecord._id,
                                complianceOfficerId: complianceRecord._id,
                                createdBy: req.authToken._id,
                                steps: [],
                                token: urlToken,
                                processTemplateId: processTemplateData._id
                            };

                            for (var i = 0; i < processTemplateData.stepTemplates.length; i++) {
                                processObject.steps.push({
                                    name: processTemplateData.stepTemplates[i].name,
                                    order: processTemplateData.stepTemplates[i].order,
                                    status: i > 0 ? ' ' : 'waiting for signature',
                                    templateId: processTemplateData.stepTemplates[i].documentTemplateId
                                });
                            }
                            var newProcess = new app.db.models.Process(processObject);
                            newProcess.save(function (processErr, procesData) {
                                if (processErr) {
                                    console.log('Internal Error in Saving Process', processErr);
                                    res.send({
                                        status: false,
                                        message: 'Internal Error in Saving Process',
                                        error: processErr
                                    });
                                } else {
                                    app.utils.email.sendEmail(req.body, req.authToken, processTemplateData, urlToken, Q)
                                        .then(function (data) {
                                            var process = procesData;
                                            delete process['token'];
                                            var resObj = {
                                                client: {
                                                    firstName: clientRecord.firstName,
                                                    lastName: clientRecord.lastName,
                                                    email: clientRecord.email
                                                },
                                                compliance: {
                                                    firstName: complianceRecord.firstName,
                                                    lastName: complianceRecord.lastName,
                                                    email: complianceRecord.email
                                                },
                                                process: process
                                            };
                                            console.log("email send  successfully", data);
                                            res.send({status: true, data: resObj})
                                        });
                                }
                            });
                        }
                    });
                }
            });
        }
    };

    /**
     *  get process
     * @param req
     * @param res
     */

    app.api.process.getprocess = function (req, res) {
        console.log("req.authToken", req.authToken.companyId);
        app.db.models.Process.find({createdBy: req.authToken._id}, function (processErr, processData) {/*createdBy : req.authToken._id*/
            if (processErr) {
                //console.log('error', err);
                res.send({status: false, message: 'Internal Server Error', error: processErr});
            }
            else {
                var idArray = [];
                //console.log("succes", processData);
                //res.send({status: true, data: processData});
                for (var i in processData) {
                    idArray.push(processData[i].clientId);
                }

                app.db.models.User.find({
                    _id: {$in: idArray}
                }, function (userErr, userData) {
                    if (userErr) {
                        //console.log('error', err);
                        console.log(idArray);
                        res.send({status: false, message: 'Internal Server Error278', error: userErr});
                    } else {
                        console.log(idArray);
                        var obj = {
                            users: userData,
                            process: processData
                        };
                        res.send({status: true, data: obj});
                    }
                })
            }
        });
    }
};