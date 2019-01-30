'use strict';

const fs = require('fs'),
    os = require('os'),
    path = require('path');

const audioExt = ['wav', 'mp3', 'wma'];
const videoExt = ['mp4', 'avi', 'wmv', 'mov'];

exports.file = function (req, res) {
    let path = req.query.path ? req.query.path : os.homedir();
    let data = {
        path: path,
        files: []
    };

    // get all files and directories based on path
    fs.readdirSync(path).forEach(file => {
        try {
            const fullPath = path + '\\' + file;
            const fileData = fs.lstatSync(fullPath);

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

exports.streamStart = function (req, res) {
    const path = req.query.path;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize-1;
        const chunksize = (end-start)+1;
        const file = fs.createReadStream(path, {start, end});
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            /*'Content-Type': 'video/mp4',*/
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            /*'Content-Type': 'video/mp4',*/
        };
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
    }
};

exports.streamStop = function (req, res) {
    res.json();
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