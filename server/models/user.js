module.exports = function (app, mongoose) {

    var userSchema = new mongoose.Schema({
        firstName   : {type: String, required: true},
        lastName    : {type: String, required: true},
        email       : {type: String, unique: true, required: true},
        picture     : {type: String},
        password    : {type: String, required: true},
        verified    : {type: String, required: true},
        companyId   : { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
        type        : { type: String, enum: ['Professional', 'Client', 'ComplianceOfficer'], required: true}
    });

    app.db.model('User', userSchema);
};
