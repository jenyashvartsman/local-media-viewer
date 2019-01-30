'use strict';

const fs = require('fs'),
    os = require('os'),
    path = require('path');

const audioExt = ['wav', 'mp3', 'wma'];
const videoExt = ['mp4', 'avi', 'wmv', 'mkv', 'mov'];

let streamedContent;

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

exports.stream_file = function (req, res) {
    const path = req.query.location;
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
        streamedContent = fs.createReadStream(path).pipe(res);
    }
};

exports.stop_stream_file = function (req, res) {
    if (streamedContent) {
        streamedContent.close();
    }

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