module.exports = function (app, mongoose) {

    var companySchema = new mongoose.Schema({
        title           : {type: String, required: true},
        domain          : {type: String, unique: true, required: true},
        picture         : {type: String, required: true}
    });

    app.db.model('Company', companySchema);
};
