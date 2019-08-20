
const request  = require('request');
const fs = require('fs-extra');

module.exports = function (api_key) {

    return function list(callback, folder) {

        request({
            headers: {
                'x-api-key': api_key,
                'Connection': 'keep-alive'
            },
            uri: 'https://api.vectorly.io/videos/list',
            method: 'GET'
        }, function (err, res, body) {

            if(err) {

                if(err.code === 'ENOTFOUND' && folder && fs.existsSync(`${folder}/videos.json`)){
                    return callback(null, fs.readJsonSync(`${folder}/videos.json`))
                } else return callback(err);

            } else{


                let videos = [];

                try{
                    videos = JSON.parse(body);

                    if(folder) {
                        fs.ensureDir(folder);
                        fs.writeJsonSync(`${folder}/videos.json`, videos);
                    }

                    return callback(null, videos);


                } catch (e) {

                    return callback(e);

                }

            }

        });


    }


};

