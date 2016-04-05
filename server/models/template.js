module.exports = function (app, mongoose) {
    var templateSchema = new mongoose.Schema({
        templateName: String,
        templateId: String
    });
    app.db.model('Templates', templateSchema);
};