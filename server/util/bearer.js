var moment = require('moment');
module.exports = function (app, bearer, bcryptnodejs) {

    bearer({
        //Make sure to pass in the app (express) object so we can set routes
        app: app,
        //Please change server key for your own safety!
        serverKey: "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678",
        tokenUrl: '/api/signin', //Call this URL to get your token. Accepts only POST method
        extendTokenUrl: '/extendtoken', //Call this URL to get your token. Accepts only POST method
        cookieName: 'Authorization', //default name for getting token from cookie when not found in Authorization header
        createToken: function (req, next, cancel) {
            //var useremail = req.body.userEmail;

            console.log('CREATE TOKEN');
            app.api.User.signin(req, next, cancel, bcryptnodejs);

        },
        extendToken: function (req, next, cancel) {
            var token = req.authToken;
            if (token) {
                next({
                    expire: moment(Date.now()).add('days', 1).format('YYYY-MM-DD HH:mm:ss'),
                    email: token.useremail,
                    contentType: req.get('Content-Type'),
                    ip: req.ip,
                    userAgent: req.header('user-agent'),
                    userId: req.body._id,
                    another: 'Some data you need in your token',
                    moreData: 'Some more data you need'
                });
            } else {
                cancel();
            }
        },
        validateToken: function (req, token) {
            //you could also check if request came from same IP using req.ip==token.ip for example
            console.log('1 Validating Token');
            if (token) {
                return moment(token.expire) > moment(new Date());
            }
            return false;
        },
        onTokenValid: function (token, next, cancel) {
            var useremail = token.useremail;
            console.log('2 Token Valid');
            if (token) {
                next(token)
            } else {
                cancel();
            }
        },
        userInRole: function (token, roles, next, cancel) {
            var useremail = token.useremail;
            console.log('3 User In Role');
            if (true) {
                next();
            } else {
                cancel();
            }
        },
        onAuthorized: function (req, token, res) {

            console.log("On Authorized line 64 bearer");
            //console.log("req.headers bearer",req.headers);
        },
        onUnauthorized: function (req, token, res, errorMessage) {

            console.log(req.path, "this will be executed if request fails authentication");

            res.send({status: false, message: errorMessage});
        },
        secureRoutes: [
            {url: '/updateuser', method: 'post'},
            {url: '/home', method: 'get'},
            {url: '/api/gettemplates', method: 'get'},
            {url: '/api/processtemplate', method: 'get'},
            {url: '/api/process', method: 'post'},
            {url: '/product/*', method: 'post'} //any action under /secure route but NOT default "/secure" route
        ]
    });
};