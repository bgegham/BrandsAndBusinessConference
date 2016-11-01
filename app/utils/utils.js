var crypto = require('crypto');

module.exports = {
    send: function (response, data) {
        response.status(200).json(data);
    },
    created: function (response, data) {
        response.status(201).json(data);
    },
    setHeader: function (response, data) {
        response.setHeader("Location", '/home');
    },
    badRequest: function (response, errors) {
        response.status(400).json({errors: errors});
    },
    updated: function (response) {
        response.status(204).json();
    },
    unauthorized: function (response) {
        response.status(401).json({errors: 'Unauthorized'});
    },
    removeProperties: function (errors) {
        var fixedErrors = {};

        for(var key in errors) {
            fixedErrors[key] = errors[key].message;
        }

        return fixedErrors;
    },
    notFound: function (response) {
        response.status(404).send('File not found');
    },

    generateUniqueCode: function() {
        var current_date = (new Date()).valueOf().toString();
        var random = Math.random().toString();

        return crypto.createHash('sha1').update(current_date + random).digest('hex');
    }
};