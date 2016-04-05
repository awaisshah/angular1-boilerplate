module.exports = function (app, mongoose) {

    var stepTemplate = new mongoose.Schema({
        name: {type: String, required: true},
        order: {type: Number, required: true},
        //processTemplateId: {type: mongoose.Schema.Types.ObjectId, ref: "ProcessTemplate"},
        documentTemplateId: {type: String, required: true}
    });

    var processTemplateSchema = new mongoose.Schema({
        title: {type: String, required: true},
        domain: {type: String, required: true},
        picture: {type: String},
        stepTemplates: [stepTemplate],
        createdAt: {type: Date, default: Date.now()}
    });

    app.db.model('ProcessTemplate', processTemplateSchema);
};
