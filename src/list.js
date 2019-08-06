
const request  = require('request');
const fs = require('fs-extra');

module.exports = function (api_key) {

    return function list(callback) {

        request({
            headers: {
                'x-api-key': api_key
            },
            uri: 'https://api.vectorly.io/videos/list',
            method: 'GET'
        }, function (err, res, body) {

            if(err) {

                if(err.code === 'ENOTFOUND' && process.env.VECTORLY_LOCAL_FOLDER && fs.existsSync(`${process.env.VECTORLY_LOCAL_FOLDER}/videos.json`)){
                    return callback(null, fs.readJsonSync(`${process.env.VECTORLY_LOCAL_FOLDER}/videos.json`))
                } else return callback(err);

            } else{


                let videos = [];

                try{
                    videos = JSON.parse(body);

                    if(process.env.VECTORLY_LOCAL_FOLDER) {
                        fs.ensureDir(process.env.VECTORLY_LOCAL_FOLDER);
                        fs.writeJsonSync(`${process.env.VECTORLY_LOCAL_FOLDER}/videos.json`, videos);
                    }

                    return callback(null, videos);


                } catch (e) {

                    return callback(e);

                }

            }

        });


    }


};

