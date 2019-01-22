'use strict';

const fs = require('fs'),
    os = require('os'),
    path = require('path');

const audioExt = ['wav', 'mp3', 'wma'];
const videoExt = ['mp4', 'avi', 'wmv', 'mkv'];

exports.list_all = function(req, res) {
    let location = req.query.location ? req.query.location : os.homedir();
    let files = [];

    fs.readdirSync(location).forEach(file => {
        const fullPath = location + '\\' + file;
        const fileData = fs.lstatSync(location + '/' + file);
        const ext = getExtension(fullPath);

        files = [...files, {
            name: file,
            data: {
                isDirectory: fileData.isDirectory(),
                sizeBytes: fileData.size,
                fullPath: fullPath,
                type: audioExt.indexOf(ext) > -1 ? 'AUDIO' : (videoExt.indexOf(ext) > -1 ? 'VIDEO' : 'OTHER')
            }
        }];
    });

    res.json(files);
};

function getExtension(filename) {
    let ext = path.extname(filename||'').split('.');
    return ext[ext.length - 1];
}