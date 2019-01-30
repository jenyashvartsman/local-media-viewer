'use strict';

module.exports = function(app) {
    let mediaFile = require('../controllers/mediaFileController');

    app.route('/api/media-file')
        .get(mediaFile.list_all);

    app.route('/api/stream-file')
        .get(mediaFile.stream_file);

    app.route('/api/stop-stream-file')
        .get(mediaFile.stop_stream_file);
};
