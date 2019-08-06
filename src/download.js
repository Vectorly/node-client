const request  = require('request');
const fs = require('fs');

const filesize = require('filesize');

module.exports = function (api_key) {

    return function download(video_id, options, callback) {


        let total  = 0;
        let progress = 0;

        let destination_name = options.destination || `${video_id}.mp4`;

        let dest = fs.createWriteStream(destination_name);

        let download = request({
            headers: {
                'x-api-key': api_key
            },
            uri: `https://api.vectorly.io/videos/download/${video_id}`,
            method: 'GET'
        });

        download.on( 'response', function ( data ) {
            total = data.headers[ 'content-length' ];
        });


        download.on('data', function (chunk) {
            progress += chunk.length;

            if(!options.silent){

                process.stdout.write(`Downloading ${destination_name}: ${filesize(progress)}/${filesize(total)} \r`);

            }
        });


        download.pipe(dest);


        if(callback){
            download.on('error', callback);
            download.on('end', function (res) {

                if(!options.silent){
                    console.log(`\nFinished download ${destination_name}`);
                }

               callback(null, destination_name);
            });
        }


        return download;

    };


};

