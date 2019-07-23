const request  = require('request');

const auth = require('./auth');
const fs = require('fs');


module.exports = function (api_key) {

    return function download(video_id, callback) {

        console.log("Downloading video");
        console.log(video_id);

        let token = auth(api_key)(video_id, 30);  //30 minute download ability

        let url = `https://api.vectorly.io/file/v1/video/${video_id}/filename/video%2Fvideo.mp4/token/${token.token}`;  // This doesn't work for some reason

        fs.writeFileSync('test.txt', url);

        let download =  request.get(url);

        let dest = fs.createWriteStream(`${video_id}.mp4`);


        console.log(url);
        download.pipe(dest);

        if(callback){
            download.on('error', callback);
            download.on('end', function (res) {

                console.log(res);
               callback(null, video_id);
            });
        }


        return download;

    };


};

