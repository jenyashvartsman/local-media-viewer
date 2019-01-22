'use strict';

module.exports = function(app) {
    let mediaFile = require('../controllers/mediaFileController');

    app.route('/api/media-file')
        .get(mediaFile.list_all);
};
