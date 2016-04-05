exports = module.exports = function (app, bcryptnodejs, request, Q, async, path) {

    app.api.DocuSign = {};

    //****************************** get docusign templates *******************************************

    app.api.DocuSign.getTemplates = function (req, res, next) {
        console.log("in templates db2", req.authToken.userId);
        app.db.models.Templates.find({}, function (err, list) {/*productUser: req.user._id*/
            if (err) {
                console.log('error', err);
                res.send({status: false, message: 'Internal Server Error', error: err});
            }
            else {
                console.log("succes", list);
                res.send({status: true, data: list});
            }
        });
    };

    //******************************** email send process *******************************************

    app.api.DocuSign.process = function (req, res, next) {
        //console.log('req.body in process', req.body);
        //console.log('req.authToken in process', req.authToken);
        app.db.models.User.findOne({userEmail: req.body.client.email}, function (clientErr, clientRecord) {/*productUser: req.user._id*/
                if (clientErr) {
                    console.log('Internal Server Error in finding client', clientErr);
                    res.send({status: false, message: 'Internal Server Error', error: clientErr});
                } else if (!clientRecord) {
                    bcryptnodejs.hash('123', null, null, function (hashErr, hash) {   // password will be changed
                        if (hashErr) {
                            res.send({status: false, message: 'Internal Error in Hashing', error: hashErr});
                        }
                        else {
                            var fullName = req.body.client.name.split(" ");
                            var userObject = {
                                "userFirstName": fullName.shift(),
                                "userLastName": fullName.join(" "),
                                "userEmail": req.body.client.email,
                                "userPassword": hash,
                                "verified": "verified",
                                "companyId": {
                                    "$oid": "56ec1286daab0d280aa2fe8c"
                                },
                                "type": "client"
                            };
                            var newUser = new app.db.models.User(userObject);
                            newUser.save(function (newClientErr, newClient) {
                                if (newClientErr) {
                                    res.send({
                                        status: false,
                                        message: 'Internal Error in Saving User',
                                        error: newClientErr
                                    });
                                }
                                else {
                                    console.log(">>>>>>>>>>>>>>> new Client >>>>>>>>>>>>>>>>>>>", clientRecord);
                                    app.db.models.User.findOne({userEmail: req.body.compliance.email}, function (complianceErr, complianceRecord) {/*productUser: req.user._id*/
                                        if (complianceErr) {
                                            console.log('Internal Server Error in finding client', complianceErr);
                                            res.send({
                                                status: false,
                                                message: 'Internal Server Error',
                                                error: complianceErr
                                            });
                                        } else {
                                            console.log(">>>>>>>>>>>>>> complianceRecord >>>>>>>>>>>>>>>>>>>>", complianceRecord);
                                            var urlToken = app.utils.generateConfirmationCode(30);
                                            console.log("data in confirmation docusign.js", urlToken);
                                            var processObject = {
                                                title: 'process',
                                                domain: 'www.wealthtab.com',
                                                picture: 'abc',
                                                client: clientRecord._id,
                                                complianceOfficer: complianceRecord._id,
                                                Professional: req.authToken.userId,
                                                status: '20',
                                                token: urlToken,
                                                templateId: req.body.item.templateId
                                            };
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
                                                    app.utils.email.sendEmail(req.body, urlToken, Q)
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
                else {
                    //request.post({
                    //        url: 'http://localhost:3000/api/signin', form: {
                    //            userEmail: req.body.client.email,
                    //            userPassword: '123'                        // ask by client
                    //        }
                    //    },
                    //    function (err4, httpResponse, body) {
                    //        if (err4) {
                    //            res.send({status: false, message: 'Error in signing', error: err4})
                    //        } else {
                    //            app.utils.email.sendEmail(req.body, JSON.parse(body), Q)
                    //                .then(function (data) {
                    //                    console.log("email send  successfully");
                    //                    res.send({status: true, data: data})
                    //                })
                    //
                    //        }
                    //    })
                    console.log(">>>>>>>>>>>>>>> clientRecord >>>>>>>>>>>>>>>>>>>", clientRecord);
                    app.db.models.User.findOne({userEmail: req.body.compliance.email}, function (complianceErr, complianceRecord) {/*productUser: req.user._id*/
                        if (complianceErr) {
                            console.log('Internal Server Error in finding client', complianceErr);
                            res.send({status: false, message: 'Internal Server Error', error: complianceErr});
                        } else {
                            console.log(">>>>>>>>>>>>>> complianceRecord >>>>>>>>>>>>>>>>>>>>", complianceRecord);
                            var urlToken = app.utils.generateConfirmationCode(30);
                            console.log("data in confirmation docusign.js", urlToken);
                            var processObject = {
                                title: 'process',
                                domain: 'www.wealthtab.com',
                                picture: 'abc',
                                client: clientRecord._id,
                                complianceOfficer: complianceRecord._id,
                                Professional: req.authToken.userId,
                                status: '20',
                                token: urlToken,
                                templateId: req.body.item.templateId
                            };
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
                                    app.utils.email.sendEmail(req.body, urlToken, Q)
                                        .then(function (data) {
                                            console.log("email send  successfully");
                                            res.send({status: true, data: data})
                                        });
                                }
                            });
                        }
                    });
                }
            }
        );
    };

    //***************************** get document template *******************************************

    app.api.DocuSign.signdocument = function (req, response, next) {
        console.log(req.body.token);
        app.db.models.Process.findOne({token: req.body.token}, function (processErr, processRecord) {
            if (processErr) {
                console.log("err", processErr);
                response.send({
                    status: false,
                    message: 'Internal Error in finding Process',
                    error: processErr
                });
            } else {
                console.log('record', processRecord);
                app.db.models.User.findById(processRecord.client, function (userErr, userRecord) {
                    if (userErr) {
                        console.log("userErr", userErr);
                    } else {
                        console.log("successfully find user", userRecord);
                        var email = app.config.docuSignEmail,				// your account email
                            password = app.config.docuSignPassword,			// your account password
                            integratorKey = app.config.docuSignIntegratorKey,			// your Integrator Key (found on the Preferences -> API page)
                            recipientName = userRecord.userFirstName + userRecord.userFirstName,			// recipient (signer) name
                            recipientEmail = userRecord.userEmail,			// copy document with this name into same directory!
                            templateId = processRecord.templateId,                   // ID of the Template you want to create the Envelope with
                            templateRoleName = 'signer',                   // Role Name of the Template
                            envelopeId = "",
                            baseUrl = "", 				// we will retrieve this through the Login call
                            status = "";
                        async.waterfall(
                            [
                                //////////////////////////////////////////////////////////////////////
                                // Step 1 - Login (used to retrieve accountId and baseUrl)
                                //////////////////////////////////////////////////////////////////////
                                function (next) {
                                    var url = "https://demo.docusign.net/restapi/v2/login_information";
                                    var body = "";	// no request body for login api call

                                    // set request url, method, body, and headers
                                    var options = initializeRequest(url, "GET", body, email, password, integratorKey);

                                    // send the request...
                                    request(options, function (err, res, body) {
                                        if (!parseResponseBody(err, res, body)) {
                                            return;
                                        }
                                        baseUrl = JSON.parse(body).loginAccounts[0].baseUrl;
                                        next(null); // call next function
                                    });
                                },

                                //////////////////////////////////////////////////////////////////////
                                // Step 2 - Send envelope with one Embedded recipient (using clientUserId property)
                                //////////////////////////////////////////////////////////////////////
                                function (next) {
                                    //console.log(templateId);
                                    var url = baseUrl + "/envelopes";
                                    var body = JSON.stringify({
                                        "emailSubject": "Please review and sign document!!",
                                        "templateId": templateId,
                                        "templateRoles": [{
                                            "email": recipientEmail,
                                            "name": recipientName,
                                            "roleName": templateRoleName,
                                            "clientUserId": "200",	// user-configurable,
                                            "routingOrder": "1"
                                        },
                                            {
                                                "email": "zeeshanhanifpc@gmail.com",
                                                "name": "zeeshan hanif",
                                                "roleName": "complianceOfficer",           // "roleName": "carbonCopies",
                                                "routingOrder": "2"
                                            }

                                        ],
                                        "status": "sent"
                                    });


                                    // set request url, method, body, and headers
                                    var options = initializeRequest(url, "POST", body, email, password, integratorKey);

                                    // send the request...
                                    request(options, function (err, res, body) {
                                        if (!parseResponseBody(err, res, body)) {
                                            return;
                                        }
                                        // parse the envelopeId value from the response
                                        envelopeId = JSON.parse(body).envelopeId;
                                        status = JSON.parse(body).status;
                                        next(null); // call next function
                                    });
                                },
                                ////////////////////////////////////////////////////////////////////
                                // Step 3 - Get the Embedded Signing View (aka the recipient view)
                                //////////////////////////////////////////////////////////////////////
                                function (next) {
                                    var url = baseUrl + "/envelopes/" + envelopeId + "/views/recipient";
                                    var method = "POST";
                                    var body = JSON.stringify({
                                        "returnUrl": "http://www.docusign.com/devcenter",
                                        "authenticationMethod": "email",
                                        "email": recipientEmail,
                                        "userName": recipientName,
                                        "clientUserId": "200"	// must match clientUserId in step 2!
                                    });

                                    // set request url, method, body, and headers
                                    var options = initializeRequest(url, "POST", body, email, password, integratorKey);

                                    // send the request...
                                    request(options, function (err, res, body) {
                                        if (res.statusCode != 200 && res.statusCode != 201) { // success statuses
                                            console.log("Error calling webservice, status is: ", res.statusCode);
                                            console.log("\r\n", err);
                                            response.send(err)
                                        }
                                        else {
                                            var newrecipient = new app.db.models.Recipient(
                                                {
                                                    recipientName: userRecord.userFirstName + userRecord.userFirstName,
                                                    recipientEmail: userRecord.userEmail,
                                                    recipientUser: userRecord._id,
                                                    envelopeId: envelopeId,
                                                    status: status
                                                });
                                            newrecipient.save(function (recipientErr, recipientData) {
                                                if (recipientErr) {
                                                    console.log("in add recipient Error", recipientErr);
                                                } else {
                                                    request.post({
                                                            url: 'http://localhost:3000/api/signin', form: {
                                                                userEmail: userRecord.userEmail,
                                                                userPassword: '123'                        // ask by client
                                                            }
                                                        },
                                                        function (err4, httpResponse, signingbody) {
                                                            if (err4) {
                                                                res.send({
                                                                    status: false,
                                                                    message: 'Error in signing',
                                                                    error: err4
                                                                })
                                                            } else {
                                                                console.log("signingbody", signingbody);
                                                                console.log("\nNavigate to the above URL to start the Embedded Signing workflow...");
                                                                response.send({
                                                                    status: true,
                                                                    url: JSON.parse(body),
                                                                    data: JSON.parse(signingbody)
                                                                });
                                                                console.log(__dirname);
                                                                //response.redirect('/');
                                                            }
                                                        })
                                                }
                                            });
                                        }
                                    });
                                }
                            ]);
                    }
                })
            }
        });
    };

    //***********************************************************************************************
    // --- HELPER FUNCTIONS ---
    //***********************************************************************************************
    function initializeRequest(url, method, body, email, password, integratorKey) {
        var options = {
            "method": method,
            "uri": url,
            "body": body,
            "headers": {}
        };
        addRequestHeaders(options, email, password, integratorKey);
        return options;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    function addRequestHeaders(options, email, password, integratorKey) {
        // JSON formatted authentication header (XML format allowed as well)
        dsAuthHeader = JSON.stringify({
            "Username": email,
            "Password": password,
            "IntegratorKey": integratorKey	// global
        });
        // DocuSign authorization header
        options.headers["X-DocuSign-Authentication"] = dsAuthHeader;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    function parseResponseBody(err, res, body) {
        console.log("\r\nAPI Call Result: \r\n", JSON.parse(body));
        if (res.statusCode != 200 && res.statusCode != 201) { // success statuses
            console.log("Error calling webservice, status is: ", res.statusCode);
            console.log("\r\n", err);
            return err;
        }
        return body;
    }

};