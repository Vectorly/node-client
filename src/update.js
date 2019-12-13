const async = require('async');

const filesize = require('filesize');

const request  = require('request');

const fs = require('fs-extra');

const auth =  require('./auth');



module.exports = function (api_key) {

    return function (options, callback) {

            let folder = process.env.VECTORLY_LOCAL_FOLDER || options.folder || 'vectorly_files';


            let new_videos = [];

            let total_bytes_to_download = 0;
            let files_complete = 0;
            let total_files_to_download = 0;
            let videos_to_update = [];
            let videos_up_to_date = [];
            let bytes_downloaded = 0;
            let videos_by_id = {};

            async.series([getVideoList, getTotalToDownload], function (err) {
                callback(err, {
                   videos_to_update: videos_to_update,
                   new_videos: new_videos,
                   videos_up_to_date:videos_to_update
                });
            });

            function getVideoList(then) {


                const list = require('./list')(api_key);

                list(function (err, videos) {

                    if (err) return then(err);

                    fs.writeJsonSync(`${folder}/videos.json`, videos);

                    video_list = videos.map(video => video.id);

                    videos.forEach(function (video) {
                        videos_by_id[video.id] = video;
                    });

                    return then();

                }, folder);

            }


            function getTotalToDownload(cb) {

                total_files_to_download = video_list.length;

                if(!options.silent)  console.log(`There are ${total_files_to_download} videos to download`);
                if(!options.silent) console.log("Gathering download meta data...");


                let videos = fs.readJsonSync(`${folder}/videos.json`);

                videos.forEach(function (video) {

                    let destination = `${folder}/${videos_by_id[video.id].name.split('.')[0] || video.id}.mp4`;


                    if (!fs.existsSync(destination)) {

                        new_videos.push(video);
                        total_bytes_to_download += video.size;

                    } else{

                        let local_file = fs.statSync(destination);

                        if(local_file.size < video.size *0.8 || local_file.size > video.size*1.2){

                            videos_to_update.push(video.id);
                            total_bytes_to_download += video.size;

                        } else{
                            videos_up_to_date.push(video.id);
                        }





                    }

                });

                return cb();

            }


        }
        


};



