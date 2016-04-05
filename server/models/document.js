module.exports = function (app, mongoose) {

    var documentSchema = new mongoose.Schema({
        documentTemplateId: {type: String, required : true},
        signedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        signed: {type: Boolean, required: true},
        signedAt: {type: Date, default: Date.now()},
        approved: {type: Boolean, required: true},
        approvedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        approvedAt: {type: Date, default: Date.now()},
        status : {type:String, required: true},
        envelopeId : {type: String, required:true}
    });
    app.db.model('Document', documentSchema);
};
