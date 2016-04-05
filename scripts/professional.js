var app = {};
var mongoose = require('mongoose');
var bcryptnodejs = require('bcrypt-nodejs');
require('../server/config/config.js')(app);
mongoose.connect(app.config.mongodbURL);
app.db = mongoose.connection;
app.db.on('error', console.error.bind(console, 'connection error:'));
app.db.once('open', function () {
        // Wait for the database connection to establish, then start the app.
        console.log('CONNECTION OPENED!!');


        var userSchema = new mongoose.Schema({
            firstName: {type: String, required: true},
            lastName: {type: String, required: true},
            email: {type: String, unique: true, required: true},
            password: {type: String, required: true},
            verified: {type: String, required: true},
            companyId: {type: mongoose.Schema.Types.ObjectId, ref: "Company"},
            type: {type: String, required: true}
        });

        var user = mongoose.model('User', userSchema);
        bcryptnodejs.hash('123', null, null, function (err1, hash) {

            if (err1) {
                console.log("Internal Error in Hashing password ", err1);
                //res.send({status: false, message: 'Internal Error in Hashing', error: err1});
            }
            else {
                var newUser = new app.db.models.User({
                    firstName: 'zeeshan',
                    lastName: 'hanif',
                    email: 'itpshouse@gmail.com',
                    password: hash,
                    verified: 'verified',
                    companyId: '56ec1286daab0d280aa2fe8c',
                    type: 'client'
                });
                newUser.save(function (err2, data) {
                    if (err2) {
                        console.log("Internal Error in Saving User ", err2);
                        //res.send({status: false, message: "Internal Error in Saving User", error: err2})
                    } else {
                        console.log("successfully created!!! ", data);
                        //res.send({status: true, data: data})
                    }
                });
            }
        });
    }
);


