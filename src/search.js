
const request  = require('request');


module.exports = function (api_key) {

    return function search(term, callback) {

        request({
            headers: {
                'x-api-key': api_key
            },
            uri: `https://api.vectorly.io/videos/search/${term}`,
            method: 'GET'
        }, function (err, res, body) {

            if(err) return callback(err);


            let videos = [];

            try{
                videos = JSON.parse(body);
                return callback(null, videos);


            } catch (e) {

                return callback(e);

            }

        });


    }


};

