module.exports = function (app, mongoose) {
    var recipientSchema = new mongoose.Schema({
        recipientName: String,
        recipientEmail: String,
        envelopeId: String,
        recipientUser: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        status : String
    });
    app.db.model('Recipient', recipientSchema);
};