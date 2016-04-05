module.exports = function (app, mongoose) {

    var step = new mongoose.Schema({
        name : {type: String, required: true},
        order: {type: String, required: true},
        status: {type: String, required: true, enum: ['waiting for signature', 'waiting for approval', 'done', ' '], default : 'waiting for signature'},
        documentId: {type: mongoose.Schema.Types.ObjectId, ref: "Document"},
        templateId: {type: String, required: true}
    });
    var processSchema = new mongoose.Schema({
        title: {type: String, required: true},
        domain: {type: String, required: true},
        picture: {type: String},
        clientId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        complianceOfficerId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        createdAt: {type: Date, default: Date.now()},
        steps: [step],
        token: {type: String},
        processTemplateId: {type: mongoose.Schema.Types.ObjectId, ref: "ProcessTemplate"}
    });

    app.db.model('Process', processSchema);
};
