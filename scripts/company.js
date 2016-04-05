var app = {};
var mongoose = require('mongoose');
require('../server/config/config.js')(app);
mongoose.connect(app.config.mongodbURL);
app.db = mongoose.connection;
app.db.on('error', console.error.bind(console, 'connection error:'));
app.db.once('open', function () {
    // Wait for the database connection to establish, then start the app.
    console.log('CONNECTION OPENED!!');
    var companySchema = new mongoose.Schema({
        title: {type: String, required: true},
        domain: {type: String, unique: true, required: true},
        picture: {type: String, required: true}
    });
    var company = mongoose.model('Company', companySchema);

    //company.findOne({companyDomain: req.body.companyDomain}, function (err, company) {
    //    if (err) {
    //        res.send({status: false, message: "Internal Server Error", error: err})
    //    } else if (company) {
    //        res.send({status: false, message: "Company already exists!!!"})
    //    } else {
            var newCompany = new app.db.models.Company({
                title     : 'Finsign Professional',
                domain   : 'domain.com',
                picture    : 'https://media.licdn.com/mpr/mpr/shrink_200_200/AAEAAQAAAAAAAAU9AAAAJDIxMTE0ODUwLTdmYzAtNDk3OS1hMWUzLWMyODdiYTdlNWFkYQ.png'
            });
            newCompany.save(function (err2, data) {
                if (err2) {
                    console.log("Internal Error in Saving Company " , err2);
                    //res.send({status: false, message: "Internal Error in Saving Company", error: err2})
                } else {
                    console.log("successfully created!!! ", data);
                    //res.send({status: true, data: data})
                }
            });
    //    }
    //})


});


