var crypto = require('crypto');
exports = module.exports = function (app) {
    function randomValueHex(len) {
        return crypto.randomBytes(Math.ceil(len / 2))
            .toString('hex')
            .slice(0, len);
    }
    app.utils.generateConfirmationCode = function (length) {
        console.log("length", length);
        length = (typeof length === 'undefined') ? 7 : length;
        return randomValueHex(length);
    }

};