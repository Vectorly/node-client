/**
 * Main Index for the server
 */

const fs = require('fs-extra');
const serveStatic = require('serve-static');
const path = require('path');


module.exports = {


    server: function (options, callback) {



        const express = require('express');
        const app = express();

        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Credentials", "true");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        app.use('/embed', serveStatic(path.join(__dirname, 'embed')));

        app.get('/file/v1/video/:video_id/filename/vvid.json', function (req, res) {

            res.sendFile(`${options.folder}/${req.params.video_id}.json`,  { root : process.cwd()});
        });


        app.get('/videos', function (req, res) {

            res.sendFile(`${options.folder}/videos.json`,  { root : process.cwd()});
        });

        app.get('/file/v1/video/:video_id/filename/video%2Fvideo.mp4', function (req, res) {

            res.sendFile(`${options.folder}/${req.params.video_id}.mp4`,  { root : process.cwd()});

        });


        app.listen(options.port || '8080', function() {
            console.log("Vectorly local server listening at port " + options.port);
            callback();
        });

    }

};





