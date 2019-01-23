'use strict';

const fs = require('fs'),
    os = require('os'),
    path = require('path');

const audioExt = ['wav', 'mp3', 'wma'];
const videoExt = ['mp4', 'avi', 'wmv', 'mkv'];

exports.list_all = function (req, res) {
    let location = req.query.location ? req.query.location : os.homedir();
    let data = {
        location: location,
        files: []
    };


    fs.readdirSync(location).forEach(file => {
        try {
            const fullPath = location + '\\' + file;
            const fileData = fs.lstatSync(location + '/' + file);

            data.files = [...data.files, {
                name: file,
                data: {
                    isDirectory: fileData.isDirectory(),
                    sizeBytes: fileData.size,
                    fullPath: fullPath,
                    type: fileData.isDirectory() ? 'DIRECTORY' : getType(fullPath)
                }
            }];
        } catch (e) {}
    });


    res.json(data);
};

function getExtension(filename) {
    let ext = path.extname(filename || '').split('.');
    return ext[ext.length - 1];
}

function getType(fullPath) {
    const ext = getExtension(fullPath);
    if (audioExt.indexOf(ext) > -1) {
        return 'AUDIO';
    } else if (videoExt.indexOf(ext) > -1) {
        return 'VIDEO';
    } else {
        return 'OTHER';
    }

}