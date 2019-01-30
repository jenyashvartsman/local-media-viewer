'use strict';

const baseUrl = '/api/';

module.exports = function(app) {
    let appController = require('./appController');

    app.route(baseUrl + 'file')
        .get(appController.file);

    app.route(baseUrl + 'stream/start')
        .get(appController.streamStart);

    app.route(baseUrl + 'stream/stop')
        .get(appController.streamStop);
};
