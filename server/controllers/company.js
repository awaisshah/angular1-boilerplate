exports = module.exports = function (app) {
    app.api.Company = {};

    /**
     * req.body = {
     *   companyName
     *   companyDomain
     *   companyImage             // Image url
     * }
     * */
    app.api.Company.createCompany = function (req, res) {
        app.db.models.Company.findOne({companyDomain: req.body.companyDomain}, function (err, company) {
            if (err) {
                res.send({status: false, message: "Internal Server Error", error: err})
            } else if (company) {
                res.send({status: false, message: "Company already exists!!!"})
            } else {
                var newCompany = new app.db.models.Company(req.body);
                newCompany.save(function (err2, data) {
                    if (err2) {
                        res.send({status: false, message: "Internal Error in Saving Company", error: err2})
                    } else {
                        res.send({status: true, data: data})
                    }
                })
            }
        })
    };
};