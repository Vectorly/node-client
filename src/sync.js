const async = require('async');

const filesize = require('filesize');

const request  = require('request');

const fs = require('fs');

module.exports = function (api_key) {

    return function sync(folder, options, callback, onprogress) {


        let video_list = [];
        let videos_to_download = [];
        let videos_skipped = [];
        let total_bytes_to_download = 0;
        let files_complete = 0;
        let total_files_to_download = 0;
        let bytes_downloaded = 0;


        async.series([getVideoList, getTotalToDownload, downloadAll], callback);


        function getVideoList(then) {

            if (!options.videos) {

                console.log("Fetching list of videos to sync ...");

                const list = require('./list')(api_key);

                list(function (err, videos) {

                    if (err) return then(err);

                    video_list = videos.map(video => video.id);

                    return then();

                });

            } else {

                video_list = options.videos;

                return then();
            }


        }

        function getTotalToDownload(cb) {

            total_files_to_download = video_list.length;

            console.log(`There are ${total_files_to_download} videos to download`);
            console.log("Gathering download meta data...");



            async.each(video_list, function (video_id, next) {

                let download = request({
                    headers: {
                        'x-api-key': api_key
                    },
                    uri: `https://api.vectorly.io/videos/download/${video_id}`,
                    method: 'HEAD'
                });

                download.on('response', function (data) {

                    let destination = `${folder}/${video_id}.mp4`;


                    if (fs.existsSync(destination)) {


                        let local_file = fs.statSync(destination);


                        let locally_modified = new Date(local_file.mtime);
                        let server_modified = new Date(data.headers['last-modified']);


                        if(local_file.size  < Number(data.headers['content-length'] )){

                            videos_to_download.push(video_id);
                            total_bytes_to_download += Number(data.headers['content-length']);
                            return next();

                        } else if(locally_modified > server_modified){

                            videos_skipped.push(video_id);
                            files_complete+=1;
                            return next();

                        } else{
                           // console.log("Fetcing latest from server");
                            videos_to_download.push(video_id);
                            total_bytes_to_download += Number(data.headers['content-length']);
                            return next();
                        }




                    } else {
                        videos_to_download.push(video_id);
                        total_bytes_to_download += Number(data.headers['content-length']);
                        return next();
                    }





                });


            }, cb);

        }

        function downloadAll(cb) {


            if(total_bytes_to_download === 0){

                console.log(`Local directory is already up do date`);
                return cb();
            } else {

                console.log(`${videos_skipped.length} videos already up to date`);
                console.log(`There are ${filesize(total_bytes_to_download)} bytes of video to download`);
            }





            async.eachLimit(videos_to_download, options.concurrency || 5, function (video_id, next) {

                let download = request({
                    headers: {
                        'x-api-key': api_key
                    },
                    uri: `https://api.vectorly.io/videos/download/${video_id}`,
                    method: 'GET'
                });


                let destination = `${folder}/${video_id}.mp4`;

                let dest = fs.createWriteStream(destination);



                download.on('data', function (chunk) {
                    bytes_downloaded += chunk.length;

                    if(!options.silent){
                        process.stdout.write(`Downloading ${filesize(bytes_downloaded)}/${filesize(total_bytes_to_download)}  (${files_complete}/${total_files_to_download} complete) \r`);
                    }
                });


                download.on('end', function (res) {
                    files_complete +=1;
                    next();
                });

                download.pipe(dest);


            }, cb);

        }

    }


};



