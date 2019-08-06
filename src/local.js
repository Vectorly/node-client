/**
 * Main Index for the server
 */

const fs = require('fs-extra');

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



        app.use('/embed', express.static('embed'));

        app.get('/file/v1/video/:video_id/filename/vvid.json', function (req, res) {

            res.sendFile(`${options.folder}/${req.params.video_id}.json`,  { root : __dirname});
        });


        app.get('/videos', function (req, res) {

            res.sendFile(`${options.folder}/videos.json`,  { root : __dirname});
        });

        app.get('/file/v1/video/:video_id/filename/video%2Fvideo.mp4', function (req, res) {

            res.sendFile(`${options.folder}/${req.params.video_id}.mp4`,  { root : __dirname});

        });


        app.listen(options.port || '8080', function() {
            console.log("Vectorly local server listening at port " + options.port);
            callback();
        });

    }

};





